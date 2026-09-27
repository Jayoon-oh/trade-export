package com.tradeexport.backend.quotation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record QuotationResponseDto(
        Long id,
        Long companyId,
        String companyName,
        String companyCountry,
        LocalDate quotationDate,
        BigDecimal totalAmount,
        String currency,
        String incoterms,
        String paymentTerm,
        String comment
) {
    public static QuotationResponseDto from(Quotation quotation) {
        return new QuotationResponseDto(
                quotation.getId(),
                quotation.getCompany().getId(),
                quotation.getCompany().getCompanyName(),
                quotation.getCompany().getCountry(),
                quotation.getQuotationDate(),
                quotation.getTotalAmount(),
                quotation.getCurrency(),
                quotation.getIncoterms(),
                quotation.getPaymentTerm(),
                quotation.getComment()
        );
    }
}