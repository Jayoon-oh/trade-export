export interface OrderPipeline {
    orderId: number;
    orderNumber: string;
    buyerName: string;
    amount: number;
    hasQuotation: boolean;
    hasInvoice: boolean;
    hasShipment: boolean;
    hasPackingList: boolean;
    isFullyPaid: boolean;
    nextAction: string;
}

export interface PipelineFunnel {
    quotationCount: number;
    quotationAmount: number;
    ordersCount: number;
    ordersAmount: number;
    invoiceCount: number;
    invoiceAmount: number;
    shipmentCount: number;
    paymentCount: number;
    paymentAmount: number;
}

export interface PaymentRecord {
    paymentDate: string;
    amount: number;
}

export interface OrderDetail {
    orderId: number;
    orderNumber: string;
    buyerName: string;
    amount: number;
    invoiceNumber: string | null;
    invoiceDate: string | null;
    invoiceAmount: number;
    exchangeRate: number | null;
    totalPaid: number;
    remaining: number;
    payments: PaymentRecord[];
}
