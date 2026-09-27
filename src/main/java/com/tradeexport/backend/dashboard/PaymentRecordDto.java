package com.tradeexport.backend.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentRecordDto (
        LocalDate paymentDate,
        BigDecimal amount
) {}
