package com.tradeexport.backend.quotation;

import com.tradeexport.backend.items.Items;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class QuotationItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "quotation_id")
    @ManyToOne
    private Quotation quotation;

    @JoinColumn(name = "items_id")
    @ManyToOne
    private Items items;

    private BigDecimal unitPrice;
    private BigDecimal amount;
    private Integer quantity;
}
