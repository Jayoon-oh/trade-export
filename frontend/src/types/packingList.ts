export interface PackingListCreateRequest {
    shipmentId: number;
    packingDate: string;
    totalAmount: number;
    totalWeight: number;
    comment?: string;
    items: PackingListItemRequest[];
}

export interface PagedPackingLists {
    content: PackingListResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface PackingListItemRequest {
    itemsId: number;
    quantity: number;
    actualWeight: number;
}

export interface PackingListItemLine {
    itemsId: number;
    itemName: string;
    actualWeight: number;
    amount: number;
    quantity: number;
}

export interface PackingListPdfData {
    packingListNumber: string;
    packingListDate: string;
    totalAmount: number;
    totalWeight: number;
    sellerName: string;
    sellerAddress: string;
    sellerRegistrationNumber: string;
    sellerOwnerName: string;
    sellerLogoPath: string;
    sellerSignaturePath: string;
    buyerName: string;
    buyerAddress: string;
    buyerRegistrationNumber: string;
    items: PackingListItemLine[];
}

export interface PackingListResponse {
    id: number
    shipmentId: number;
    buyerId: number;
    buyerName: string;
    forwarderId: number;
    forwarderName: string;
    packingDate: string;
    totalAmount: number;
    totalWeight: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PackingListDetailResponse {
    packingList: PackingListResponse;
    items: PackingListItemLine[];
}