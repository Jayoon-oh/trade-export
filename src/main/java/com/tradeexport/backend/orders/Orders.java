package com.tradeexport.backend.orders;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.quotation.Quotation;
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

    private BigDecimal amount;
    private LocalDateTime ordersDate;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String currency;
    private String incoterms;

    @NotNull
    private String paymentTerm;
}
