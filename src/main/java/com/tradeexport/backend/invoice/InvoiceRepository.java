package com.tradeexport.backend.invoice;

import com.tradeexport.backend.quotation.Quotation;
import com.tradeexport.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByOrdersId(Long ordersId);

    // count sequence number for createInvoice
    long countByInvoiceNumberStartingWith(String prefix);

    // multiple orderIds
    List<Invoice> findByOrdersIdIn(List<Long> ordersIds);

    // using paymentPage (issued invoice)
    List<Invoice> findByStatus(InvoiceStatus status);

    // dashboard
    @Query("SELECT i FROM Invoice i WHERE i.orders.createdBy = :user")
    List<Invoice> findByCreatedBy(User user);
}

