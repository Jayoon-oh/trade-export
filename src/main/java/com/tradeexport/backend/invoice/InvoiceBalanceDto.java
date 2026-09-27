package com.tradeexport.backend.invoice;

import java.math.BigDecimal;

public record InvoiceBalanceDto (
  Long invoiceId,
  BigDecimal totalAmount,
  String currency,
  BigDecimal totalPaid,
  BigDecimal remaining
){}