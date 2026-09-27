package com.tradeexport.backend.company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByRole(@Param("role")String role);

    // pagination -> list of Companies
    @Query("SELECT c FROM Company c WHERE " +
            "(:role IS NULL OR c.role = :role) AND " +
            "(:companyName IS NULL OR c.companyName LIKE %:companyName%)")
    Page<Company> findByFilters(@Param("role") String role, @Param("companyName") String companyName, Pageable pageable);

    // check entire companies
    @Query("SELECT c FROM Company c WHERE (:role IS NULL OR c.role = :role)")
    List<Company> findAllByRole(@Param("role") String role);
}
