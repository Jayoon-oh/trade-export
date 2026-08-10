package com.tradeexport.backend.quotation;

import com.tradeexport.backend.company.Company;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
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

    private LocalDateTime quotationDate;
    private BigDecimal totalAmount;
    private String currency;
    private String incoterms;

    @NotNull
    private String paymentTerm;

    @Nullable
    private String comment;
}
