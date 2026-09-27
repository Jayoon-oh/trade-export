package com.tradeexport.backend.payment;

import java.time.LocalDateTime;

public record PaymentStatusHistoryDto (
        PaymentStatus previousStatus,
        PaymentStatus newStatus,
        LocalDateTime changedAt,
        String changedByName
) {}
