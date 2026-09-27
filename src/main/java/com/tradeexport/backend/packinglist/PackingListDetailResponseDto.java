package com.tradeexport.backend.packinglist;

import java.util.List;

public record PackingListDetailResponseDto(
        PackingListResponseDto packingList,
        List<PackingListItemLineDto> items
) {
    public static PackingListDetailResponseDto from(PackingList packingList, List<PackingListItems> items) {
        return new PackingListDetailResponseDto(
                PackingListResponseDto.from(packingList),
                items.stream().map(PackingListItemLineDto::from).toList()
        );
    }
}
