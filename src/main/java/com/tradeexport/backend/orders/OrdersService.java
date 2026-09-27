package com.tradeexport.backend.orders;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.invoice.*;
import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import com.tradeexport.backend.quotation.Quotation;
import com.tradeexport.backend.quotation.QuotationRepository;
import com.tradeexport.backend.security.CurrentUserProvider;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class OrdersService {
    final private OrdersRepository ordersRepository;
    final private OrdersItemsRepository ordersItemsRepository;
    final private CompanyRepository companyRepository;
    final private QuotationRepository quotationRepository;
    final private ItemsRepository itemsRepository;
    final private InvoiceRepository invoiceRepository;
    final private ShipmentRepository shipmentRepository;
    final private StockService stockService;
    final private CurrentUserProvider currentUserProvider;
    final private InvoiceItemsRepository invoiceItemsRepository;

    public Orders registerOrder(OrdersCreateRequestDto dto) {
        Company company = companyRepository.findById(dto.getBuyerId())
                .orElseThrow(()-> new IllegalArgumentException("바이어 없음"));

        // orderNumber
        String year = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String prefix = "ORD-" + year + "-";
        long countThisYear = ordersRepository.countByOrderNumberStartingWith(prefix);
        String seq = String.format("%04d", countThisYear + 1);
        String orderNumber = prefix + seq;

        // nullable
        Quotation quotation = null;
        BigDecimal exchangeRate = null;
        if(dto.getQuotationId() != null) {
            quotation = quotationRepository.findById(dto.getQuotationId())
                    .orElseThrow(()-> new IllegalArgumentException("견적 없음"));
            exchangeRate = quotation.getExchangeRate();
        }

        Orders orders = new Orders();

        orders.setBuyer(company);
        orders.setQuotation(quotation);
        orders.setExchangeRate(exchangeRate);
        orders.setOrdersDate(dto.getOrdersDate());
        orders.setComment(dto.getComment());
        orders.setCreatedAt(LocalDateTime.now());
        orders.setUpdatedAt(LocalDateTime.now());
        orders.setCurrency(dto.getCurrency());
        orders.setIncoterms(dto.getIncoterms());
        orders.setPaymentTerm(dto.getPaymentTerm());
        orders.setOrderNumber(orderNumber);
        orders.setCreatedBy(currentUserProvider.getCurrentUser());

        ordersRepository.save(orders);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrdersItemRequestDto itemDto : dto.getItems()) {
            Items item = itemsRepository.findById(itemDto.getItemsId())
                    .orElseThrow(() -> new IllegalArgumentException("품목 없음"));

            BigDecimal lineAmount = item.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            OrdersItems ordersItems = new OrdersItems();
            ordersItems.setOrders(orders);
            ordersItems.setItems(item);
            ordersItems.setUnitPrice(item.getPrice());
            ordersItems.setQuantity(itemDto.getQuantity());
            ordersItems.setAmount(lineAmount);
            ordersItemsRepository.save(ordersItems);

            // reserve stocks -> increase reserved_quantity
            stockService.reserveStock(itemDto.getItemsId(), itemDto.getQuantity());

            totalAmount = totalAmount.add(lineAmount);
        }

        BigDecimal finalFreightCost = (dto.getFreightCoveredByCompany() != null && dto.getFreightCoveredByCompany())
                ? BigDecimal.ZERO
                : (dto.getFreightCost() != null ? dto.getFreightCost() : BigDecimal.ZERO);

        orders.setFreightCost(finalFreightCost);
        orders.setFreightCoveredByCompany(dto.getFreightCoveredByCompany());
        orders.setAmount(totalAmount.add(finalFreightCost));

        return ordersRepository.save(orders);
    }

    public void cancelOrders(Long id) {
        Orders orders = ordersRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("오더 없음"));

        // 1. block deletion when invoice is issued
        List<Invoice> existingInvoice = invoiceRepository.findByOrdersId(id);
        boolean hasActiveInvoice = existingInvoice.stream()
                .anyMatch(inv -> inv.getStatus() != InvoiceStatus.CANCELLED);
        if (hasActiveInvoice) {
            throw new IllegalStateException("이미 인보이스가 발행된 오더는 삭제할 수 없습니다. 인보이스를 취소해주세요.");
        }

        // 2. block deletion when shipment already exists
        List<Shipment> existingShipment = shipmentRepository.findByOrdersId(id);
        if (!existingShipment.isEmpty()) {
            throw new IllegalStateException("이미 선적이 등록된 오더는 삭제할 수 없습니다.");
        }

        // 3. delete entire Invoice with InvoiceItems, if they are CANCELLED
        for (Invoice invoice : existingInvoice) {
            List<InvoiceItems> invoiceItems = invoiceItemsRepository.findByInvoiceId(invoice.getId());
            invoiceItemsRepository.deleteAll(invoiceItems);
            invoiceRepository.delete(invoice);
        }

        // 4. release stock & delete OrdersItems
        List<OrdersItems> ordersItemsList  = ordersItemsRepository.findByOrdersId(id);

        for(OrdersItems ordersItems : ordersItemsList ) {
            stockService.releaseStock(ordersItems.getItems().getId(), ordersItems.getQuantity());
            ordersItemsRepository.delete(ordersItems);
        }

        // 3. delete the Orders itself
        ordersRepository.delete(orders);
    }

    public Page<OrdersResponseDto> getOrders(Long buyerId, int page, String orderNumber, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Orders> ordersPage = ordersRepository.findByFilters(buyerId, orderNumber, pageable);

        List<Long> ordersIds = ordersPage.getContent().stream().map(Orders::getId).toList();
        Set<Long> hasInvoiceSet = invoiceRepository.findByOrdersIdIn(ordersIds)
                .stream()
                .filter(invoice -> invoice.getStatus() != InvoiceStatus.CANCELLED)
                .map(invoice -> invoice.getOrders().getId())
                .collect(Collectors.toSet());

        return ordersPage.map(orders -> OrdersResponseDto.from(orders, hasInvoiceSet.contains(orders.getId())));
    }

    public OrdersDetailResponseDto getOrderDetail(Long id) {
        Orders orders = ordersRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("오더 없음"));

        List<OrdersItems> items = ordersItemsRepository.findByOrdersId(id);

        List<Invoice> existingInvoice = invoiceRepository.findByOrdersId(id);
        boolean hasInvoice = !existingInvoice.isEmpty();

        return OrdersDetailResponseDto.from(orders, items, hasInvoice);
    }

    public OrdersResponseDto updateOrder(Long id, OrdersCreateRequestDto dto) {
        Orders orders = ordersRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("오더 없음"));

        // 1. block deletion when invoice is issued
        List<Invoice> existingInvoice = invoiceRepository.findByOrdersId(id);
        boolean hasActiveInvoice = existingInvoice.stream()
                .anyMatch(inv -> inv.getStatus() != InvoiceStatus.CANCELLED);

        if (hasActiveInvoice) {
            throw new IllegalStateException("이미 인보이스가 발행된 오더는 수정할 수 없습니다. 인보이스를 취소해주세요.");
        }

        Company company = companyRepository.findById(dto.getBuyerId())
                .orElseThrow(() -> new IllegalArgumentException("바이어 없음"));

        Quotation quotation = null;
        if (dto.getQuotationId() != null) {
            quotation = quotationRepository.findById(dto.getQuotationId())
                    .orElseThrow(() -> new IllegalArgumentException("견적 없음"));
        }

        orders.setBuyer(company);
        orders.setQuotation(quotation);

        orders.setOrdersDate(dto.getOrdersDate());
        orders.setComment(dto.getComment());
        orders.setUpdatedAt(LocalDateTime.now());
        orders.setCurrency(dto.getCurrency());
        orders.setIncoterms(dto.getIncoterms());
        orders.setPaymentTerm(dto.getPaymentTerm());

        ordersRepository.save(orders);

        List<OrdersItems> oldItems = ordersItemsRepository.findByOrdersId(id);
        for (OrdersItems oldItem : oldItems) {
            stockService.releaseStock(oldItem.getItems().getId(), oldItem.getQuantity());
            ordersItemsRepository.delete(oldItem);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrdersItemRequestDto itemDto : dto.getItems()) {
            Items item = itemsRepository.findById(itemDto.getItemsId())
                    .orElseThrow(() -> new IllegalArgumentException("품목 없음"));

            BigDecimal lineAmount = item.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            OrdersItems ordersItems = new OrdersItems();
            ordersItems.setOrders(orders);
            ordersItems.setItems(item);
            ordersItems.setUnitPrice(item.getPrice());
            ordersItems.setQuantity(itemDto.getQuantity());
            ordersItems.setAmount(lineAmount);
            ordersItemsRepository.save(ordersItems);

            // reserve stocks -> increase reserved_quantity
            stockService.reserveStock(itemDto.getItemsId(), itemDto.getQuantity());

            totalAmount = totalAmount.add(lineAmount);
        }

        Orders saved = ordersRepository.save(orders);
        return OrdersResponseDto.from(saved, false);
    }
}
