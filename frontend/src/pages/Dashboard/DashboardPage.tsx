import { useState, useEffect } from "react";
import { getMyOrderPipeline, getOrderDetail, getPipelineFunnel } from "../../api/dashboardApi";
import type { PipelineFunnel, OrderPipeline, OrderDetail } from "../../types/dashboard";
import FunnelCard from "./components/FunnelCard";
import OrderDetailPanel from "./components/OrderDetailPanel";
import { Link } from "react-router-dom";

function DashboardPage() {
    const [orders, setOrders] = useState<OrderPipeline[]>([]);
    const [funnel, setFunnel] = useState<PipelineFunnel | null>(null);

    // OrderDetail panel
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

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

    const handleViewDetail = async (orderId: number) => {
        if (selectedOrderId === orderId) {
            // close panel, when it's opened.
            setSelectedOrderId(null);
            setOrderDetail(null);
            return;
        }
        const data = await getOrderDetail(orderId);
        setOrderDetail(data);
        setSelectedOrderId(orderId)
    };

    const handleClosePanel = () => {
        setSelectedOrderId(null);
        setOrderDetail(null);
    }

    // next action of table
    const getActionUrl = (nextAction: string): string => {
        switch (nextAction) {
            case '인보이스 발행':
                return `/orders`;
            case '선적 등록':
                return `/shipments`;
            case '패킹리스트 등록':
                return `/packing-lists`;
            case '결제 기록 추가':
                return `/payments`;
            default:
                return '#';
        }
    };

    return (
        <div className="flex">
            {/* Left side: main content */}
            <div className={`p-10 transition-all duration-200 ${orderDetail ? 'w-2/3' : 'w-full'}`}>
                <div className="max-w-6xl">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Order Pipeline</h1>

                    {funnel && (
                        <div className="grid grid-cols-5 gap-3 mb-8">
                            <FunnelCard label="견적" count={funnel.quotationCount} amount={funnel.quotationAmount} />
                            <FunnelCard label="오더" count={funnel.ordersCount} amount={funnel.ordersAmount} />
                            <FunnelCard label="인보이스" count={funnel.invoiceCount} amount={funnel.invoiceAmount} />
                            <FunnelCard label="선적" count={funnel.shipmentCount} />
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
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        진행 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.orderId} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{order.orderNumber}</td>
                                        <td className="px-4 py-3">{order.buyerName}</td>
                                        <td className="px-4 py-3">{order.amount.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <span className={order.hasQuotation ? 'text-green-600' : 'text-gray-300'}>●</span>
                                                <span className={order.hasInvoice ? 'text-green-600' : 'text-gray-300'}>●</span>
                                                <span className={order.hasPackingList ? 'text-green-600' : 'text-gray-300'}>●</span>
                                                <span className={order.hasShipment ? 'text-green-600' : 'text-gray-300'}>●</span>
                                                <span className={order.isFullyPaid ? 'text-green-600' : 'text-gray-300'}>●</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.nextAction === '완료' ? (
                                                <span className="text-gray-400">완료</span>
                                            ) : (
                                                <Link to={getActionUrl(order.nextAction)} className="text-blue-900 hover:underline">
                                                    {order.nextAction}
                                                </Link>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleViewDetail(order.orderId)} className="text-blue-900 hover:underline text-sm">
                                                {selectedOrderId === order.orderId ? '접기' : '상세보기'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: detailed Panel */}
            {orderDetail && (
                <div className="w-1/3 border-l border-gray-200 min-h-screen p-6 bg-white flex-shrink-0">
                    <OrderDetailPanel detail={orderDetail} onClose={handleClosePanel} />
                </div>
            )}
        </div>
    );

}

export default DashboardPage;