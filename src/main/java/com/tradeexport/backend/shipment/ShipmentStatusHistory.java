package com.tradeexport.backend.shipment;

import com.tradeexport.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ShipmentStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus previousStatus;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus newStatus;

    private LocalDateTime changedAt;

    @ManyToOne
    @JoinColumn(name = "changed_by")
    private User changedBy;
}