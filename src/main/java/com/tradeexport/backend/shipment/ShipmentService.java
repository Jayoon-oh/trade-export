package com.tradeexport.backend.shipment;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Transactional
@Service
@RequiredArgsConstructor
public class ShipmentService {
    final private ShipmentRepository shipmentRepository;
    final private OrdersRepository ordersRepository;
    final private CompanyRepository companyRepository;

    public Shipment registerShipment(ShipmentCreateRequestDto dto) {
        Orders orders = ordersRepository.findById(dto.getOrdersId())
                .orElseThrow(()-> new IllegalArgumentException("오더 없음"));

        Company forwarder = companyRepository.findById(dto.getForwarderId())
                .orElseThrow(() -> new IllegalArgumentException("포워더 없음"));

        Shipment shipment = new Shipment();
        shipment.setOrders(orders);
        shipment.setForwarder(forwarder);
        shipment.setFee(dto.getFee());
        shipment.setStatus("PLANNED");
        shipment.setShipmentDate(dto.getShipmentDate());
        shipment.setCreatedAt(LocalDateTime.now());
        shipment.setUpdatedAt(LocalDateTime.now());

        shipmentRepository.save(shipment);

        return shipment;
    }
}
