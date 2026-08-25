package com.tradeexport.backend.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record InvoicePdfDataDto(
        String invoiceNumber,
        LocalDateTime invoiceDate,
        String currency,
        BigDecimal exchangeRate,
        BigDecimal totalAmount,

        String sellerName,
        String sellerAddress,
        String sellerRegistrationNumber,
        String sellerOwnerName,
        String sellerLogoPath,
        String sellerSignaturePath,

        String buyerName,
        String buyerAddress,
        String buyerRegistrationNumber,

        List<InvoiceItemLineDto> items
) {}
