package com.tradeexport.backend.invoice;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/{id}/invoices")
    public ResponseEntity<Long> createInvoice(@PathVariable Long id, @Valid @RequestBody InvoiceCreateRequestDto dto) {
        invoiceService.issueInvoice(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{invoiceId}/pdf")
    public ResponseEntity<byte[]> generateInvoicePdf(@PathVariable Long invoiceId) {
        byte[] pdfBytes = invoiceService.generateInvoicePdf(invoiceId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("invoice.pdf").build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

}
