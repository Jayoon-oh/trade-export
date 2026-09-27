import api from "./axiosInstance";
import type { OrderDetail, OrderPipeline, PipelineFunnel } from "../types/dashboard";

export const getMyOrderPipeline = async (): Promise<OrderPipeline[]> => {
    const response = await api.get<OrderPipeline[]>('/dashboard/my-orders');
    return response.data;
}

export const getPipelineFunnel = async (): Promise<PipelineFunnel> => {
    const response = await api.get<PipelineFunnel>('/dashboard/pipeline-funnel');
    return response.data;
};

export const getOrderDetail = async (orderId: number): Promise<OrderDetail> => {
    const response = await api.get<OrderDetail>(`/dashboard/orders/${orderId}`);
    return response.data;
};