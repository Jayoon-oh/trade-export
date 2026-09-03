import type { PagedShipments, Shipment, ShipmentCreateRequest, ShipmentStatus } from "../types/shipment";
import api from "./axiosInstance";

export const createShipment = async (dto: ShipmentCreateRequest): Promise<Shipment> => {
    const response = await api.post<Shipment>('/shipments', dto);
    return response.data;
};

export const getShipmentsList = async (buyerId?: number, forwarderId?: number, shipmentStatus?: string, page: number = 0, size: number = 10): Promise<PagedShipments> => {
    const response = await api.get<PagedShipments>('/shipments', {
        params: { buyerId, forwarderId, shipmentStatus, page, size },
    });
    return response.data;
};

export const getShipment = async (id: number): Promise<Shipment> => {
    const response = await api.get<Shipment>(`/shipments/${id}`);
    return response.data;
};

export const updateShipmentStatus = async (id: number, status: ShipmentStatus): Promise<Shipment> => {
    const response = await api.patch<Shipment>(`/shipments/${id}/status`, status, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const updateShipment = async (id: number, dto: ShipmentCreateRequest): Promise<Shipment> => {
    const response = await api.put<Shipment>(`/shipments/${id}`, dto);
    return response.data;
};