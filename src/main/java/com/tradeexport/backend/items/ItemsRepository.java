package com.tradeexport.backend.items;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemsRepository extends JpaRepository<Items, Long> {
    List<Items> findByProductNameContaining(String productName);
}
