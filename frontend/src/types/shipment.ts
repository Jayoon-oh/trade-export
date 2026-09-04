export type ShipmentStatus = 'PLANNED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface Shipment {
    id: number;
    ordersId: number;
    buyerId: number;
    buyerName: string;
    forwarderId: number;
    forwarderName: string;
    fee: number;
    status: ShipmentStatus;
    orderNumber: string;
    shipmentDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface PagedShipments {
    content: Shipment[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface ShipmentCreateRequest {
    ordersId: number;
    forwarderId: number;
    fee: number;
    shipmentDate: string;
}