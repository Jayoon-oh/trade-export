package com.tradeexport.backend.invoice;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

// partial Invoice

@Getter
@Setter
public class InvoiceItemRequestDto {
    @NotNull
    private Long itemsId;
    @NotNull
    private Integer quantity;
}
