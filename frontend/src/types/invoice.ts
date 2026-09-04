export interface InvoiceItemLine {
    itemName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface InvoiceCreateRequest {
    exchangeRate: number;
}

export interface InvoicePdfData {
    invoiceNumber: number;
    invoiceDate: string;
    currency: string;
    exchangeRate: number;
    totalAmount: number;
    sellerName: string;
    sellerAddress: string;
    sellerRegistrationNumber: string;
    sellerOwnerName: string;
    sellerLogoPath: string;
    sellerSignaturePath: string;
    buyerName: string;
    buyerAddress: string;
    buyerRegistrationNumber: string;
    items: InvoiceItemLine[];
}

export type InvoiceStatus = 'ISSUED' | 'CANCELLED' | 'PAID';

export interface InvoiceResponse {
    id: number;
    ordersId: number;
    invoiceNumber: string;
    invoiceDate: string;
    status: InvoiceStatus;
    totalAmount: number;
    exchangeRate: number;
    currency: string;
    orderNumber: string;
}