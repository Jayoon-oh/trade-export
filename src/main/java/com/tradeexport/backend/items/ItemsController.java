package com.tradeexport.backend.items;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsController {

    final private ItemsService itemsService;

    @PostMapping
    public ResponseEntity<Long> createItems(@Valid @RequestBody ItemsCreateRequestDto dto) {
        Items saved = itemsService.registerItems(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved .getId());
    }

    @GetMapping
    public ResponseEntity<List<Items>> getItems(@RequestParam(required = false) String productName) {
        List<Items> items = itemsService.getItems(productName);
        return ResponseEntity.ok(items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Items> updateItems(@PathVariable Long id, @Valid @RequestBody ItemsCreateRequestDto dto) {
        Items items = itemsService.updateItems(id, dto);
        return ResponseEntity.ok(items);
    }

}
