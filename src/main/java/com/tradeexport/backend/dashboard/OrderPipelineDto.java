package com.tradeexport.backend.dashboard;


import java.math.BigDecimal;

public record OrderPipelineDto (
        Long orderId,
        String orderNumber,
        String buyerName,
        BigDecimal amount,
        boolean hasQuotation,
        boolean hasInvoice,
        boolean hasShipment,
        boolean hasPackingList,
        boolean isFullyPaid,
        String nextAction
){}
