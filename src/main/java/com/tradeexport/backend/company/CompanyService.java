package com.tradeexport.backend.company;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Transactional
public class CompanyService {

    final private CompanyRepository companyRepository;

    public Company registerCompany(CompanyCreateRequestDto dto) {
        // except for forwarding company
        Company company = new Company();
        company.setCompanyName(dto.getCompanyName());
        company.setAddress(dto.getAddress());
        company.setCountry(dto.getCountry());
        company.setNameOfOwner(dto.getNameOfOwner());
        company.setRegistrationNumber(dto.getRegistrationNumber());
        company.setRole(dto.getRole());
        company.setLogoPath(dto.getLogoPath());
        company.setSignaturePath(dto.getSignaturePath());

        // Save including belows, if it's forwarding company
        if (company.getRole().equals("FORWARDER")) {
            company.setCategory(dto.getCategory());
            company.setDeliveryMethod(dto.getDeliveryMethod());
            company.setPartnerDate(dto.getPartnerDate());
        }

        return companyRepository.save(company);
    }

}
