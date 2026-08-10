package com.tradeexport.backend.stock;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Transactional
@Service
public class StockService {
    final private StockRepository stockRepository;

    // 1. register order -> reserve stock
    public void reserveStock(Long itemsId, Integer quantity) {
        Stock stock = stockRepository.findByItemsId(itemsId)
                .orElseThrow(() -> new IllegalArgumentException("재고 정보 없음"));

        int available = stock.getQuantity() - stock.getReservedQuantity();
        if (available < quantity) {
            throw new IllegalStateException("재고 부족");
        }
        stock.setReservedQuantity(stock.getReservedQuantity() + quantity);
        stockRepository.save(stock);
    }

    // 2. cancel order -> release stock
    public void releaseStock(Long itemsId, Integer quantity) {
        Stock stock = stockRepository.findByItemsId(itemsId)
                .orElseThrow(() -> new IllegalArgumentException("재고 정보 없음"));

        stock.setReservedQuantity(stock.getReservedQuantity() - quantity);

        stockRepository.save(stock);
    }

    // 3. register packing list -> decrease stock
    public void decreaseStock(Long itemsId, Integer quantity) {
        Stock stock = stockRepository.findByItemsId(itemsId)
                .orElseThrow(() -> new IllegalArgumentException("재고 정보 없음"));

        stock.setReservedQuantity(stock.getReservedQuantity() - quantity);
        stock.setQuantity(stock.getQuantity() - quantity);

        stockRepository.save(stock);
    }
}
