package com.tradeexport.backend.invoice;

import java.math.BigDecimal;

public record InvoiceItemLineDto(
        String itemName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal amount
) {}
