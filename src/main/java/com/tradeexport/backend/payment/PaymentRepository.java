package com.tradeexport.backend.payment;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p WHERE " +
            "(:buyerId IS NULL OR p.invoice.orders.buyer.id = :buyerId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:invoiceNumber IS NULL OR p.invoice.invoiceNumber LIKE %:invoiceNumber%)")
    Page<Payment> findByFilter(@Param("buyerId") Long buyerId,
                               @Param("status") PaymentStatus status,
                               @Param("invoiceNumber") String invoiceNumber,
                               Pageable pageable);

    // Invoice Service
    List<Payment> findByInvoiceId(Long invoiceId);

    // dashboard
    @Query("SELECT p FROM Payment p WHERE p.invoice.orders.createdBy = :user")
    List<Payment> findByCreatedBy(User user);
}


