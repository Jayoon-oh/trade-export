import { useState, useEffect } from "react";
import { getMyOrderPipeline, getPipelineFunnel } from "../../api/dashboardApi";
import type { PipelineFunnel, OrderPipeline } from "../../types/dashboard";
import FunnelCard from "./components/FunnelCard";

function DashboardPage() {
    const [orders, setOrders] = useState<OrderPipeline[]>([]);
    const [funnel, setFunnel] = useState<PipelineFunnel | null>(null);

    useEffect(() => {
        fetchPipeline();
        fetchFunnel();
    }, []);

    const fetchPipeline = async () => {
        const data = await getMyOrderPipeline();
        setOrders(data);
    };

    const fetchFunnel = async () => {
        const data = await getPipelineFunnel();
        setFunnel(data);
    }

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Order Pipeline</h1>

            {funnel && (
                <div className="grid grid-cols-5 gap-3 mb-8">
                    <FunnelCard label="견적" count={funnel.quotationCount} amount={funnel.quotationAmount} />
                    <FunnelCard label="오더" count={funnel.ordersCount} amount={funnel.ordersAmount} />
                    <FunnelCard label="인보이스" count={funnel.invoiceCount} amount={funnel.invoiceAmount} />
                    <FunnelCard label="배송" count={funnel.shipmentCount} />
                    <FunnelCard label="결제" count={funnel.paymentCount} amount={funnel.paymentAmount} />
                </div>
            )}
            <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-600">
                        <th className="px-4 py-3">오더번호</th>
                        <th className="px-4 py-3">바이어명</th>
                        <th className="px-4 py-3">금액</th>
                        <th className="px-4 py-3">파이프라인 상태</th>
                        <th className="px-4 py-3">다음 액션</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{order.orderNumber}</td>
                            <td className="px-4 py-3">{order.buyerName}</td>
                            <td className="px-4 py-3">{order.amount.toLocaleString()}</td>
                            <td className="px-4 py-3">
                                <div className="flex gap-1">
                                    <span className={order.hasQuotation ? 'text-green-600' : 'text-gray-300'}>●</span>
                                    <span className={order.hasInvoice ? 'text-green-600' : 'text-gray-300'}>●</span>
                                    <span className={order.hasPackingList ? "text-green-600" : 'text-gray-300'}>●</span>
                                    <span className={order.hasShipment ? 'text-green-600' : 'text-gray-300'}>●</span>
                                    <span className={order.isFullyPaid ? 'text-green-600' : 'text-gray-300'}>●</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">{order.nextAction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}

export default DashboardPage;