package com.tradeexport.backend.invoice;

import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersItems;
import com.tradeexport.backend.orders.OrdersItemsRepository;
import com.tradeexport.backend.orders.OrdersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InvoiceService {
    final private InvoiceRepository invoiceRepository;
    final private OrdersRepository ordersRepository;
    final private OrdersItemsRepository ordersItemsRepository;
    final private InvoiceItemsRepository invoiceItemsRepository;

    public void createInvoice(Long ordersId, InvoiceCreateRequestDto dto) {
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
        invoice.setStatus("ISSUED");
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
    }
}
