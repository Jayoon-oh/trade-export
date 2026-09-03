export interface PaymentCreateRequest {
    invoiceId: number;
    amount: number;
    paymentDate: string;
}

export interface PagedPayments {
    content: PaymentResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface PaymentResponse {
    id: number;
    invoiceId: number;
    invoiceNumber: string;
    buyerId: number;
    buyerName: string;
    amount: number;
    paymentDate: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceBalance {
    invoiceId: number;
    totalAmount: number;
    totalPaid: number;
    remaining: number;
}