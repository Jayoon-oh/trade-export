import api from './axiosInstance';
import type {
    PagedQuotations,
    Quotation,
    QuotationCreateRequest,
    QuotationDetailResponse
} from '../types/quotation';

export const createQuotation = async (dto: QuotationCreateRequest): Promise<number> => {
    const response = await api.post<number>('/quotations', dto);
    return response.data;
};

export const getQuotationList = async (buyerId?: number, page: number = 0, size: number = 10): Promise<PagedQuotations> => {
    const response = await api.get<PagedQuotations>('/quotations', {
        params: { buyerId, page, size },
    });
    return response.data;
};


export const getQuotation = async (id: number): Promise<QuotationDetailResponse> => {
    const response = await api.get<QuotationDetailResponse>(`/quotations/${id}`);
    return response.data;
};

export const updateQuotation = async (id: number, dto: QuotationCreateRequest): Promise<Quotation> => {
    const response = await api.put<Quotation>(`/quotations/${id}`, dto);
    return response.data;
};

export const deleteQuotation = async (id: number): Promise<void> => {
    await api.delete(`/quotations/${id}`);
};