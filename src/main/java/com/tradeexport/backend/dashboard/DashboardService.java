package com.tradeexport.backend.dashboard;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceRepository;
import com.tradeexport.backend.invoice.InvoiceStatus;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersRepository;
import com.tradeexport.backend.packinglist.PackingList;
import com.tradeexport.backend.packinglist.PackingListRepository;
import com.tradeexport.backend.payment.Payment;
import com.tradeexport.backend.payment.PaymentRepository;
import com.tradeexport.backend.payment.PaymentStatus;
import com.tradeexport.backend.quotation.Quotation;
import com.tradeexport.backend.quotation.QuotationRepository;
import com.tradeexport.backend.security.CurrentUserProvider;
import com.tradeexport.backend.shipment.Shipment;
import com.tradeexport.backend.shipment.ShipmentRepository;
import com.tradeexport.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrdersRepository ordersRepository;
    private final InvoiceRepository invoiceRepository;
    private final ShipmentRepository shipmentRepository;
    private final PackingListRepository packingListRepository;
    private final QuotationRepository quotationRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUserProvider currentUserProvider;

    // order list of login user
    public List<OrderPipelineDto> getMyOrderPipeline() {
        User currentUser = currentUserProvider.getCurrentUser();
        List<Orders> myOrders = ordersRepository.findByCreatedBy(currentUser);

        return myOrders.stream()
                .map(this::buildPipelineDto)
                .toList();
    }

    // filtered orders transform in Pipeline Card
    private OrderPipelineDto buildPipelineDto(Orders orders) {
        List<Invoice> invoices = invoiceRepository.findByOrdersId(orders.getId());
        boolean hasInvoice = invoices.stream().anyMatch(inv -> inv.getStatus() != InvoiceStatus.CANCELLED);

        List<Shipment> shipments = shipmentRepository.findByOrdersId(orders.getId());
        boolean hasShipment = !shipments.isEmpty();

        List<PackingList> packingLists = packingListRepository.findByOrdersList(orders.getId());
        boolean hasPackingList = !packingLists.isEmpty();

        BigDecimal totalPaid = invoices.stream()
                .flatMap(inv -> paymentRepository.findByInvoiceId(inv.getId()).stream())
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalInvoiceAMount = invoices.stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.CANCELLED)
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean isFullyPaid = hasInvoice && totalPaid.compareTo(totalInvoiceAMount) >= 0;

        return new OrderPipelineDto(
                orders.getId(),
                orders.getOrderNumber(),
                orders.getBuyer().getCompanyName(),
                orders.getAmount(),
                orders.getQuotation() != null,
                hasInvoice,
                hasShipment,
                hasPackingList,
                isFullyPaid,
                determineNextAction(hasInvoice, hasShipment, hasPackingList, isFullyPaid)
        );
    }

    private String determineNextAction(boolean hasInvoice, boolean hasShipment, boolean hasPackingList, boolean isFullyPaid) {
        if (!hasInvoice) return "인보이스 발행";
        if (!hasShipment) return "선적 등록";
        if (!hasPackingList) return "패킹리스트 등록";
        if (!isFullyPaid) return "결제 기록 추가";
        return "완료";
    }

    public PipelineFunnelDto getPipelineFunnel() {
        User currentUser = currentUserProvider.getCurrentUser();

        List<Quotation> myQuotations = quotationRepository.findByCreatedBy(currentUser);
        long quotationCount = myQuotations.size();
        BigDecimal quotationAmount = myQuotations.stream()
                .map(Quotation::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Orders> myOrders = ordersRepository.findByCreatedBy(currentUser);
        long ordersCount = myOrders.size();
        BigDecimal ordersAmount = myOrders.stream()
                .map(Orders::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Invoice> myInvoices = invoiceRepository.findByCreatedBy(currentUser);
        long invoiceCount = myInvoices.size();
        BigDecimal invoiceAmount = myInvoices.stream()
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Shipment> myShipments = shipmentRepository.findByCreatedBy(currentUser);
        long shipmentCount = myShipments.size();

        List<Payment> myPayments = paymentRepository.findByCreatedBy(currentUser);
        long paymentCount = (int) myPayments.stream()
                .filter(p-> p.getStatus() == PaymentStatus.COMPLETED)
                .count();

        BigDecimal paymentAmount = myPayments.stream()
                .filter(p-> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PipelineFunnelDto(
                quotationCount, quotationAmount,
                ordersCount, ordersAmount,
                invoiceCount, invoiceAmount,
                shipmentCount,
                paymentCount, paymentAmount
        );
    }

    public OrderDetailDto getOrderDetail(Long orderId) {
        Orders orders = ordersRepository.findById(orderId)
                .orElseThrow(()-> new IllegalArgumentException("오더 없음"));

        List<Invoice> invoices = invoiceRepository.findByOrdersId(orderId);
        Invoice invoice  = invoices.stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.CANCELLED)
                .findFirst()
                .orElse(null);

        String invoiceNumber = invoice != null ? invoice.getInvoiceNumber() : null;
        LocalDateTime invoiceDate = invoice != null ? invoice.getInvoiceDate() : null;
        BigDecimal invoiceAmount = invoice != null ? invoice.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal exchangeRate = invoice != null ? invoice.getExchangeRate() : null;

        BigDecimal totalPaid = BigDecimal.ZERO;
        List<PaymentRecordDto> payments = List.of();

        if (invoice != null) {
            List<Payment> invoicePayments = paymentRepository.findByInvoiceId(invoice.getId());

            totalPaid = invoicePayments.stream()
                    .filter(p-> p.getStatus() == PaymentStatus.COMPLETED)
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            payments = invoicePayments.stream()
                    .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                    .map(p -> new PaymentRecordDto(p.getPaymentDate(), p.getAmount()))
                    .toList();
        }

        BigDecimal remaining = invoiceAmount.subtract(totalPaid);

        return new OrderDetailDto(
                orderId,
                orders.getOrderNumber(),
                orders.getBuyer().getCompanyName(),
                orders.getAmount(),
                invoiceNumber,
                invoiceDate,
                invoiceAmount,
                exchangeRate,
                totalPaid,
                remaining,
                payments
        );
    }
}
