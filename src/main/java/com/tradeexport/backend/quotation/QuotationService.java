package com.tradeexport.backend.quotation;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersRepository;
import com.tradeexport.backend.pdf.PdfService;
import com.tradeexport.backend.security.CurrentUserProvider;
import com.tradeexport.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
@RequiredArgsConstructor
public class QuotationService {
    private final QuotationRepository quotationRepository;
    private final QuotationItemsRepository quotationItemsRepository;
    private final CompanyRepository companyRepository;
    private final ItemsRepository itemsRepository;
    private final CurrentUserProvider currentUserProvider;
    private final OrdersRepository ordersRepository;
    private final PdfService pdfService;

    public Quotation registerQuotation(QuotationCreateRequestDto quotationDto) {
        Company company = companyRepository.findById(quotationDto.getCompanyId())
                .orElseThrow(()-> new IllegalArgumentException("거래처 없음"));

        Quotation quotation = new Quotation();
        quotation.setCompany(company);
        quotation.setCurrency(quotationDto.getCurrency());
        quotation.setIncoterms(quotationDto.getIncoterms());
        quotation.setPaymentTerm(quotationDto.getPaymentTerm());
        quotation.setComment(quotationDto.getComment());
        quotation.setQuotationDate(quotationDto.getQuotationDate());
        quotation.setExchangeRate(quotationDto.getExchangeRate());
        quotation.setCreatedAt(LocalDateTime.now());
        quotation.setUpdatedAt(LocalDateTime.now());
        quotation.setCreatedBy(currentUserProvider.getCurrentUser());

        quotationRepository.save(quotation);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (QuotationItemRequestDto itemDto : quotationDto.getItems()) {
        Items item = itemsRepository.findById(itemDto.getItemsId())
                .orElseThrow(() -> new IllegalArgumentException("품목 없음"));

        // adapt exchange rate to amount
        BigDecimal unitPriceConverted = item.getPrice().divide(quotationDto.getExchangeRate(), 2, RoundingMode.HALF_UP);
        BigDecimal lineAmount = unitPriceConverted.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

        QuotationItems quotationItems = new QuotationItems();
        quotationItems.setQuotation(quotation);
        quotationItems.setItems(item);
        quotationItems.setUnitPrice(unitPriceConverted);
        quotationItems.setQuantity(itemDto.getQuantity());
        quotationItems.setAmount(lineAmount);

        quotationItemsRepository.save(quotationItems);

        totalAmount = totalAmount.add(lineAmount);
        }

        quotation.setTotalAmount(totalAmount);
        return quotationRepository.save(quotation);
    }

    public Page<QuotationResponseDto> getQuotations(Long buyerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return quotationRepository.findByCompanyId(buyerId, pageable)
                .map(QuotationResponseDto::from);
    }

    public QuotationDetailResponseDto getQuotationDetail(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        List<QuotationItems> items = quotationItemsRepository.findByQuotationId(id);

        return QuotationDetailResponseDto.from(quotation, items);
    }

    public QuotationResponseDto updateQuotation(Long id, QuotationCreateRequestDto dto) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        quotation.setCurrency(dto.getCurrency());
        quotation.setIncoterms(dto.getIncoterms());
        quotation.setPaymentTerm(dto.getPaymentTerm());
        quotation.setComment(dto.getComment());
        quotation.setExchangeRate(dto.getExchangeRate());

        quotationRepository.save(quotation);

        // delete existing items
        List<QuotationItems> oldItems = quotationItemsRepository.findByQuotationId(id);
        quotationItemsRepository.deleteAll(oldItems);

        // refill new items
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (QuotationItemRequestDto itemDto : dto.getItems()) {
            Items item = itemsRepository.findById(itemDto.getItemsId())
                    .orElseThrow(() -> new IllegalArgumentException("품목 없음"));

            BigDecimal unitPriceConverted = item.getPrice().divide(dto.getExchangeRate(), 2, RoundingMode.HALF_UP);
            BigDecimal lineAmount = unitPriceConverted.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            QuotationItems quotationItems = new QuotationItems();
            quotationItems.setQuotation(quotation);
            quotationItems.setItems(item);
            quotationItems.setUnitPrice(unitPriceConverted);
            quotationItems.setQuantity(itemDto.getQuantity());
            quotationItems.setAmount(lineAmount);
            quotationItemsRepository.save(quotationItems);

            totalAmount = totalAmount.add(lineAmount);
        }

        quotation.setTotalAmount(totalAmount);
        Quotation saved = quotationRepository.save(quotation);
        return QuotationResponseDto.from(saved);
    }

    public void deleteQuotation(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        List<Orders> linkedOrders = ordersRepository.findByQuotationId(id);
        if (!linkedOrders.isEmpty()) {
            throw new IllegalStateException("이미 오더로 전환된 견적은 삭제할 수 없습니다.");
        }

        List<QuotationItems> items = quotationItemsRepository.findByQuotationId(id);
        quotationItemsRepository.deleteAll(items);

        quotationRepository.delete(quotation);
    }

    // PI(Proforma invoice)
    public QuotationPdfDataDto getQuotationPdfData(Long quotationId) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        Company seller = companyRepository.findByRole("SELLER").get(0);
        Company buyer = quotation.getCompany();

        List<QuotationItems> quotationItems = quotationItemsRepository.findByQuotationId(quotationId);

        List<QuotationItemLineDto> itemLines = quotationItems.stream()
                .map(QuotationItemLineDto::from)
                .toList();

        String quotationNumber = "PI-" + String.format("%06d", quotation.getId());

        return new QuotationPdfDataDto(
                quotationNumber,
                quotation.getQuotationDate(),
                quotation.getCurrency(),
                quotation.getTotalAmount(),

                seller.getCompanyName(),
                seller.getAddress(),
                seller.getRegistrationNumber(),
                seller.getNameOfOwner(),
                pdfService.resolveImagePath(seller.getLogoPath()),
                pdfService.resolveImagePath(seller.getSignaturePath()),

                buyer.getCompanyName(),
                buyer.getAddress(),
                buyer.getRegistrationNumber(),

                itemLines
        );
    }

    public byte[] generateQuotationPdf(Long quotationId) {
        QuotationPdfDataDto dto = getQuotationPdfData(quotationId);

        Map<String, Object> data = new HashMap<>();
        data.put("sellerName", dto.sellerName());
        data.put("sellerAddress", dto.sellerAddress());
        data.put("sellerRegistrationNumber", dto.sellerRegistrationNumber());
        data.put("sellerOwnerName", dto.sellerOwnerName());
        data.put("sellerLogoPath", dto.sellerLogoPath());
        data.put("sellerSignaturePath", dto.sellerSignaturePath());
        data.put("buyerName", dto.buyerName());
        data.put("buyerAddress", dto.buyerAddress());
        data.put("buyerRegistrationNumber", dto.buyerRegistrationNumber());
        data.put("quotationNumber", dto.quotationNumber());
        data.put("quotationDate", dto.quotationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        data.put("currency", dto.currency());
        data.put("totalAmount", dto.totalAmount());
        data.put("items", dto.items());

        return pdfService.generatePdf("pdf/quotation", data);
    }
}
