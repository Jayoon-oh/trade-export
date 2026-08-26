import api from './axiosInstance';
import type { Items, ItemsCreateRequest } from '../types/items';

export const createItems = async (dto: ItemsCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/items`, dto);
    return response.data;
};

export const updateItems = async (id: number, dto: ItemsCreateRequest): Promise<Items> => {
    const response = await api.put<Items>(`/items/${id}`, dto);
    return response.data;
};

export const getItemsList = async (productName?: string): Promise<Items[]> => {
    const response = await api.get<Items[]>('/items', {
        params: { productName },
    });
    return response.data;
};