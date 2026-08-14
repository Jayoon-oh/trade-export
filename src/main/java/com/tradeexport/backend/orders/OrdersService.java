package com.tradeexport.backend.orders;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceCreateRequestDto;
import com.tradeexport.backend.invoice.InvoiceRepository;
import com.tradeexport.backend.invoice.InvoiceService;
import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import com.tradeexport.backend.quotation.Quotation;
import com.tradeexport.backend.quotation.QuotationRepository;
import com.tradeexport.backend.stock.StockService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    final private StockService stockService;
    final private InvoiceService invoiceService;

    public void createOrders(OrdersCreateRequestDto dto) {
        Company company = companyRepository.findById(dto.getBuyerId())
                .orElseThrow(()-> new IllegalArgumentException("바이어 없음"));

        // nullable
        Quotation quotation = null;
        if(dto.getQuotationId() != null) {
            quotation = quotationRepository.findById(dto.getQuotationId())
                    .orElseThrow(()-> new IllegalArgumentException("견적 없음"));
        }

        Orders orders = new Orders();

        orders.setBuyer(company);
        orders.setQuotation(quotation);
        orders.setOrdersDate(dto.getOrdersDate());
        orders.setComment(dto.getComment());
        orders.setCreatedAt(LocalDateTime.now());
        orders.setUpdatedAt(LocalDateTime.now());
        orders.setCurrency(dto.getCurrency());
        orders.setIncoterms(dto.getIncoterms());
        orders.setPaymentTerm(dto.getPaymentTerm());

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

        orders.setAmount(totalAmount);
        ordersRepository.save(orders);
    }

    public void cancelOrders(Long ordersId) {
        Orders orders = ordersRepository.findById(ordersId)
                .orElseThrow(()->new IllegalArgumentException("오더 없음"));

        // 1. block deletion when invoice already exists
        List<Invoice> existingInvoice = invoiceRepository.findByOrdersId(ordersId);
        if (!existingInvoice.isEmpty()) {
            throw new IllegalStateException("이미 인보이스가 발행된 오더는 삭제할 수 없습니다. 인보이스를 취소해주세요.");
        }

        // 2. release stock & delete OrdersItems
        List<OrdersItems> ordersItemsList  = ordersItemsRepository.findByOrdersId(ordersId);

        for(OrdersItems ordersItems : ordersItemsList ) {
            stockService.releaseStock(ordersItems.getItems().getId(), ordersItems.getQuantity());
            ordersItemsRepository.delete(ordersItems);
        }

        // 3. delete the Orders itself
        ordersRepository.delete(orders);
    }
}
