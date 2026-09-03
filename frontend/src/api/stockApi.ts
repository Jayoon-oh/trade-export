import api from './axiosInstance';
import type { PagedStock } from '../types/stock';

export const getStockList = async (productName?: string, page: number = 0, size: number = 10): Promise<PagedStock> => {
    const response = await api.get<PagedStock>('/stock', {
        params: { productName, page, size },
    });
    return response.data;
};