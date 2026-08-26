import api from './axiosInstance';
import type { Stock } from '../types/stock';

export const getStockList = async (productName?: string): Promise<Stock[]> => {
    const response = await api.get<Stock[]>('/stock', {
        params: { productName },
    });
    return response.data;
};