package com.tradeexport.backend.stock;

import java.math.BigDecimal;

public record StockResponseDto(
        Long id,
        String productName,
        Integer quantity,
        Integer reservedQuantity,
        BigDecimal price,
        Integer setQty,
        BigDecimal standardWeight
) {
    public static StockResponseDto from(Stock stock) {
        return new StockResponseDto(
                stock.getId(),
                stock.getItems().getProductName(),
                stock.getQuantity(),
                stock.getReservedQuantity(),
                stock.getItems().getPrice(),
                stock.getItems().getSetQty(),
                stock.getItems().getStandardWeight()
        );
    }
}