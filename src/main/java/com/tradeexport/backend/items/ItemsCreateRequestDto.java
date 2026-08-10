package com.tradeexport.backend.items;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ItemsCreateRequestDto {
    @NotBlank
    private String productName;

    @NotNull
    private BigDecimal price;

    @NotNull
    private Integer setQty;

    @NotNull
    private BigDecimal standardWeight;
}
