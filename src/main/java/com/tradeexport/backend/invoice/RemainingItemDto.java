package com.tradeexport.backend.invoice;
import java.math.BigDecimal;

public record RemainingItemDto(
        Long itemsId,
        String itemName,
        Integer orderedQuantity,
        Integer invoicedQuantity,
        Integer remainingQuantity,
        BigDecimal unitPrice
) {}
