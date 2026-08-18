package com.tradeexport.backend.packinglist;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PackingListResponse(
        Long id,
        Long shipmentId,
        Long buyerId,
        String buyerName,
        Long forwarderId,
        String forwarderName,
        LocalDateTime packingDate,
        BigDecimal totalAmount,
        BigDecimal totalWeight,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PackingListResponse from(PackingList packingList) {
        return new PackingListResponse(
                packingList.getId(),
                packingList.getShipment().getId(),
                packingList.getShipment().getOrders().getBuyer().getId(),
                packingList.getShipment().getOrders().getBuyer().getCompanyName(),
                packingList.getShipment().getForwarder().getId(),
                packingList.getShipment().getForwarder().getCompanyName(),
                packingList.getPackingDate(),
                packingList.getTotalAmount(),
                packingList.getTotalWeight(),
                packingList.getComment(),
                packingList.getCreatedAt(),
                packingList.getUpdatedAt()
        );
    }
}