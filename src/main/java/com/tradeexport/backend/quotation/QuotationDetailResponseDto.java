package com.tradeexport.backend.quotation;

import java.util.List;

public record QuotationDetailResponseDto(
        QuotationResponseDto quotation,
        List<QuotationItemLineDto> items
) {
    public static QuotationDetailResponseDto from(Quotation quotation, List<QuotationItems> items) {
        return new QuotationDetailResponseDto(
                QuotationResponseDto.from(quotation),
                items.stream().map(QuotationItemLineDto::from).toList()
        );
    }
}