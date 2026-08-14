package com.tradeexport.backend.orders;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceCreateRequestDto;
import com.tradeexport.backend.invoice.InvoiceService;
import jakarta.validation.Valid;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
