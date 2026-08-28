package com.tradeexport.backend.orders;

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
public class OrdersItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "orders_id")
    @ManyToOne
    private Orders orders;

    @JoinColumn(name = "items_id")
    @ManyToOne
    private Items items;

    private BigDecimal unitPrice;
    private BigDecimal amount;
    private Integer quantity;
}
