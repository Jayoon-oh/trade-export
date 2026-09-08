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
    nextAction: boolean;
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
