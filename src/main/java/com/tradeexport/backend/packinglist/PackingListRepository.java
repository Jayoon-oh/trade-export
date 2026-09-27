package com.tradeexport.backend.packinglist;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackingListRepository extends JpaRepository<PackingList, Long> {
    // return list of packing-list
    @Query("SELECT p FROM PackingList p WHERE " +
            "(:buyerId IS NULL OR p.shipment.orders.buyer.id = :buyerId) AND " +
            "(:orderNumber IS NULL OR p.shipment.orders.orderNumber LIKE %:orderNumber%)")
    Page<PackingList> findByFilters(@Param("buyerId") Long buyerId,
                                    @Param("orderNumber") String orderNumber,
                                    Pageable pageable);

    List<PackingList> findByShipmentId(Long shipmentId);

    // dashboard
    @Query("SELECT p FROM PackingList p WHERE p.shipment.orders.id = :ordersId")
    List<PackingList> findByOrdersList(@Param("ordersId")Long ordersId);
}
