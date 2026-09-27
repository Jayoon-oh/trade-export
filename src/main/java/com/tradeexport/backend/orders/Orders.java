package com.tradeexport.backend.orders;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.quotation.Quotation;
import com.tradeexport.backend.user.User;
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
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private Company buyer;

    @ManyToOne
    @JoinColumn(name = "quotation_id")
    private Quotation quotation;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    private BigDecimal amount;
    private LocalDate ordersDate;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String currency;
    private String incoterms;
    private String orderNumber;

    @NotNull
    private String paymentTerm;

    private BigDecimal exchangeRate;
    private BigDecimal freightCost;
    private Boolean freightCoveredByCompany;
}
