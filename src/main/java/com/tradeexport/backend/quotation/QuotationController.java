package com.tradeexport.backend.quotation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quotations")
public class QuotationController {

    final private QuotationService quotationService;

    @PostMapping
    public ResponseEntity<Long> createQuotation(@Valid @RequestBody QuotationCreateRequestDto dto) {
        Quotation saved = quotationService.registerQuotation(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    @GetMapping
    public ResponseEntity<Page<QuotationResponseDto>> getQuotations(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quotationService.getQuotations(buyerId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuotationDetailResponseDto> getQuotation(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.getQuotationDetail(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuotationResponseDto> updateQuotation(@PathVariable Long id, @Valid @RequestBody QuotationCreateRequestDto dto) {
        QuotationResponseDto updated = quotationService.updateQuotation(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuotation(@PathVariable Long id) {
        quotationService.deleteQuotation(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generateQuotationPdf(@PathVariable Long id) {
        byte[] pdfBytes = quotationService.generateQuotationPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("quotation.pdf").build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
