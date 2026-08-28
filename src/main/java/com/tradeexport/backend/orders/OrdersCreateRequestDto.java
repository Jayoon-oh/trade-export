package com.tradeexport.backend.orders;

import com.tradeexport.backend.quotation.QuotationItemRequestDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrdersCreateRequestDto {
    @NotNull
    private Long buyerId;

    private Long quotationId;

    private BigDecimal amount;

    @NotNull
    private LocalDateTime ordersDate;

    private String comment;

    @NotBlank
    private String currency;

    @NotBlank
    private String incoterms;

    @NotBlank
    private String paymentTerm;

    @NotNull
    private List<OrdersItemRequestDto> items;
}
