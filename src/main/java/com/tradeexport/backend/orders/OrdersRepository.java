package com.tradeexport.backend.orders;

import com.tradeexport.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long>{
    @Query("SELECT o FROM Orders o WHERE " +
            "(:buyerId IS NULL OR o.buyer.id = :buyerId) AND " +
            "(:orderNumber IS NULL OR o.orderNumber LIKE %:orderNumber%)")
    Page<Orders> findByFilters(@Param("buyerId") Long buyerId, @Param("orderNumber") String orderNumber, Pageable pageable);

    long countByOrderNumberStartingWith(String prefix);

    // Dashboard service
    List<Orders> findByCreatedBy(User user);

    // quotation service (deleteQuotation)
    List<Orders> findByQuotationId(Long quotationId);
}
