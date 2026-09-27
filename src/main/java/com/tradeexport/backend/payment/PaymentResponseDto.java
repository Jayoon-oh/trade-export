package com.tradeexport.backend.payment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PaymentResponseDto (
    Long id,
    Long invoiceId,
    String invoiceNumber,
    Long buyerId,
    String buyerName,
    BigDecimal amount,
    String currency,
    LocalDate paymentDate,
    PaymentStatus status,
    String orderNumber,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
){
    public static PaymentResponseDto from(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getInvoice().getId(),
                payment.getInvoice().getInvoiceNumber(),
                payment.getInvoice().getOrders().getBuyer().getId(),
                payment.getInvoice().getOrders().getBuyer().getCompanyName(),
                payment.getAmount(),
                payment.getInvoice().getCurrency(),
                payment.getPaymentDate(),
                payment.getStatus(),
                payment.getInvoice().getOrders().getOrderNumber(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}
