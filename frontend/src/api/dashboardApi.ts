import api from "./axiosInstance";
import type { OrderPipeline, PipelineFunnel } from "../types/dashboard";

export const getMyOrderPipeline = async (): Promise<OrderPipeline[]> => {
    const response = await api.get<OrderPipeline[]>('/dashboard/my-orders');
    return response.data;
}

export const getPipelineFunnel = async (): Promise<PipelineFunnel> => {
    const response = await api.get<PipelineFunnel>('/dashboard/pipeline-funnel');
    return response.data;
};