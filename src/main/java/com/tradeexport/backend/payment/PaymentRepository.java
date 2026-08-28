package com.tradeexport.backend.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p WHERE " +
            "(:buyerId IS NULL OR p.invoice.orders.buyer.id = :buyerId) AND " +
            "(:status IS NULL OR p.status = :status)")
    List<Payment> findByFilter(@Param("buyerId") Long buyerId, @Param("status") PaymentStatus status);

    // Invoice Service
    List<Payment> findByInvoiceId(Long invoiceId);
}


