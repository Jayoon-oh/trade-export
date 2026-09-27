package com.tradeexport.backend.invoice;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class InvoiceCreateRequestDto {
    private BigDecimal exchangeRate;
    private List<InvoiceItemRequestDto> items;
}
