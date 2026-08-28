package com.tradeexport.backend.quotation;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class QuotationItemRequestDto { //per item request
    @NotNull
    private Long itemsId;

    @NotNull
    private Integer quantity;
}
