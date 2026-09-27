package com.tradeexport.backend.company;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    // search one company
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("거래처 없음"));
    }

    // search company list with pagination
    public Page<CompanyResponseDto> searchCompanies(String role, String companyName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return companyRepository.findByFilters(role, companyName,pageable)
                .map(CompanyResponseDto::from);
    }

    public List<CompanyResponseDto> getAllCompanies(String role) {
        return companyRepository.findAllByRole(role)
                .stream()
                .map(CompanyResponseDto::from)
                .toList();
    }

    // update company
    public Company updateCompany(Long id, CompanyCreateRequestDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("거래처 없음"));

        company.setCompanyName(dto.getCompanyName());
        company.setAddress(dto.getAddress());
        company.setCountry(dto.getCountry());
        company.setNameOfOwner(dto.getNameOfOwner());
        company.setRegistrationNumber(dto.getRegistrationNumber());
        company.setRole(dto.getRole());
        company.setLogoPath(dto.getLogoPath());
        company.setSignaturePath(dto.getSignaturePath());

        if (company.getRole().equals("FORWARDER")) {
            company.setCategory(dto.getCategory());
            company.setDeliveryMethod(dto.getDeliveryMethod());
            company.setPartnerDate(dto.getPartnerDate());
        }

        return companyRepository.save(company);
    }

}
