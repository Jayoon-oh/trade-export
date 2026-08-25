package com.tradeexport.backend.shipment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<List<ShipmentResponseDto>> getShipments(
            @RequestParam(required = false) Long buyerId,
            @RequestParam(required = false) Long forwarderId,
            @RequestParam(required = false) ShipmentStatus status) {
        return ResponseEntity.ok(shipmentService.getShipments(buyerId, forwarderId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponseDto> getShipment(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipment(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShipmentResponseDto> updateShipment(@PathVariable Long id, @RequestParam ShipmentStatus status) {
        return  ResponseEntity.ok(shipmentService.updateShipment(id,status));
    }
}
