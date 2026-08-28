package com.tradeexport.backend.packinglist;

import java.math.BigDecimal;

public record PackingListItemLineDto (
    String itemName,
    BigDecimal actualWeight,
    BigDecimal amount,
    Integer quantity
){}
