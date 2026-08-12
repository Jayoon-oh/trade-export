package com.tradeexport.backend.packinglist;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PackingListItemRequestDto {
    @NotNull
    private Long itemsId;

    @NotNull
    private Integer quantity;

    @NotNull
    private BigDecimal actualWeight;
}
