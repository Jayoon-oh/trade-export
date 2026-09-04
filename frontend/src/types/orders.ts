export interface Orders {
    id: number;
    buyerId: number;
    buyerName: string;
    quotationId: number;
    amount: number;
    ordersDate: string;
    comment?: string;
    createdAt: string;
    updatedAt: string;
    currency: string;
    incoterms: string;
    orderNumber: string;
    paymentTerm: string;
    hasInvoice: boolean;
}

export interface PagedOrders {
    content: Orders[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface OrdersItemLine {
    itemsId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface OrdersDetailResponse {
    orders: Orders;
    items: OrdersItemLine[];
}

export interface OrdersCreateRequest {
    buyerId: number;
    quotationId?: number;
    amount?: number;
    ordersDate: string;
    comment?: string;
    currency: string;
    incoterms: string;
    paymentTerm: string;
    items: OrdersItemRequest[];
}

export interface OrdersItemRequest {
    itemsId: number;
    quantity: number;
    price?: number;
}


