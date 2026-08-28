package com.tradeexport.backend.packinglist;

import com.tradeexport.backend.shipment.Shipment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PackingList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;

    private LocalDateTime packingDate;
    private BigDecimal totalAmount;
    private BigDecimal totalWeight;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String comment;
}
