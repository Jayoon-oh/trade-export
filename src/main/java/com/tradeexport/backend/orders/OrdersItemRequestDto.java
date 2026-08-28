package com.tradeexport.backend.orders;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdersItemRequestDto {
    @NotNull
    private Long itemsId;

    @NotNull
    private Integer quantity;
}
