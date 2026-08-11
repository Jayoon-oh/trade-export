package com.tradeexport.backend.payment;

import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Transactional
@Service
@RequiredArgsConstructor
public class PaymentService {
    final private PaymentRepository paymentRepository;
    final private InvoiceRepository invoiceRepository;

    public void createPayment(PaymentCreateRequestDto dto) {
        Invoice invoice = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(()-> new IllegalArgumentException("거래처 없음"));

        Payment payment = new Payment();

        payment.setInvoice(invoice);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setStatus("예정");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
    }
}
