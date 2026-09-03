export interface Quotation {
    id: number;
    companyId: number;
    companyName: string;
    quotationDate: string;
    totalAmount: number;
    currency: string;
    incoterms: string;
    paymentTerm: string;
    comment?: string;
}

export interface PagedQuotations {
    content: Quotation[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface QuotationItemLine {
    itemsId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface QuotationDetailResponse {
    quotation: Quotation;
    items: QuotationItemLine[];
}

export interface QuotationItemRequest {
    itemsId: number;
    quantity: number;
}

export interface QuotationCreateRequest {
    companyId: number;
    currency: string;
    incoterms: string;
    paymentTerm: string;
    comment?: string;
    quotationDate: string;
    items: QuotationItemRequest[];
}