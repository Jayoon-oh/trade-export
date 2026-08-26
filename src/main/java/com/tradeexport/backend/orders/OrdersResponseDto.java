package com.tradeexport.backend.orders;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrdersResponseDto(
        Long id,
        Long buyerId,
        String buyerName,
        Long quotationId,
        BigDecimal amount,
        LocalDateTime ordersDate,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String currency,
        String incoterms,
        String paymentTerm
) {
    public static OrdersResponseDto from(Orders orders) {
        Long quotationId = orders.getQuotation() != null ? orders.getQuotation().getId() : null;

        return new OrdersResponseDto(
                orders.getId(),
                orders.getBuyer().getId(),
                orders.getBuyer().getCompanyName(),
                quotationId,
                orders.getAmount(),
                orders.getOrdersDate(),
                orders.getComment(),
                orders.getCreatedAt(),
                orders.getUpdatedAt(),
                orders.getCurrency(),
                orders.getIncoterms(),
                orders.getPaymentTerm()
        );
    }
}