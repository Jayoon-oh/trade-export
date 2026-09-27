package com.tradeexport.backend.company;

public record CompanyResponseDto(
        Long id,
        String companyName,
        String address,
        String country,
        String nameOfOwner,
        String registrationNumber,
        String role,
        String category,
        String deliveryMethod
) {
    public static CompanyResponseDto from(Company company) {
        return new CompanyResponseDto(
                company.getId(),
                company.getCompanyName(),
                company.getAddress(),
                company.getCountry(),
                company.getNameOfOwner(),
                company.getRegistrationNumber(),
                company.getRole(),
                company.getCategory(),
                company.getDeliveryMethod()
        );
    }
}
