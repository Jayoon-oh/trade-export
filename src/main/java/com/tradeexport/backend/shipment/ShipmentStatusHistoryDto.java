package com.tradeexport.backend.shipment;

import java.time.LocalDateTime;

public record ShipmentStatusHistoryDto (
    ShipmentStatus previousStatus,
    ShipmentStatus newStatus,
    LocalDateTime changedAt,
    String changedByName
){}
