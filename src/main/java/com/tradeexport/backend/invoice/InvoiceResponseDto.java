package com.tradeexport.backend.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InvoiceResponseDto (
       Long id,
       Long ordersId,
       String invoiceNumber,
       LocalDateTime invoiceDate,
       InvoiceStatus status,
       BigDecimal totalAmount,
       BigDecimal convertedAmount,
       BigDecimal exchangeRate,
       String currency,
       String orderNumber
) {
public static InvoiceResponseDto from(Invoice invoice) {
    return new InvoiceResponseDto(
            invoice.getId(),
            invoice.getOrders().getId(),
            invoice.getInvoiceNumber(),
            invoice.getInvoiceDate(),
            invoice.getStatus(),
            invoice.getTotalAmount(),
            invoice.getConvertedAmount(),
            invoice.getExchangeRate(),
            invoice.getCurrency(),
            invoice.getOrders().getOrderNumber()
        );
    }
}
