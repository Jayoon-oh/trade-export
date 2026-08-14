package com.tradeexport.backend.quotation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Quotation>> getQuotations(@RequestParam(required = false) Long buyerId) {
        List<Quotation> quotations = quotationService.getQuotations(buyerId);
        return ResponseEntity.ok(quotations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuotationDetailResponseDto> getQuotation(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.getQuotationDetail(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quotation> updateQuotation(@PathVariable Long id, @Valid @RequestBody QuotationCreateRequestDto dto) {
        Quotation updated = quotationService.updateQuotation(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuotation(@PathVariable Long id) {
        quotationService.deleteQuotation(id);
        return ResponseEntity.noContent().build();
    }

}
