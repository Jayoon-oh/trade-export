package com.tradeexport.backend.packinglist;

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
public class PackingListItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "packing_list_id")
    @ManyToOne
    private PackingList packingList;

    @JoinColumn(name = "items_id")
    @ManyToOne
    private Items items;

    private BigDecimal actualWeight;
    private BigDecimal amount;
    private Integer quantity;
}
