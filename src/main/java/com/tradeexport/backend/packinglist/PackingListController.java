package com.tradeexport.backend.packinglist;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<PackingListResponseDto>> getPackingLists(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PackingListResponseDto> packingLists = packingListService.getPackingLists(buyerId, orderNumber, page, size);
        return ResponseEntity.ok(packingLists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackingListDetailResponseDto> getPackingList(@PathVariable Long id) {
        return ResponseEntity.ok(packingListService.getPackingList(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PackingListResponseDto> updatePackingList(@PathVariable Long id, @Valid @RequestBody PackingListCreateRequestDto dto) {
        PackingListResponseDto packingListResponse = packingListService.updatePackingList(id, dto);
        return ResponseEntity.ok(packingListResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackingList(@PathVariable Long id) {
        packingListService.deletePackingList(id);
        return ResponseEntity.noContent().build();
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

    @GetMapping("/available-items")
    public ResponseEntity<List<PackingListAvailableItemDto>> getAvailableItems(@RequestParam Long shipmentId) {
        return ResponseEntity.ok(packingListService.getAvailableItems(shipmentId));
    }
}
