package com.tradeexport.backend.invoice;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class InvoiceCreateRequestDto {
    @NotNull
    private BigDecimal exchangeRate;
}
