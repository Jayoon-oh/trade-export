package com.tradeexport.backend.orders;

import java.util.List;

public record OrdersDetailResponseDto(
        OrdersResponseDto orders,
        List<OrdersItemLineDto> items
) {
    public static OrdersDetailResponseDto from(Orders orders, List<OrdersItems> items) {
        return new OrdersDetailResponseDto(
                OrdersResponseDto.from(orders),
                items.stream().map(OrdersItemLineDto::from).toList()
        );
    }
}
