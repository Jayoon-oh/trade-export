package com.tradeexport.backend.packinglist;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PackingListPdfDataDto (
        String packingListNumber,
        LocalDateTime packingListDate,
        BigDecimal totalAmount,
        BigDecimal totalWeight,

        String sellerName,
        String sellerAddress,
        String sellerRegistrationNumber,
        String sellerOwnerName,
        String sellerLogoPath,
        String sellerSignaturePath,

        String buyerName,
        String buyerAddress,
        String buyerRegistrationNumber,

        List<PackingListItemLineDto> items
){ }
