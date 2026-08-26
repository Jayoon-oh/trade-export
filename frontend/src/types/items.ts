export interface Items {
    id: number;
    productName: string;
    price: number;
    setQty: number;
    standardWeight: number;
}

export interface ItemsCreateRequest {
    productName: string;
    price: number;
    setQty: number;
    standardWeight: number;
}