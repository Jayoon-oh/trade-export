package com.tradeexport.backend.orders;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersItemsRepository extends JpaRepository<OrdersItems, Long> {
    List<OrdersItems> findByOrdersId(Long ordersId);
}
