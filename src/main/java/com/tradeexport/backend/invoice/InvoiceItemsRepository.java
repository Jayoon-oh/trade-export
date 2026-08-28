package com.tradeexport.backend.invoice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceItemsRepository extends JpaRepository<InvoiceItems, Long> {
    List<InvoiceItems> findByInvoiceId(Long invoiceId);
}
