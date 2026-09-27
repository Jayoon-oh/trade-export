package com.tradeexport.backend.shipment;

import com.tradeexport.backend.company.Company;
import com.tradeexport.backend.company.CompanyRepository;
import com.tradeexport.backend.orders.Orders;
import com.tradeexport.backend.orders.OrdersRepository;
import com.tradeexport.backend.packinglist.PackingList;
import com.tradeexport.backend.packinglist.PackingListRepository;
import com.tradeexport.backend.security.CurrentUserProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class ShipmentService {
    final private ShipmentRepository shipmentRepository;
    final private OrdersRepository ordersRepository;
    final private CompanyRepository companyRepository;
    final private CurrentUserProvider currentUserProvider;
    final private ShipmentStatusHistoryRepository shipmentStatusHistoryRepository;
    final private PackingListRepository packinglistRepository;

    public Shipment registerShipment(ShipmentCreateRequestDto dto) {
        Orders orders = ordersRepository.findById(dto.getOrdersId())
                .orElseThrow(()-> new IllegalArgumentException("오더 없음"));

        Company forwarder = companyRepository.findById(dto.getForwarderId())
                .orElseThrow(() -> new IllegalArgumentException("포워더 없음"));

        // count existing shipments for this order to determine the sequence number
        long existingCount = shipmentRepository.countByOrdersId(dto.getOrdersId());

        Shipment shipment = new Shipment();
        shipment.setOrders(orders);
        shipment.setForwarder(forwarder);
        shipment.setStatus(ShipmentStatus.PLANNED);
        shipment.setShipmentDate(dto.getShipmentDate());
        shipment.setShipmentSequence((int) existingCount + 1);
        shipment.setCreatedAt(LocalDateTime.now());
        shipment.setUpdatedAt(LocalDateTime.now());

        shipmentRepository.save(shipment);

        return shipment;
    }

    public Page<ShipmentResponseDto> getShipments(Long buyerId, Long forwarderId, ShipmentStatus status, String orderNumber, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return shipmentRepository.findByFilters(buyerId, forwarderId, status, orderNumber, pageable)
                .map(ShipmentResponseDto::from);
    }

    public ShipmentResponseDto getShipment(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("선적 없음"));
        return ShipmentResponseDto.from(shipment);
    }

    public ShipmentResponseDto updateShipmentStatus(Long id, ShipmentStatus newStatus) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("선적 없음"));

        // record shipment's status
        ShipmentStatus previousStatus = shipment.getStatus();

        if (previousStatus == ShipmentStatus.DELIVERED && newStatus == ShipmentStatus.CANCELLED) {
            throw new IllegalStateException("배송 완료된 건은 취소할 수 없습니다.");
        }
        if (previousStatus == ShipmentStatus.CANCELLED) {
            throw new IllegalStateException("이미 취소된 배송입니다.");
        }

        shipment.setStatus(newStatus);
        Shipment saved = shipmentRepository.save(shipment);

        ShipmentStatusHistory history = new ShipmentStatusHistory();
        history.setShipment(saved);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setChangedAt(LocalDateTime.now());
        history.setChangedBy(currentUserProvider.getCurrentUser());
        shipmentStatusHistoryRepository.save(history);

        return ShipmentResponseDto.from(saved);
    }

    public ShipmentResponseDto updateShipment(Long id, ShipmentCreateRequestDto dto) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("선적 없음"));

        Orders orders = ordersRepository.findById(dto.getOrdersId())
                .orElseThrow(() -> new IllegalArgumentException("오더 없음"));
        Company forwarder = companyRepository.findById(dto.getForwarderId())
                .orElseThrow(() -> new IllegalArgumentException("포워더 없음"));

        shipment.setOrders(orders);
        shipment.setForwarder(forwarder);
        shipment.setShipmentDate(dto.getShipmentDate());

        Shipment saved = shipmentRepository.save(shipment);
        return ShipmentResponseDto.from(saved);
    }

    public List<ShipmentStatusHistoryDto> getStatusHistory(Long shipmentId) {
        List<ShipmentStatusHistory> histories = shipmentStatusHistoryRepository.findByShipmentIdOrderByChangedAtDesc(shipmentId);

        return histories.stream()
                .map(h -> new ShipmentStatusHistoryDto(
                        h.getPreviousStatus(),
                        h.getNewStatus(),
                        h.getChangedAt(),
                        h.getChangedBy().getName()
                ))
                .toList();
    }

    public void deleteShipment(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("배송 정보 없음"));

        List<PackingList> packingLists = packinglistRepository.findByShipmentId(id);
        if (!packingLists.isEmpty()) {
            throw new IllegalStateException("이미 패킹리스트가 등록된 선적은 삭제할 수 없습니다.");
        }

        if (shipment.getStatus() != ShipmentStatus.PLANNED) {
            throw new IllegalStateException(("PLANNED 상태의 선적만 삭제 가능합니다."));
        }

        shipmentRepository.delete(shipment);
    }
}
