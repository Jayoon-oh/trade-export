package com.tradeexport.backend.company;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String address;
    private String country;
    private String registrationNumber;
    private String nameOfOwner;
    private LocalDateTime partnerDate;
    private String category;
    private String deliveryMethod;
    private String role;
    private String logoPath;
    private String signaturePath;
}
