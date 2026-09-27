package com.tradeexport.backend.packinglist;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PackingListResponseDto(
        Long id,
        Long shipmentId,
        Long buyerId,
        String buyerName,
        Long forwarderId,
        String forwarderName,
        LocalDate packingDate,
        BigDecimal totalAmount,
        BigDecimal totalWeight,
        String orderNumber,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Integer shipmentSequence
) {
    public static PackingListResponseDto from(PackingList packingList) {
        return new PackingListResponseDto(
                packingList.getId(),
                packingList.getShipment().getId(),
                packingList.getShipment().getOrders().getBuyer().getId(),
                packingList.getShipment().getOrders().getBuyer().getCompanyName(),
                packingList.getShipment().getForwarder().getId(),
                packingList.getShipment().getForwarder().getCompanyName(),
                packingList.getPackingDate(),
                packingList.getTotalAmount(),
                packingList.getTotalWeight(),
                packingList.getShipment().getOrders().getOrderNumber(),
                packingList.getComment(),
                packingList.getCreatedAt(),
                packingList.getUpdatedAt(),
                packingList.getShipment().getShipmentSequence()
        );
    }
}