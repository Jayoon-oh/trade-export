package com.tradeexport.backend.stock;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @InjectMocks  // Inject fake Repository which made from above
    private StockService stockService;

    @Test
    void 재고보다_많은_수량을_예약하면_예외가_발생한다() {
        Stock stock = new Stock();
        stock.setQuantity(10);
        stock.setReservedQuantity(5);

        when(stockRepository.findByItemsId(1L)).thenReturn(Optional.of(stock));

        assertThatThrownBy(() -> stockService.reserveStock(1L, 10))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("재고 부족");
    }
}