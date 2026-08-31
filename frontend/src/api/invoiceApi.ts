import api from './axiosInstance';
import type { InvoiceCreateRequest, InvoiceResponse, InvoiceStatus } from "../types/invoice";


export const generateInvoicePdf = async (invoiceId: number): Promise<Blob> => {
    const response = await api.post(`/invoices/${invoiceId}/pdf`, null, {
        responseType: 'blob'
    });
    return response.data;
}

// generate link for download PDF 
export const handleGenerateInvoice = async (orderId: number) => {
    const blob = await generateInvoicePdf(orderId);
    const url = window.URL.createObjectURL(blob); // temperary URL link for download
    const link = document.createElement('a'); // generate link <a> tag
    link.href = url;
    link.download = 'invoice.pdf'; // download pdf, if click link
    link.click(); // click the link (instead of user)
    window.URL.revokeObjectURL(url); // revoke memory -> preventing memory leak 
}

export const issueInvoice = async (id: number, dto: InvoiceCreateRequest): Promise<number> => {
    const response = await api.post<number>(`/orders/${id}/invoices`, dto);
    return response.data;
};

export const getInvoiceList = async (id: number): Promise<InvoiceResponse[]> => {
    const response = await api.get<InvoiceResponse[]>(`/orders/${id}/invoices`);
    return response.data;
};

export const cancelInvoice = async (invoiceId: number): Promise<InvoiceResponse> => {
    const response = await api.patch<InvoiceResponse>(`/orders/${invoiceId}/cancel`);
    return response.data;
};

export const getInvoicesByStatus = async (status: InvoiceStatus): Promise<InvoiceResponse[]> => {
    const response = await api.get<InvoiceResponse[]>(`/invoices`, {
        params: { status },
    });
    return response.data;
}