package com.tradeexport.backend.payment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<List<PaymentResponseDto>> getPayments(@RequestParam(required = false) Long buyerId, @RequestParam(required = false) PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPayments(buyerId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponseDto> updatePayment(@PathVariable Long id, @RequestParam PaymentStatus status) {
        return ResponseEntity.ok(paymentService.updatePayment(id, status));
    }
}
