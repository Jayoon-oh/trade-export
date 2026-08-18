package com.tradeexport.backend.shipment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByForwarderId(Long forwarderId);

    @Query("SELECT s FROM Shipment s WHERE s.orders.buyer.id = :buyerId")
    List<Shipment> findByBuyerId(@Param("buyerId") Long buyerId);

    // getShipments
    @Query("SELECT s FROM Shipment s WHERE " +
            "(:buyerId IS NULL OR s.orders.buyer.id = :buyerId) AND " +
            "(:forwarderId IS NULL OR s.forwarder.id = :forwarderId) AND " +
            "(:status IS NULL OR s.status = :status)")
    List<Shipment> findByFilters(@Param("buyerId") Long buyerId,
                                 @Param("forwarderId") Long forwarderId,
                                 @Param("status") ShipmentStatus status);
}
