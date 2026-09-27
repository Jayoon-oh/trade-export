package com.tradeexport.backend.packinglist;

import java.math.BigDecimal;

public record PackingListAvailableItemDto(
        Long itemsId,
        String itemName,
        Integer orderedQuantity,
        BigDecimal standardWeight
) {}