import api from "./axiosInstance";
import type { PaymentResponse, PaymentCreateRequest, PaymentStatus, InvoiceBalance, PagedPayments } from "../types/payment";

export const createPayment = async (dto: PaymentCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/payments`, dto);
    return response.data;
}

export const getPayments = async (buyerId?: number, status?: string, page: number = 0, size: number = 10): Promise<PagedPayments> => {
    const response = await api.get<PagedPayments>('/payments', {
        params: { buyerId, status, page, size },
    });
    return response.data;
};

export const getPayment = async (id: number): Promise<PaymentResponse> => {
    const response = await api.get<PaymentResponse>(`/payments/${id}`);
    return response.data;
};

export const updatePayment = async (id: number, status: PaymentStatus): Promise<PaymentResponse> => {
    const response = await api.patch<PaymentResponse>(`/payments/${id}/status`, status, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const getInvoiceBalance = async (invoiceId: number): Promise<InvoiceBalance> => {
    const response = await api.get<InvoiceBalance>(`/payments/balance/${invoiceId}`)
    return response.data;
}