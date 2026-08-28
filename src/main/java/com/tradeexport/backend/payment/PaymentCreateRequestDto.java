package com.tradeexport.backend.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentCreateRequestDto {
    @NotNull
    private Long invoiceId;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private LocalDateTime paymentDate;
}
