package com.tradeexport.backend.shipment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shipment")
public class ShipmentController {

    final private ShipmentService shipmentService;

    public ResponseEntity<Long> createShipment(@Valid @RequestBody ShipmentCreateRequestDto dto) {
        Shipment saved = shipmentService.registerShipment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }
}
