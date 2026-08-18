package com.tradeexport.backend.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponseDto (
    Long id,
    Long invoiceId,
    BigDecimal amount,
    LocalDateTime paymentDate,
    PaymentStatus status,
    LocalDateTime createAt,
    LocalDateTime updatedAt
){
    public static PaymentResponseDto from(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getInvoice().getId(),
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getStatus(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}
