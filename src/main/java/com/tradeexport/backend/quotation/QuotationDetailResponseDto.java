package com.tradeexport.backend.quotation;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuotationDetailResponseDto {
    private Quotation quotation;
    private List<QuotationItems> items;
}
