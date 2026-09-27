package com.tradeexport.backend.payment;

import com.tradeexport.backend.dashboard.PaymentRecordDto;
import com.tradeexport.backend.invoice.Invoice;
import com.tradeexport.backend.invoice.InvoiceBalanceDto;
import com.tradeexport.backend.invoice.InvoiceRepository;
import com.tradeexport.backend.security.CurrentUserProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class PaymentService {
    final private PaymentRepository paymentRepository;
    final private InvoiceRepository invoiceRepository;
    final private PaymentStatusHistoryRepository paymentStatusHistoryRepository;
    final private CurrentUserProvider currentUserProvider;

    public Payment createPayment(PaymentCreateRequestDto dto) {
        Invoice invoice = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(()-> new IllegalArgumentException("인보이스 없음"));

        // prevent exceeding payments
        List<Payment> existingPayments = paymentRepository.findByInvoiceId(dto.getInvoiceId());

        BigDecimal totalCommitted = existingPayments.stream()
                .filter(p -> p.getStatus() != PaymentStatus.CANCELLED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = invoice.getTotalAmount().subtract(totalCommitted);

        if (dto.getAmount().compareTo(remaining) > 0)  {
            throw new IllegalStateException("결제 금액이 남은 잔액을 초과합니다");
        }

        Payment payment = new Payment();

        payment.setInvoice(invoice);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public Page<PaymentResponseDto> getPayments(Long buyerId, PaymentStatus status, String invoiceNumber, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return paymentRepository.findByFilter(buyerId, status, invoiceNumber, pageable)
                .map(PaymentResponseDto::from);
    }

    public PaymentResponseDto getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("결제내역 없음"));
        return PaymentResponseDto.from(payment);
    }

    public PaymentResponseDto updatePayment(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("결제내역 없음"));

        PaymentStatus previousStatus = payment.getStatus();

        if (previousStatus == PaymentStatus.COMPLETED) {
            throw new IllegalStateException("완료된 결제는 상태를 변경할 수 없습니다.");
        }
        if (previousStatus == PaymentStatus.CANCELLED) {
            throw new IllegalStateException("이미 취소된 결제입니다.");
        }

        payment.setStatus(status);
        if (status == PaymentStatus.COMPLETED) {
            payment.setPaymentDate(LocalDate.now());
        }
        Payment saved = paymentRepository.save(payment);

        PaymentStatusHistory history = new PaymentStatusHistory();
        history.setPayment(saved);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(status);
        history.setChangedAt(LocalDateTime.now());
        history.setChangedBy(currentUserProvider.getCurrentUser());
        paymentStatusHistoryRepository.save(history);

        return PaymentResponseDto.from(saved);
    }

    // history of per payment
    public List<PaymentStatusHistoryDto> getStatusHistory(Long paymentId) {
        List<PaymentStatusHistory> histories = paymentStatusHistoryRepository.findByPaymentIdOrderByChangedAtDesc(paymentId);

        return histories.stream()
                .map(h -> new PaymentStatusHistoryDto(
                        h.getPreviousStatus(),
                        h.getNewStatus(),
                        h.getChangedAt(),
                        h.getChangedBy().getName()
                ))
                .toList();
    }

    // list of installment payment
    public List<PaymentResponseDto> getPaymentsByInvoice(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId)
                .stream()
                .map(PaymentResponseDto::from)
                .toList();
    }

    public InvoiceBalanceDto getInvoiceBalance(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("인보이스 없음"));

        List<Payment> payments = paymentRepository.findByInvoiceId(invoiceId);

        BigDecimal totalPaid = payments.stream()
                .filter(p-> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = invoice.getTotalAmount().subtract(totalPaid);

        return new InvoiceBalanceDto(invoiceId, invoice.getTotalAmount(), invoice.getCurrency(), totalPaid, remaining);
    }

    public PaymentDetailDto getPaymentDetail(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("인보이스 없음"));

        List<Payment> payments = paymentRepository.findByInvoiceId(invoiceId);

        BigDecimal totalPaid = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = invoice.getTotalAmount().subtract(totalPaid);

        List<PaymentRecordDto> paymentRecords = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(p -> new PaymentRecordDto(p.getPaymentDate(), p.getAmount()))
                .toList();

        return new PaymentDetailDto(
                invoice.getInvoiceNumber(),
                invoice.getInvoiceDate().toLocalDate(),
                invoice.getTotalAmount(),
                invoice.getConvertedAmount(),
                totalPaid,
                remaining,
                paymentRecords
        );
    }

    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("결제내역 없음"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("대기(PENDING) 상태의 결제만 삭제할 수 있습니다.");
        }

        paymentRepository.delete(payment);
    }
}
