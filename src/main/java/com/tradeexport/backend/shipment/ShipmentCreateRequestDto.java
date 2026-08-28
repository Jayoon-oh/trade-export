package com.tradeexport.backend.shipment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ShipmentCreateRequestDto {
    @NotNull
    private Long ordersId;

    @NotNull
    private Long forwarderId;

    @NotNull
    private BigDecimal fee;

    private LocalDateTime shipmentDate;
}
