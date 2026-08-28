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
    shipmentDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ShipmentCreateRequest {
    ordersId: number;
    forwarderId: number;
    fee: number;
    shipmentDate: string;
}