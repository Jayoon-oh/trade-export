package com.tradeexport.backend.packinglist;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PackingListCreateRequestDto {
    @NotNull
    private Long shipmentId;

    @NotNull
    private LocalDate packingDate;

    private BigDecimal totalAmount;

    private BigDecimal totalWeight;

    private String comment;

    @NotNull
    private List<PackingListItemRequestDto> items;
}
