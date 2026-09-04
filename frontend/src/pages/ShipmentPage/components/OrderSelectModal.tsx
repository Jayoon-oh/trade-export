import { useState, useEffect } from "react";
import { getAllCompanies } from "../../../api/companyApi";
import { getOrdersList, getOrder } from "../../../api/ordersApi";
import type { Company } from "../../../types/company";
import type { Orders } from "../../../types/orders";

interface OrderSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (orderId: number) => void;
}

function OrderSelectModal({ isOpen, onClose, onSelect }: OrderSelectModalProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedBuyerId, setSelectedBuyerId] = useState(0);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [expandedItems, setExpandedItems] = useState<{ itemName: string; quantity: number }[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
        }
    }, [isOpen]);

    const fetchCompanies = async () => {
        const data = await getAllCompanies('BUYER');
        setCompanies(data);
    };

    const handleSelectBuyer = async (buyerId: number) => {
        setSelectedBuyerId(buyerId);
        setExpandedOrderId(null);
        if (buyerId) {
            const data = await getOrdersList(buyerId);
            setOrders(data.content);
        } else {
            setOrders([]);
        }
    };

    const handleToggleDetail = async (orderId: number) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
            return;
        }
        const detail = await getOrder(orderId);
        setExpandedItems(detail.items.map(item => ({ itemName: item.itemName, quantity: item.quantity })));
        setExpandedOrderId(orderId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">오더 선택</h3>

                <select
                    value={selectedBuyerId}
                    onChange={(e) => handleSelectBuyer(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                >
                    <option value={0}>바이어를 먼저 선택하세요</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                </select>

                {selectedBuyerId > 0 && (
                    <table className="w-full border-collapse mb-4">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-2">오더번호</th>
                                <th className="px-4 py-2">금액</th>
                                <th className="px-4 py-2">주문일</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400 text-sm">
                                        이 바이어의 오더가 없습니다
                                    </td>
                                </tr>
                            ) : (
                                orders.map((o) => (
                                    <>
                                        <tr key={o.id} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-2">{o.orderNumber}</td>
                                            <td className="px-4 py-2">{o.amount}</td>
                                            <td className="px-4 py-2">{o.ordersDate}</td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <button
                                                    onClick={() => handleToggleDetail(o.id)}
                                                    className="text-gray-600 hover:underline text-sm"
                                                >
                                                    {expandedOrderId === o.id ? '접기' : '상세보기'}
                                                </button>
                                                <button
                                                    onClick={() => onSelect(o.id)}
                                                    className="text-blue-900 hover:underline text-sm"
                                                >
                                                    선택
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedOrderId === o.id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={4} className="px-4 py-3">
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {expandedItems.map((item, idx) => (
                                                            <li key={idx}>{item.itemName} × {item.quantity}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    닫기
                </button>
            </div>
        </div>
    );
}

export default OrderSelectModal;