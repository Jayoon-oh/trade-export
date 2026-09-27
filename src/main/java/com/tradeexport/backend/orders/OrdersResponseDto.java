package com.tradeexport.backend.orders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record OrdersResponseDto(
        Long id,
        Long buyerId,
        String buyerName,
        String buyerCountry,
        Long quotationId,
        BigDecimal amount,
        LocalDate ordersDate,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String currency,
        BigDecimal exchangeRate,
        String incoterms,
        String paymentTerm,
        String orderNumber,
        boolean hasInvoice,
        BigDecimal freightCost,
        Boolean freightCoveredByCompany

) {
    public static OrdersResponseDto from(Orders orders, boolean hasInvoice) {
        Long quotationId = orders.getQuotation() != null ? orders.getQuotation().getId() : null;

        return new OrdersResponseDto(
                orders.getId(),
                orders.getBuyer().getId(),
                orders.getBuyer().getCompanyName(),
                orders.getBuyer().getCountry(),
                quotationId,
                orders.getAmount(),
                orders.getOrdersDate(),
                orders.getComment(),
                orders.getCreatedAt(),
                orders.getUpdatedAt(),
                orders.getCurrency(),
                orders.getExchangeRate(),
                orders.getIncoterms(),
                orders.getPaymentTerm(),
                orders.getOrderNumber(),
                hasInvoice,
                orders.getFreightCost(),
                orders.getFreightCoveredByCompany()
        );
    }
}