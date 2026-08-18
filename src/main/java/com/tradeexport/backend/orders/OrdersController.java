package com.tradeexport.backend.orders;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceCreateRequestDto;
import com.tradeexport.backend.invoice.InvoiceService;
import com.tradeexport.backend.quotation.Quotation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public ResponseEntity<List<OrdersResponseDto>> getOrders(@RequestParam(required = false) Long buyerId) {
        return ResponseEntity.ok(ordersService.getOrders(buyerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdersResponseDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ordersService.getOrder(id));
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

}
