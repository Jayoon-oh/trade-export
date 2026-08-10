package com.tradeexport.backend.shipment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByForwarderId(Long forwarderId);

    @Query("SELECT s FROM Shipment s WHERE s.orders.buyer.id = :buyerId")
    List<Shipment> findByBuyerId(@Param("buyerId") Long buyerId);
}
