package com.tradeexport.backend.quotation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record QuotationPdfDataDto(
        String quotationNumber,
        LocalDate quotationDate,
        String currency,
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

        List<QuotationItemLineDto> items
) {}