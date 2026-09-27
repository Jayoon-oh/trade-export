package com.tradeexport.backend.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailDto (
        Long orderId,
        String orderNumber,
        String buyerName,
        BigDecimal amount,

        // invoice
        String invoiceNumber,
        LocalDateTime invoiceDate,
        BigDecimal invoiceAmount,
        BigDecimal exchangeRate,

        // payment info
        BigDecimal totalPaid,
        BigDecimal remaining,
        List<PaymentRecordDto> payments
){}
