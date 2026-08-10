package com.tradeexport.backend.invoice;

import com.tradeexport.backend.orders.Orders;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "orders_id")
    private Orders orders;

    @Column(unique = true)
    private String invoiceNumber;

    private LocalDateTime invoiceDate;
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal exchangeRate;
    private String currency;
}
