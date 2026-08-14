package com.tradeexport.backend.packinglist;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/packing-lists")
@RequiredArgsConstructor
public class PackingListController {

    final private PackingListService packingListService;

    @PostMapping
    public ResponseEntity<Long> createPackingList(@Valid @RequestBody PackingListCreateRequestDto dto) {
        PackingList saved = packingListService.createPackingList(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }
}
