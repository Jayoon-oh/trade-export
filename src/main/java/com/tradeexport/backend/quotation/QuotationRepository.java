package com.tradeexport.backend.quotation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByCompanyId(Long companyId);
}
