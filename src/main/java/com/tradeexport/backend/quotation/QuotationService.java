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

@Transactional
@Service
@RequiredArgsConstructor
public class QuotationService {
    private final QuotationRepository quotationRepository;
    private final QuotationItemsRepository quotationItemsRepository;
    private final CompanyRepository companyRepository;
    private final ItemsRepository itemsRepository;

    public void registerQuotation(QuotationCreateRequestDto quotationDto) {
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
    }
}
