package com.tradeexport.backend.orders;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrdersCreateRequestDto {
    @NotNull
    private Long buyerId;

    private Long quotationId;

    private BigDecimal amount;

    @NotNull
    private LocalDate ordersDate;

    private String comment;

    @NotBlank
    private String currency;

    @NotBlank
    private String incoterms;

    @NotBlank
    private String paymentTerm;

    @NotNull
    private List<OrdersItemRequestDto> items;

    private BigDecimal freightCost;
    private Boolean freightCoveredByCompany;
}
