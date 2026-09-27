package com.tradeexport.backend.orders;

import java.util.List;

public record OrdersDetailResponseDto(
        OrdersResponseDto orders,
        List<OrdersItemLineDto> items
) {
    public static OrdersDetailResponseDto from(Orders orders, List<OrdersItems> items, boolean hasInvoice) {
        return new OrdersDetailResponseDto(
                OrdersResponseDto.from(orders, hasInvoice),
                items.stream().map(OrdersItemLineDto::from).toList()
        );
    }
}
