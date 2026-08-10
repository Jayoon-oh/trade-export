package com.tradeexport.backend.packinglist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackingListRepository extends JpaRepository<PackingList, Long> {
    @Query("SELECT p FROM PackingList p WHERE p.shipment.orders.buyer.id = :buyerId")
    List<PackingList> findByBuyerId(@Param("buyerId") Long buyerId);

}
