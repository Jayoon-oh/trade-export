export interface PagedStock {
    content: Stock[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface Stock {
    id: number;
    productName: string;
    quantity: number;
    reservedQuantity: number;
}