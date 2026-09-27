package com.tradeexport.backend.quotation;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.user.User;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDate quotationDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal totalAmount;
    private String currency;
    private BigDecimal exchangeRate;
    private String incoterms;

    @NotNull
    private String paymentTerm;

    @Nullable
    private String comment;

}
