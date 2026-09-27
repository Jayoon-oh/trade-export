package com.tradeexport.backend.invoice;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersItems;
import com.tradeexport.backend.orders.OrdersItemsRepository;
import com.tradeexport.backend.orders.OrdersRepository;
import com.tradeexport.backend.payment.Payment;
import com.tradeexport.backend.payment.PaymentRepository;
import com.tradeexport.backend.payment.PaymentStatus;
import com.tradeexport.backend.pdf.PdfService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

        // Use the order's own exchange rate if it was fixed at the quotation stage.
        // otherwise fall back to the rate entered at invoice.
        BigDecimal exchangeRate = orders.getExchangeRate() != null
                ? orders.getExchangeRate()
                : dto.getExchangeRate();

        // invoiceNumber
        String year = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String prefix = "INV-" + year + "-";
        long countThisYear = invoiceRepository.countByInvoiceNumberStartingWith(prefix);
        String seq = String.format("%04d", countThisYear + 1);
        String invoiceNumber = prefix + seq;

        // Map original order items to lookup unit prices
        List<OrdersItems> ordersItemsList = ordersItemsRepository.findByOrdersId(orders.getId());
        Map<Long, OrdersItems> ordersItemsMap = ordersItemsList.stream()
                .collect(Collectors.toMap(oi -> oi.getItems().getId(), oi -> oi));

        // If all existing invoices for this order are CANCELLED (or none exist),
        // It's effectively the first invoice, so include the freight cost.
        boolean isFirstInvoice = invoiceRepository.findByOrdersId(ordersId).stream()
                .allMatch(inv -> inv.getStatus() == InvoiceStatus.CANCELLED);

        Invoice invoice = new Invoice();
        invoice.setOrders(orders);
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setInvoiceDate(LocalDateTime.now());
        invoice.setStatus(InvoiceStatus.ISSUED);
        invoice.setExchangeRate(exchangeRate);
        invoice.setCurrency(orders.getCurrency());

        invoiceRepository.save(invoice);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (InvoiceItemRequestDto itemDto : dto.getItems()) {
            OrdersItems matchedOrderItem = ordersItemsMap.get(itemDto.getItemsId());
            if (matchedOrderItem == null) {
                throw new IllegalArgumentException("오더에 없는 품목입니다.");
            }

            // Convert unit price from KRW (Items master price) to the order's currency using this invoice's exchange rate
            BigDecimal unitPriceConverted = matchedOrderItem.getUnitPrice().divide(exchangeRate, 2, RoundingMode.HALF_UP);
            BigDecimal lineAmount = unitPriceConverted.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            InvoiceItems invoiceItems = new InvoiceItems();
            invoiceItems.setInvoice(invoice);
            invoiceItems.setItems(matchedOrderItem.getItems());
            invoiceItems.setUnitPrice(unitPriceConverted);
            invoiceItems.setQuantity(itemDto.getQuantity());
            invoiceItems.setAmount(lineAmount);
            invoiceItemsRepository.save(invoiceItems);

            totalAmount = totalAmount.add(lineAmount);
        }

        if (isFirstInvoice && orders.getFreightCost() != null) {
            BigDecimal freightConverted = orders.getFreightCost().divide(exchangeRate, 2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(freightConverted);
        }

        invoice.setTotalAmount(totalAmount);

        // converte targeting currency
        if (exchangeRate != null) {
            BigDecimal converted = totalAmount.multiply(exchangeRate);
            invoice.setConvertedAmount(converted);
        }

        return invoiceRepository.save(invoice);
    }

    public Invoice issueInvoice(Long ordersId, InvoiceCreateRequestDto dto) {
        List<RemainingItemDto> remainingItems = getRemainingItems(ordersId);

        // Block issuing invoice, if remaining quantity is Zero
        boolean allFullyInvoiced = remainingItems.stream()
                .allMatch(item -> item.remainingQuantity() <= 0);

        if (allFullyInvoiced) {
            throw new IllegalStateException("이미 모든 품목이 청구되었습니다.");
        }

        // Verify the numbers of items doesn't exceed remaining items
        Map<Long, Integer> remainingMap = remainingItems.stream()
                .collect(Collectors.toMap(RemainingItemDto::itemsId, RemainingItemDto::remainingQuantity));

        for (InvoiceItemRequestDto itemDto : dto.getItems()) {
            Integer remaining = remainingMap.getOrDefault(itemDto.getItemsId(), 0);
            if (itemDto.getQuantity() > remaining) {
                throw new IllegalStateException("품목 잔여 수량을 초과했습니다. (잔여: " + remaining + ")");
            }
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
        List<Payment> payments  = paymentRepository.findByInvoiceId(invoiceId);

        boolean hasActivePayment = payments.stream()
                .anyMatch(p -> p.getStatus() != PaymentStatus.CANCELLED);

        if(hasActivePayment) {
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

        // Freight was stored in KRW on Orders; convert it using this invoice's exchange rate for display
        BigDecimal freightConverted = null;
        if (invoice.getOrders().getFreightCost() != null && invoice.getExchangeRate() != null) {
            freightConverted = invoice.getOrders().getFreightCost()
                    .divide(invoice.getExchangeRate(), 2, RoundingMode.HALF_UP);
        }

        return new InvoicePdfDataDto(
                invoice.getInvoiceNumber(),
                invoice.getInvoiceDate(),
                invoice.getCurrency(),
                invoice.getExchangeRate(),
                invoice.getTotalAmount(),
                freightConverted,

                seller.getCompanyName(),
                seller.getAddress(),
                seller.getRegistrationNumber(),
                seller.getNameOfOwner(),
                pdfService.resolveImagePath(seller.getLogoPath()),
                pdfService.resolveImagePath(seller.getSignaturePath()),

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
        data.put("sellerLogoPath", pdfService.resolveImagePath(dto.sellerLogoPath()));
        data.put("sellerSignaturePath", pdfService.resolveImagePath(dto.sellerSignaturePath()));
        data.put("buyerName", dto.buyerName());
        data.put("buyerAddress", dto.buyerAddress());
        data.put("buyerRegistrationNumber", dto.buyerRegistrationNumber());
        data.put("invoiceNumber", dto.invoiceNumber());
        data.put("invoiceDate", dto.invoiceDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        data.put("currency", dto.currency());
        data.put("exchangeRate", dto.exchangeRate());
        data.put("totalAmount", dto.totalAmount());
        data.put("freightCost", dto.freightCost());
        data.put("items", dto.items());

        return pdfService.generatePdf("pdf/invoice", data);
    }

    public List<InvoiceResponseDto> getInvoicesByStatus(InvoiceStatus status) {
        List<Invoice> invoices = status != null
                ? invoiceRepository.findByStatus(status)
                : invoiceRepository.findAll();
        return invoices.stream().map(InvoiceResponseDto::from).toList();
    }

    // Calculate numbers of made invoice items
    // for making Partial invoice
    public Map<Long, Integer> getInvoicedQuantitiesByItem(Long ordersId) {
        List<Invoice> invoices = invoiceRepository.findByOrdersId(ordersId).stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.CANCELLED)
                .toList();

        Map<Long, Integer> invoicedQty = new HashMap<>();

        for (Invoice invoice : invoices) {
            List<InvoiceItems> items = invoiceItemsRepository.findByInvoiceId(invoice.getId());
            for (InvoiceItems item : items) {
                Long itemsId = item.getItems().getId();
                // id doesn't exist, generate Quantity as new
                // if existed, accumulate sum
                invoicedQty.merge(itemsId, item.getQuantity(), Integer::sum);
            }
        }

        return invoicedQty;
    }

    public List<RemainingItemDto> getRemainingItems(Long ordersId) {
        List<OrdersItems> orderItems = ordersItemsRepository.findByOrdersId(ordersId);
        Map<Long, Integer> invoicedQty = getInvoicedQuantitiesByItem(ordersId);

        return orderItems.stream()
                .map(oi -> {
                    Long itemsId = oi.getItems().getId();
                    int ordered = oi.getQuantity();
                    int invoiced = invoicedQty.getOrDefault(itemsId, 0);
                    int remaining = ordered - invoiced;

                    return new RemainingItemDto(
                            itemsId,
                            oi.getItems().getProductName(),
                            ordered,
                            invoiced,
                            remaining,
                            oi.getUnitPrice()
                    );
                })
                .toList();
    }


}
