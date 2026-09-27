package com.tradeexport.backend.shipment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ShipmentResponseDto(
        Long id,
        Long ordersId,
        Long buyerId,
        String buyerName,
        Long forwarderId,
        String forwarderName,
        ShipmentStatus status,
        String orderNumber,
        LocalDate shipmentDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer shipmentSequence
) {
    public static ShipmentResponseDto from(Shipment shipment) {
        return new ShipmentResponseDto(
                shipment.getId(),
                shipment.getOrders().getId(),
                shipment.getOrders().getBuyer().getId(),
                shipment.getOrders().getBuyer().getCompanyName(),
                shipment.getForwarder().getId(),
                shipment.getForwarder().getCompanyName(),
                shipment.getStatus(),
                shipment.getOrders().getOrderNumber(),
                shipment.getShipmentDate(),
                shipment.getCreatedAt(),
                shipment.getUpdatedAt(),
                shipment.getShipmentSequence()
        );
    }
}
