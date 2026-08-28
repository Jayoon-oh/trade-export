package com.tradeexport.backend.invoice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByOrdersId(Long ordersId);

    // count sequence number for createInvoice
    long countByInvoiceNumberStartingWith(String prefix);

}
