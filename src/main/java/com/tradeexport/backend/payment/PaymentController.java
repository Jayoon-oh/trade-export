package com.tradeexport.backend.payment;

import com.tradeexport.backend.invoice.InvoiceBalanceDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    final public PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Long> createPayment(@Valid @RequestBody PaymentCreateRequestDto dto) {
        Payment saved = paymentService.createPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    @GetMapping
    public ResponseEntity<Page<PaymentResponseDto>> getPayments(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) String invoiceNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(paymentService.getPayments(buyerId, status, invoiceNumber, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponseDto> updatePayment(@PathVariable Long id, @RequestBody PaymentStatus status) {
        return ResponseEntity.ok(paymentService.updatePayment(id, status));
    }

    @GetMapping("/by-invoice/{invoiceId}")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByInvoice(invoiceId));
    }

    @GetMapping("/balance/{invoiceId}")
    public ResponseEntity<InvoiceBalanceDto> getInvoiceBalance(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getInvoiceBalance(invoiceId));
    }

    @GetMapping("/invoice/{invoiceId}/detail")
    public ResponseEntity<PaymentDetailDto> getPaymentDetail(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentDetail(invoiceId));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<PaymentStatusHistoryDto>> getStatusHistory(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getStatusHistory(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
