package com.tradeexport.backend.shipment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shipments")
public class ShipmentController {

    final private ShipmentService shipmentService;

    @PostMapping
    public ResponseEntity<Long> createShipment(@Valid @RequestBody ShipmentCreateRequestDto dto) {
        Shipment saved = shipmentService.registerShipment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }

    @GetMapping
    public ResponseEntity<Page<ShipmentResponseDto>> getShipments(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(required = false) Long forwarderId,
            @RequestParam(required = false, name = "shipmentStatus") ShipmentStatus status,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(shipmentService.getShipments(buyerId, forwarderId, status, orderNumber, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponseDto> getShipment(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipment(id));
    }

    // update status of shipment
    @PatchMapping("/{id}/status")
    public ShipmentResponseDto updateStatus(@PathVariable Long id, @RequestBody ShipmentStatus status) {
        return shipmentService.updateShipmentStatus(id, status);
    }

    @PutMapping("/{id}")
    public ShipmentResponseDto updateShipment(@PathVariable Long id, @RequestBody ShipmentCreateRequestDto dto) {
        return shipmentService.updateShipment(id, dto);
    }

    // ShipmentController
    @GetMapping("/{id}/history")
    public ResponseEntity<List<ShipmentStatusHistoryDto>> getStatusHistory(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getStatusHistory(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.noContent().build();

    }
}
