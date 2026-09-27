package com.tradeexport.backend.quotation;

import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    @Query("SELECT q FROM Quotation q WHERE (:companyId IS NULL OR q.company.id = :companyId)")
    Page<Quotation> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    // dashboard
    List<Quotation> findByCreatedBy(User user);
}
