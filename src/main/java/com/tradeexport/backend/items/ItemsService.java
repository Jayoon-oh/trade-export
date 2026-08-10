package com.tradeexport.backend.items;

import com.tradeexport.backend.stock.Stock;
import com.tradeexport.backend.stock.StockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemsService {
    private final ItemsRepository itemsRepository;
    private final StockRepository stockRepository;

    public void registerItems(ItemsCreateRequestDto dto) {
        Items items = new Items();
        items.setProductName(dto.getProductName());
        items.setPrice(dto.getPrice());
        items.setSetQty(dto.getSetQty());
        items.setStandardWeight(dto.getStandardWeight());

        itemsRepository.save(items);

        // initialize stock for new items
        Stock stock = new Stock();
        stock.setItems(items);
        stock.setQuantity(0);
        stock.setReservedQuantity(0);

        stockRepository.save(stock);

    }
}
