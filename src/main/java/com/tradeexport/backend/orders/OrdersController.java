package com.tradeexport.backend.orders;

import com.tradeexport.backend.invoice.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrdersService ordersService;
    private final InvoiceService invoiceService;

    @PostMapping("/{id}/invoices")
    public ResponseEntity<Long> issueInvoice(@PathVariable Long id, @Valid @RequestBody InvoiceCreateRequestDto dto) {
        Invoice saved = invoiceService.issueInvoice(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    // get list of Invoices
    @GetMapping("/{id}/invoices")
    public ResponseEntity<List<InvoiceResponseDto>> getInvoices(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoices(id));
    }

    // update status of Invoice
    @PatchMapping("/{invoiceId}/cancel")
    public ResponseEntity<InvoiceResponseDto> updateInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.updateInvoice(invoiceId, InvoiceStatus.CANCELLED));
    }

    @GetMapping
    public ResponseEntity<Page<OrdersResponseDto>> getOrders(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ordersService.getOrders(buyerId, page,orderNumber, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdersDetailResponseDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ordersService.getOrderDetail(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrders(@PathVariable Long id) {
        ordersService.cancelOrders(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Long> registerOrder(@Valid @RequestBody OrdersCreateRequestDto dto) {
        Orders saved = ordersService.registerOrder(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdersResponseDto> updateOrder(@PathVariable Long id, @Valid @RequestBody OrdersCreateRequestDto dto) {
        OrdersResponseDto updated = ordersService.updateOrder(id, dto);
        return ResponseEntity.ok(updated);
    }

    // Partial invoice
    @GetMapping("/{id}/remaining-items")
    public ResponseEntity<List<RemainingItemDto>> getRemainingItems(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getRemainingItems(id));
    }

}
