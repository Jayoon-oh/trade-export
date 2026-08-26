package com.tradeexport.backend.orders;

import java.math.BigDecimal;

public record OrdersItemLineDto(
        Long itemsId,
        String itemName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal amount
) {
    public static  OrdersItemLineDto from(OrdersItems item) {
        return new OrdersItemLineDto (
                item.getItems().getId(),
                item.getItems().getProductName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getAmount()
        );
    }
}
