package com.tradeexport.backend.invoice;

import com.tradeexport.backend.orders.OrdersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/{id}/invoices")
    public ResponseEntity<Long> createInvoice(@PathVariable Long id, @Valid @RequestBody InvoiceCreateRequestDto dto) {
        invoiceService.issueInvoice(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
