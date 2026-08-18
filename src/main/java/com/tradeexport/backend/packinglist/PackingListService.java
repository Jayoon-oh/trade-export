package com.tradeexport.backend.packinglist;

import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import com.tradeexport.backend.shipment.Shipment;
import com.tradeexport.backend.shipment.ShipmentRepository;
import com.tradeexport.backend.stock.StockService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PackingListService {
    final private PackingListRepository packingListRepository;
    final private PackingListItemsRepository packingListItemsRepository;
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

    public List<PackingListResponse> getPackingLists(Long buyerId) {
        return packingListRepository.findByFilters(buyerId)
                .stream()
                .map(PackingListResponse::from)
                .toList();
    }

    public PackingListResponse getPackingList(Long id) {
        PackingList packingList = packingListRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("선적 리스트 없음"));

        return PackingListResponse.from(packingList);
    }

    public PackingListResponse updatePackingList(Long id, PackingListCreateRequestDto dto) {
        PackingList packingList = packingListRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("선적 리스트 없음"));

        packingList.setPackingDate(dto.getPackingDate());
        packingList.setUpdatedAt(LocalDateTime.now());
        packingList.setComment(dto.getComment());

        packingListRepository.save(packingList);

        // 1. Restore stock & delete existing items
        List<PackingListItems> oldItems = packingListItemsRepository.findByPackingListId(packingList.getId());
        for (PackingListItems packingItems : oldItems) {
            stockService.increaseStock(packingItems.getItems().getId(), packingItems.getQuantity());

            packingListItemsRepository.delete(packingItems);
        }

        // 2.  Create new items & decrease stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalWeight = BigDecimal.ZERO;

        for (PackingListItemRequestDto itemDto : dto.getItems()) {
            Items item = itemsRepository.findById(itemDto.getItemsId())
                    .orElseThrow(()-> new IllegalArgumentException("품목 없음"));

            BigDecimal lineAmount = item.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            BigDecimal lineWeight = itemDto.getActualWeight();

            PackingListItems newItem = new PackingListItems();
            newItem.setPackingList(packingList);
            newItem.setItems(item);
            newItem.setActualWeight(lineWeight);
            newItem.setAmount(lineAmount);
            newItem.setQuantity(itemDto.getQuantity());

            packingListItemsRepository.save(newItem);

            stockService.decreaseStock(itemDto.getItemsId(), itemDto.getQuantity());

            totalAmount = totalAmount.add(lineAmount);
            totalWeight = totalWeight.add(lineWeight);
        }

            // 3. apply amount & save new packingList
            packingList.setTotalAmount(totalAmount);
            packingList.setTotalWeight(totalWeight);
            PackingList saved = packingListRepository.save(packingList);

            return PackingListResponse.from(saved);
    }
}
