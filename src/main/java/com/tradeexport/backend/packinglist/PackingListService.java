package com.tradeexport.backend.packinglist;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersItems;
import com.tradeexport.backend.orders.OrdersItemsRepository;
import com.tradeexport.backend.orders.OrdersRepository;
import com.tradeexport.backend.pdf.PdfService;
import com.tradeexport.backend.shipment.Shipment;
import com.tradeexport.backend.shipment.ShipmentRepository;
import com.tradeexport.backend.stock.StockService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PackingListService {
    final private PackingListRepository packingListRepository;
    final private PackingListItemsRepository packingListItemsRepository;
    final private ShipmentRepository shipmentRepository;
    final private OrdersItemsRepository ordersItemsRepository;
    final private ItemsRepository itemsRepository;
    final private StockService stockService;
    final private CompanyRepository companyRepository;
    final private PdfService pdfService;

    public PackingList createPackingList(PackingListCreateRequestDto dto) {
        Shipment shipment = shipmentRepository.findById(dto.getShipmentId())
                .orElseThrow(() ->new IllegalArgumentException("등록된 선적 없음"));

        List<PackingList> existing = packingListRepository.findByShipmentId(dto.getShipmentId());
        if (!existing.isEmpty()) {
            throw new IllegalStateException("이미 이 선적에 패킹리스트가 등록되어 있습니다. 수정을 이용해주세요.");
        }

        // Prepare ordered quantity item from the shipment's orders
        Orders orders = shipment.getOrders();
        List<OrdersItems> orderItems = ordersItemsRepository.findByOrdersId(orders.getId());
        Map<Long, Integer> orderedQuantityMap = orderItems.stream()
                .collect(Collectors.toMap(oi -> oi.getItems().getId(), OrdersItems::getQuantity));

        // validate that requested items exist in the order and don't exceed ordered quantity
        for (PackingListItemRequestDto itemDto : dto.getItems()) {
            Integer orderedQuantity = orderedQuantityMap.get(itemDto.getItemsId());
            if (orderedQuantity == null) {
                throw new IllegalArgumentException("주문에 포함되지 않은 품목입니다.");
            }
            if (itemDto.getQuantity() > orderedQuantity) {
                throw new IllegalStateException("주문 수량(" + orderedQuantity + ")을 초과했습니다.");
            }
        }

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

    public Page<PackingListResponseDto> getPackingLists(Long buyerId, String orderNumber, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return packingListRepository.findByFilters(buyerId, orderNumber, pageable)
                .map(PackingListResponseDto::from);
    }

    public PackingListDetailResponseDto getPackingList(Long id) {
        PackingList packingList = packingListRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("선적 리스트 없음"));

        List<PackingListItems> items = packingListItemsRepository.findByPackingListId(id);

        return PackingListDetailResponseDto.from(packingList, items);
    }

    public PackingListResponseDto updatePackingList(Long id, PackingListCreateRequestDto dto) {
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

            return PackingListResponseDto.from(saved);
    }

    public void deletePackingList(Long id) {
        PackingList packingList = packingListRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("패킹리스트 없음"));

        List<PackingListItems> items = packingListItemsRepository.findByPackingListId(id);
        for (PackingListItems item : items) {
            stockService.increaseStock(item.getItems().getId(), item.getQuantity());
            packingListItemsRepository.delete(item);
        }

        packingListRepository.delete(packingList);
    }

    public PackingListPdfDataDto getPackingListPdfData(Long packingListId) {
        PackingList packingList = packingListRepository.findById(packingListId)
                .orElseThrow(()-> new IllegalArgumentException("패킹리스트 없음"));

        Company seller = companyRepository.findByRole("SELLER").get(0);

        Company buyer = packingList.getShipment().getOrders().getBuyer();

        List<PackingListItems> packingListItems = packingListItemsRepository.findByPackingListId(packingListId);

        List<PackingListItemLineDto> itemLines = packingListItems.stream()
                .map(item -> new PackingListItemLineDto(
                        item.getItems().getId(),
                        item.getItems().getProductName(),
                        item.getActualWeight(),
                        item.getAmount(),
                        item.getQuantity()
                ))
                .toList();

        String packingListNumber = "PL-" + String.format("%06d", packingList.getId());

        return new PackingListPdfDataDto(
                packingListNumber,
                packingList.getPackingDate(),
                packingList.getTotalAmount(),
                packingList.getTotalWeight(),

                seller.getCompanyName(),
                seller.getAddress(),
                seller.getRegistrationNumber(),
                seller.getNameOfOwner(),
                seller.getLogoPath(),
                seller.getSignaturePath(),

                buyer.getCompanyName(),
                buyer.getAddress(),
                buyer.getRegistrationNumber(),

                itemLines
        );
    }

    public byte[] generatePackingListPdf(Long packingListId) {
        PackingListPdfDataDto dto = getPackingListPdfData(packingListId);

        Map<String, Object> data = new HashMap<>();
        data.put("sellerName", dto.sellerName());
        data.put("sellerAddress", dto.sellerAddress());
        data.put("sellerRegistrationNumber", dto.sellerRegistrationNumber());
        data.put("sellerOwnerName", dto.sellerOwnerName());
        data.put("sellerLogoPath", pdfService.resolveImagePath(dto.sellerLogoPath()));
        data.put("sellerSignaturePath", pdfService.resolveImagePath(dto.sellerSignaturePath()));
        data.put("buyerName", dto.buyerName());
        data.put("buyerAddress", dto.buyerAddress());
        data.put("buyerRegistrationNumber", dto.buyerRegistrationNumber());
        data.put("packingListNumber", dto.packingListNumber());
        data.put("packingListDate", dto.packingListDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        data.put("totalAmount", dto.totalAmount());
        data.put("totalWeight", dto.totalWeight());
        data.put("items", dto.items());

        return pdfService.generatePdf("pdf/packing-list", data);
    }

    public List<PackingListAvailableItemDto> getAvailableItems(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(()-> new IllegalArgumentException("선적건 없음"));

        Orders orders = shipment.getOrders();
        List<OrdersItems> orderItems  = ordersItemsRepository.findByOrdersId(orders.getId());

        // verify another packed Shipment and count packed items amount
        List<Shipment> siblingShipments = shipmentRepository.findByOrdersId(orders.getId());
        Map<Long, Integer> alreadyPackedMap = new HashMap<>();

        for (Shipment s : siblingShipments) {
            List<PackingList> packingLists = packingListRepository.findByShipmentId(s.getId());
            for (PackingList pl : packingLists) {
                List<PackingListItems> items = packingListItemsRepository.findByPackingListId(pl.getId());
                for (PackingListItems item : items) {
                    Long itemsId = item.getItems().getId();
                    alreadyPackedMap.merge(itemsId, item.getQuantity(), Integer::sum);
                }
            }
        }
        return orderItems.stream()
                .map(oi -> {
                    Long itemsId = oi.getItems().getId();
                    int ordered = oi.getQuantity();
                    int alreadyPacked = alreadyPackedMap.getOrDefault(itemsId, 0);
                    int remaining = ordered - alreadyPacked;

                    return new PackingListAvailableItemDto(
                            itemsId,
                            oi.getItems().getProductName(),
                            remaining,
                            oi.getItems().getStandardWeight()
                    );
                })
                .toList();
    }
}
