package com.tradeexport.backend.payment;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class PaymentService {
    final private PaymentRepository paymentRepository;
    final private InvoiceRepository invoiceRepository;

    public Payment createPayment(PaymentCreateRequestDto dto) {
        Invoice invoice = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(()-> new IllegalArgumentException("인보이스 없음"));

        Payment payment = new Payment();

        payment.setInvoice(invoice);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public List<PaymentResponseDto> getPayments(Long buyerId, PaymentStatus status){
        return paymentRepository.findByFilter(buyerId, status)
                .stream()
                .map(PaymentResponseDto::from)
                .toList();
    }

    public PaymentResponseDto getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("결제내역 없음"));
        return PaymentResponseDto.from(payment);
    }

    public PaymentResponseDto updatePayment(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("결제내역 없음"));

        payment.setStatus(status);
        Payment saved = paymentRepository.save(payment);

        return PaymentResponseDto.from(saved);
    }
}
