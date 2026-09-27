package com.tradeexport.backend.dashboard;

import java.math.BigDecimal;

public record PipelineFunnelDto(
        long quotationCount,
        BigDecimal quotationAmount,
        long ordersCount,
        BigDecimal ordersAmount,
        long invoiceCount,
        BigDecimal invoiceAmount,
        long shipmentCount,
        long paymentCount,
        BigDecimal paymentAmount
        ) {}
