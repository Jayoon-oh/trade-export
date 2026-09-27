package com.tradeexport.backend.company;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<Long> createCompany(@Valid @RequestBody CompanyCreateRequestDto dto) {
        Company saved = companyService.registerCompany(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(company);
    }

    // search company list with pagination
    @GetMapping
    public ResponseEntity<Page<CompanyResponseDto>> getCompanies(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String companyName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(companyService.searchCompanies(role, companyName,page, size));
    }

    // search company list without pagination
    @GetMapping("/all")
    public ResponseEntity<List<CompanyResponseDto>> getAllCompanies(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(companyService.getAllCompanies(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @Valid @RequestBody CompanyCreateRequestDto dto) {
        Company company = companyService.updateCompany(id, dto);
        return ResponseEntity.ok(company);
    }
}
