package com.tradeexport.backend.shipment;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.orders.Orders;
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
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "orders_id")
    private Orders orders;

    @ManyToOne
    @JoinColumn(name = "forwarder_id")
    private Company forwarder;

    private BigDecimal fee;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private LocalDateTime shipmentDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
