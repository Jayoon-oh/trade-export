package com.tradeexport.backend.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long>{
    @Query("SELECT o FROM Orders o WHERE " +
            "(:buyerId IS NULL OR o.buyer.id = :buyerId)")
    List<Orders> findByFilters(@Param("buyerId") Long buyerId);

}
