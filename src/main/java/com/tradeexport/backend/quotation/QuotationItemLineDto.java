package com.tradeexport.backend.quotation;

import java.math.BigDecimal;

public record QuotationItemLineDto(
        Long itemsId,
        String itemName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal amount
) {
    public static QuotationItemLineDto from(QuotationItems item) {
        return new QuotationItemLineDto(
                item.getItems().getId(),
                item.getItems().getProductName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getAmount()
        );
    }
}