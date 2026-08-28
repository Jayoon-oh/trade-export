package com.tradeexport.backend.quotation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuotationItemsRepository extends JpaRepository<QuotationItems, Long> {
    List<QuotationItems> findByQuotationId(Long quotationId);
}
