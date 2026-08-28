package com.tradeexport.backend.quotation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuotationCreateRequestDto {
    @NotNull
    private Long companyId;

    @NotBlank
    private String currency;

    @NotBlank
    private String incoterms;

    @NotBlank
    private String paymentTerm;

    private String comment;

    @NotNull
    private List<QuotationItemRequestDto> items;
}
