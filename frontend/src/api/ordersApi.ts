import type { Orders, OrdersCreateRequest, OrdersDetailResponse, PagedOrders } from "../types/orders";
import api from "./axiosInstance";

export const registerOrders = async (dto: OrdersCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/orders`, dto);
    return response.data;
};

export const updateOrders = async (id: number, dto: OrdersCreateRequest): Promise<Orders> => {
    const response = await api.put<Orders>(`/orders/${id}`, dto);
    return response.data;
};

export const getOrdersList = async (buyerId?: number, page: number = 0, size: number = 10): Promise<PagedOrders> => {
    const response = await api.get<PagedOrders>('/orders', {
        params: { buyerId, page, size },
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
