package com.tradeexport.backend.shipment;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.user.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByForwarderId(Long forwarderId);

    @Query("SELECT s FROM Shipment s WHERE s.orders.buyer.id = :buyerId")
    List<Shipment> findByBuyerId(@Param("buyerId") Long buyerId);

    // getShipments + pagination
    @Query("SELECT s FROM Shipment s WHERE " +
            "(:buyerId IS NULL OR s.orders.buyer.id = :buyerId) AND " +
            "(:forwarderId IS NULL OR s.forwarder.id = :forwarderId) AND " +
            "(:status IS NULL OR s.status = :status) AND " +
            "(:orderNumber IS NULL OR s.orders.orderNumber LIKE %:orderNumber%)")
    Page<Shipment> findByFilters(@Param("buyerId") Long buyerId,
                                 @Param("forwarderId") Long forwarderId,
                                 @Param("status") ShipmentStatus status,
                                 @Param("orderNumber") String orderNumber,
                                 Pageable pageable);

    // cancelOrders
    List<Shipment> findByOrdersId(Long ordersId);

    // dashboard
    @Query("SELECT s FROM Shipment s WHERE s.orders.createdBy = :user")
    List<Shipment> findByCreatedBy(User user);

    // split shipment of register
    long countByOrdersId(Long ordersId);
}
