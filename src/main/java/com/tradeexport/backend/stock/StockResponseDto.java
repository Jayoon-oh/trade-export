package com.tradeexport.backend.stock;

public record StockResponseDto(
        Long id,
        String productName,
        Integer quantity,
        Integer reservedQuantity
) {
    public static StockResponseDto from(Stock stock) {
        return new StockResponseDto(
                stock.getId(),
                stock.getItems().getProductName(),
                stock.getQuantity(),
                stock.getReservedQuantity()
        );
    }
}