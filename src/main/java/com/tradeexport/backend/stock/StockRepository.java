package com.tradeexport.backend.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByItemsId(Long itemsId);

    @Query("SELECT s FROM Stock s WHERE s.items.productName LIKE %:productName% ")
    List<Stock> findByProductNameContaining(@Param("productName") String productName);
}
