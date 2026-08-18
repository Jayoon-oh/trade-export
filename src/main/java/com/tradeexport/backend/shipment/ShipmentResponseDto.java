package com.tradeexport.backend.shipment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ShipmentResponseDto(
        Long id,
        Long ordersId,
        Long buyerId,
        String buyerName,
        Long forwarderId,
        String forwarderName,
        BigDecimal fee,
        ShipmentStatus status,
        LocalDateTime shipmentDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ShipmentResponseDto from(Shipment shipment) {
        return new ShipmentResponseDto(
                shipment.getId(),
                shipment.getOrders().getId(),
                shipment.getOrders().getBuyer().getId(),
                shipment.getOrders().getBuyer().getCompanyName(),
                shipment.getForwarder().getId(),
                shipment.getForwarder().getCompanyName(),
                shipment.getFee(),
                shipment.getStatus(),
                shipment.getShipmentDate(),
                shipment.getCreatedAt(),
                shipment.getUpdatedAt()
        );
    }
}
