package com.tradeexport.backend.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CompanyCreateRequestDto {
    @NotBlank
    private String companyName;

    @NotBlank
    private String address;

    @NotBlank
    private String country;

    @NotBlank
    private String nameOfOwner;

    private String registrationNumber;
    private LocalDateTime partnerDate;
    private String category;
    private String deliveryMethod;

    @NotBlank
    private String role;

    private String logoPath;
    private String signaturePath;
}
