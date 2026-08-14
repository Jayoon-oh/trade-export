package com.tradeexport.backend.packinglist;

import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import com.tradeexport.backend.shipment.Shipment;
import com.tradeexport.backend.shipment.ShipmentRepository;
import com.tradeexport.backend.stock.StockRepository;
import com.tradeexport.backend.stock.StockService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class PackingListService {
    final private PackingListRepository packingListRepository;
    final private PackingListItemsRepository packingListItemsRepository;
    final private StockRepository stockRepository;
    final private ShipmentRepository shipmentRepository;
    final private ItemsRepository itemsRepository;
    final private StockService stockService;

    public PackingList createPackingList(PackingListCreateRequestDto dto) {
        Shipment shipment = shipmentRepository.findById(dto.getShipmentId())
                .orElseThrow(() ->new IllegalArgumentException("등록된 선적 없음"));

        PackingList packingList = new PackingList();
        packingList.setShipment(shipment);
        packingList.setPackingDate(dto.getPackingDate());
        packingList.setCreatedAt(LocalDateTime.now());
        packingList.setUpdatedAt(LocalDateTime.now());
        packingList.setComment(dto.getComment());

        packingListRepository.save(packingList);

        // initialize amount, weight
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalWeight = BigDecimal.ZERO;

        for (PackingListItemRequestDto itemDto : dto.getItems()) {
            Items item = itemsRepository.findById(itemDto.getItemsId())
                    .orElseThrow(()-> new IllegalArgumentException("품목 없음"));

            BigDecimal lineAmount = item.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            BigDecimal lineWeight = itemDto.getActualWeight();

            PackingListItems packingListItems = new PackingListItems();
            packingListItems.setPackingList(packingList);
            packingListItems.setItems(item);
            packingListItems.setActualWeight(lineWeight);
            packingListItems.setAmount(lineAmount);
            packingListItems.setQuantity(itemDto.getQuantity());
            packingListItemsRepository.save(packingListItems);

            stockService.decreaseStock(itemDto.getItemsId(), itemDto.getQuantity());

            totalAmount = totalAmount.add(lineAmount);
            totalWeight = totalWeight.add(lineWeight);
        }

        packingList.setTotalAmount(totalAmount);
        packingList.setTotalWeight(totalWeight);
        return packingListRepository.save(packingList);
    }
}
