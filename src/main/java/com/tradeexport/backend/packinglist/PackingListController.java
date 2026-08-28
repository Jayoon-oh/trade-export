package com.tradeexport.backend.packinglist;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<PackingListResponse>> getPackingLists(@RequestParam(required = false) Long buyerId) {
        List<PackingListResponse> packingLists = packingListService.getPackingLists(buyerId);
        return ResponseEntity.ok(packingLists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackingListResponse> getPackingList(@PathVariable Long id) {
        return ResponseEntity.ok(packingListService.getPackingList(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PackingListResponse> updatePackingList(@PathVariable Long id, @Valid @RequestBody PackingListCreateRequestDto dto) {
        PackingListResponse packingListResponse = packingListService.updatePackingList(id, dto);
        return ResponseEntity.ok(packingListResponse);
    }

    @PostMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generatePackingListPdf(@PathVariable Long id) {
        byte[] pdfBytes = packingListService.generatePackingListPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("packing-list.pdf").build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
