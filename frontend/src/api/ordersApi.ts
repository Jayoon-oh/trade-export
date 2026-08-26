import type { Orders, OrdersCreateRequest, OrdersDetailResponse } from "../types/orders";
import api from "./axiosInstance";

export const registerOrders = async (dto: OrdersCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/orders`, dto);
    return response.data;
};

export const updateOrders = async (id: number, dto: OrdersCreateRequest): Promise<Orders> => {
    const response = await api.put<Orders>(`/orders/${id}`, dto);
    return response.data;
};

export const getOrdersList = async (buyerId?: number): Promise<Orders[]> => {
    const response = await api.get<Orders[]>('/orders', {
        params: { buyerId }
    });
    return response.data;
};

export const getOrder = async (id: number): Promise<OrdersDetailResponse> => {
    const response = await api.get<OrdersDetailResponse>(`/orders/${id}`);
    return response.data;
};

export const deleteOrders = async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
};