package com.tradeexport.backend.packinglist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackingListRepository extends JpaRepository<PackingList, Long> {
    // return list of packing-list
    @Query("SELECT p FROM PackingList p WHERE " +
            "(:buyerId IS NULL OR p.shipment.orders.buyer.id = :buyerId)")
    List<PackingList> findByFilters(@Param("buyerId") Long buyerId);
}
