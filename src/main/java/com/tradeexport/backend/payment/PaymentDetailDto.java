package com.tradeexport.backend.payment;

import com.tradeexport.backend.dashboard.PaymentRecordDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PaymentDetailDto(
        String invoiceNumber,
        LocalDate invoiceDate,
        BigDecimal invoiceAmount,
        BigDecimal invoiceConvertedAmount,
        BigDecimal totalPaid,
        BigDecimal remaining,
        List<PaymentRecordDto> payments
) {}