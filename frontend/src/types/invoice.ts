export interface InvoiceItemLine {
    itemName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface InvoiceCreateRequest {
    exchangeRate: number;
    items: InvoiceItemRequest[];
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

// Partial invoice
export interface RemainingItem {
    itemsId: number;
    itemName: string;
    orderedQuantity: number;
    invoicedQuantity: number;
    remainingQuantity: number;
    unitPrice: number;
}

export interface InvoiceItemRequest {
    itemsId: number;
    quantity: number;
}
