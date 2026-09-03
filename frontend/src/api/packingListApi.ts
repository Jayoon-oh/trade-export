import api from "./axiosInstance";
import type { PackingListCreateRequest, PackingListResponse, PackingListItemLine, PackingListDetailResponse, PagedPackingLists } from "../types/packingList";

export const generatePackingListPdf = async (packingListId: number): Promise<Blob> => {
    const response = await api.post(`/packing-lists/${packingListId}/pdf`, null, {
        responseType: 'blob'
    });
    return response.data;
}

// generate Link for download PDF
export const handleGeneratePackingList = async (packingListId: number) => {
    const blob = await generatePackingListPdf(packingListId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'packingList.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
}

export const createPackingList = async (dto: PackingListCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/packing-lists`, dto);
    return response.data;
}

export const getPackingLists = async (buyerId?: number, page: number = 0, size: number = 10): Promise<PagedPackingLists> => {
    const response = await api.get<PagedPackingLists>('/packing-lists', {
        params: { buyerId, page, size },
    });
    return response.data;
};

export const getPackingList = async (id: number): Promise<PackingListDetailResponse> => {
    const response = await api.get<PackingListDetailResponse>(`/packing-lists/${id}`);
    return response.data;
};

export const updatePackingList = async (id: number, dto: PackingListCreateRequest): Promise<PackingListResponse> => {
    const response = await api.put<PackingListResponse>(`/packing-lists/${id}`, dto);
    return response.data;
};

export const deletePackingList = async (id: number): Promise<void> => {
    await api.delete(`/packing-lists/${id}`);
};