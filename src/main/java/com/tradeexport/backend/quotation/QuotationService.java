package com.tradeexport.backend.quotation;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.items.Items;
import com.tradeexport.backend.items.ItemsRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class QuotationService {
    private final QuotationRepository quotationRepository;
    private final QuotationItemsRepository quotationItemsRepository;
    private final CompanyRepository companyRepository;
    private final ItemsRepository itemsRepository;

    public Quotation registerQuotation(QuotationCreateRequestDto quotationDto) {
        Company company = companyRepository.findById(quotationDto.getCompanyId())
                .orElseThrow(()-> new IllegalArgumentException("거래처 없음"));

        Quotation quotation = new Quotation();
        quotation.setCompany(company);
        quotation.setCurrency(quotationDto.getCurrency());
        quotation.setIncoterms(quotationDto.getIncoterms());
        quotation.setPaymentTerm(quotationDto.getPaymentTerm());
        quotation.setComment(quotationDto.getComment());

        quotationRepository.save(quotation);

        for (QuotationItemRequestDto itemDto : quotationDto.getItems()) {
        Items item = itemsRepository.findById(itemDto.getItemsId())
                .orElseThrow(() -> new IllegalArgumentException("품목 없음"));

        QuotationItems quotationItems = new QuotationItems();
        quotationItems.setQuotation(quotation);
        quotationItems.setItems(item);
        quotationItems.setUnitPrice(item.getPrice());
        quotationItems.setQuantity(itemDto.getQuantity());
        quotationItems.setAmount(item.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));

        quotationItemsRepository.save(quotationItems);
        }
        return quotation;
    }

    public List<Quotation> getQuotations(Long buyerId) {
        if (buyerId != null) {
            return quotationRepository.findByCompanyId(buyerId);
        }
        return quotationRepository.findAll();
    }

    public QuotationDetailResponseDto getQuotationDetail(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        List<QuotationItems> items = quotationItemsRepository.findByQuotationId(id);

        QuotationDetailResponseDto dto = new QuotationDetailResponseDto();
        dto.setQuotation(quotation);
        dto.setItems(items);
        return dto;
    }

    public Quotation updateQuotation(Long id, QuotationCreateRequestDto dto) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        quotation.setCurrency(dto.getCurrency());
        quotation.setIncoterms(dto.getIncoterms());
        quotation.setPaymentTerm(dto.getPaymentTerm());
        quotation.setComment(dto.getComment());

        return quotationRepository.save(quotation);
    }

    public void deleteQuotation(Long id) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("견적 없음"));

        List<QuotationItems> items = quotationItemsRepository.findByQuotationId(id);
        quotationItemsRepository.deleteAll(items);

        quotationRepository.delete(quotation);
    }
}
