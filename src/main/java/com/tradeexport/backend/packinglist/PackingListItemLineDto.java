package com.tradeexport.backend.packinglist;

import com.tradeexport.backend.orders.OrdersItemLineDto;
import com.tradeexport.backend.orders.OrdersItems;

import java.math.BigDecimal;

public record PackingListItemLineDto (
    Long itemsId,
    String itemName,
    BigDecimal actualWeight,
    BigDecimal amount,
    Integer quantity
){
    public static PackingListItemLineDto from(PackingListItems item) {
    return new PackingListItemLineDto (
            item.getItems().getId(),
            item.getItems().getProductName(),
            item.getItems().getStandardWeight(),
            item.getAmount(),
            item.getQuantity()
        );
    }
}
