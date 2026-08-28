package com.tradeexport.backend.invoice;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersItems;
import com.tradeexport.backend.orders.OrdersItemsRepository;
import com.tradeexport.backend.orders.OrdersRepository;
import com.tradeexport.backend.payment.Payment;
import com.tradeexport.backend.payment.PaymentRepository;
import com.tradeexport.backend.pdf.PdfService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class InvoiceService {
    final private InvoiceRepository invoiceRepository;
    final private OrdersRepository ordersRepository;
    final private OrdersItemsRepository ordersItemsRepository;
    final private InvoiceItemsRepository invoiceItemsRepository;
    final private PaymentRepository paymentRepository;
    final private CompanyRepository companyRepository;
    final private PdfService pdfService;

    private Invoice createInvoice(Long ordersId, InvoiceCreateRequestDto dto) {
        Orders orders = ordersRepository.findById(ordersId)
                .orElseThrow(() -> new IllegalArgumentException("오더 없음"));

        // invoiceNumber
        String year = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String prefix = "INV-" + year + "-";
        long countThisYear = invoiceRepository.countByInvoiceNumberStartingWith(prefix);
        String seq = String.format("%04d", countThisYear + 1);
        String invoiceNumber = prefix + seq;

        Invoice invoice = new Invoice();
        invoice.setOrders(orders);
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setInvoiceDate(LocalDateTime.now());
        invoice.setStatus(InvoiceStatus.ISSUED);
        invoice.setTotalAmount(orders.getAmount());
        invoice.setExchangeRate(dto.getExchangeRate());
        invoice.setCurrency(orders.getCurrency());

        invoiceRepository.save(invoice);

        List<OrdersItems> ordersItemsList = ordersItemsRepository.findByOrdersId(orders.getId());
        for (OrdersItems oi : ordersItemsList) {
            InvoiceItems invoiceItems = new InvoiceItems();
            invoiceItems.setInvoice(invoice);
            invoiceItems.setItems(oi.getItems());
            invoiceItems.setUnitPrice(oi.getUnitPrice());
            invoiceItems.setQuantity(oi.getQuantity());
            invoiceItems.setAmount(oi.getAmount());
            invoiceItemsRepository.save(invoiceItems);
        }
        return invoice;
    }

    public Invoice issueInvoice(Long ordersId, InvoiceCreateRequestDto dto) {
        List<Invoice> existingInvoice = invoiceRepository.findByOrdersId(ordersId);

        boolean hasActiveInvoice = existingInvoice.stream()
                .anyMatch(invoice -> !invoice.getStatus().equals(InvoiceStatus.CANCELLED));

        if (hasActiveInvoice) {
            throw new IllegalStateException("이미 유효한 인보이스가 존재합니다");
        }

        return createInvoice(ordersId, dto);
    }

    public List<InvoiceResponseDto> getInvoices(Long id) {
        return invoiceRepository.findByOrdersId(id)
                .stream()
                .map(InvoiceResponseDto::from)
                .toList();
    }

    public InvoiceResponseDto updateInvoice(Long invoiceId, InvoiceStatus status) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(()-> new IllegalArgumentException("인보이스 발행내역 없음"));


        // block CANCELLED when payment is exists.
        List<Payment> existingPayment = paymentRepository.findByInvoiceId(invoiceId);
        if(!existingPayment.isEmpty()) {
            throw new IllegalStateException("이미 결제내역이 존재하는 경우 인보이스 취소가 불가능합니다.");
        }

        invoice.setStatus(status);
        Invoice saved = invoiceRepository.save(invoice);

        return InvoiceResponseDto.from(saved);
    }

    public InvoicePdfDataDto getInvoicePdfData(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(()-> new IllegalArgumentException("인보이스 없음"));

        Company seller = companyRepository.findByRole("SELLER").get(0);

        Company buyer = invoice.getOrders().getBuyer();

        List<InvoiceItems> invoiceItems = invoiceItemsRepository.findByInvoiceId(invoiceId);

        List<InvoiceItemLineDto> itemLines = invoiceItems.stream()
                .map(item -> new InvoiceItemLineDto(
                        item.getItems().getProductName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getAmount()
                ))
                .toList();

        return new InvoicePdfDataDto(
                invoice.getInvoiceNumber(),
                invoice.getInvoiceDate(),
                invoice.getCurrency(),
                invoice.getExchangeRate(),
                invoice.getTotalAmount(),

                seller.getCompanyName(),
                seller.getAddress(),
                seller.getRegistrationNumber(),
                seller.getNameOfOwner(),
                seller.getLogoPath(),
                seller.getSignaturePath(),

                buyer.getCompanyName(),
                buyer.getAddress(),
                buyer.getRegistrationNumber(),

                itemLines
        );
    }

    public byte[] generateInvoicePdf(Long invoiceId) {
        InvoicePdfDataDto dto = getInvoicePdfData(invoiceId);

        Map<String, Object> data = new HashMap<>();
        data.put("sellerName", dto.sellerName());
        data.put("sellerAddress", dto.sellerAddress());
        data.put("sellerRegistrationNumber", dto.sellerRegistrationNumber());
        data.put("sellerOwnerName", dto.sellerOwnerName());
        data.put("sellerLogoPath", dto.sellerLogoPath());
        data.put("sellerSignaturePath", dto.sellerSignaturePath());
        data.put("buyerName", dto.buyerName());
        data.put("buyerAddress", dto.buyerAddress());
        data.put("buyerRegistrationNumber", dto.buyerRegistrationNumber());
        data.put("invoiceNumber", dto.invoiceNumber());
        data.put("invoiceDate", dto.invoiceDate());
        data.put("currency", dto.currency());
        data.put("exchangeRate", dto.exchangeRate());
        data.put("totalAmount", dto.totalAmount());
        data.put("items", dto.items());

        return pdfService.generatePdf("pdf/invoice", data);
    }
}
