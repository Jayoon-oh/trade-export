import { useState, useEffect } from 'react';
import { getRemainingItems, issueInvoice } from '../../../api/invoiceApi';
import type { RemainingItem } from '../../../types/invoice';

interface InvoiceSplitModalProps {
    ordersId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (invoiceId: number) => void;
}

function InvoiceSplitModal({ ordersId, isOpen, onClose, onSuccess }: InvoiceSplitModalProps) {
    const [remainingItems, setRemainingItems] = useState<RemainingItem[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [exchangeRate, setExchangeRate] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchRemaining();
        }
    }, [isOpen]);

    const fetchRemaining = async () => {
        const data = await getRemainingItems(ordersId);
        setRemainingItems(data);
        const initialQuantities: Record<number, number> = {};
        data.forEach(item => {
            initialQuantities[item.itemsId] = item.remainingQuantity;
        });
        setQuantities(initialQuantities);
    };

    const handleQuantityChange = (itemsId: number, value: number) => {
        setQuantities({ ...quantities, [itemsId]: value });
    };

    const calculateTotal = () => {
        return remainingItems.reduce((sum, item) => {
            const qty = quantities[item.itemsId] || 0;
            return sum + qty * item.unitPrice;
        }, 0);
    };

    const handleConfirm = async () => {
        const rate = Number(exchangeRate);
        if (!exchangeRate || isNaN(rate) || rate <= 0) {
            alert('환율을 올바르게 입력해주세요.');
            return;
        }

        const items = remainingItems
            .map(item => ({ itemsId: item.itemsId, quantity: quantities[item.itemsId] || 0 }))
            .filter(item => item.quantity > 0);

        if (items.length === 0) {
            alert('청구할 품목 수량을 1개 이상 입력해주세요.');
            return;
        }

        for (const item of items) {
            const remaining = remainingItems.find(r => r.itemsId === item.itemsId);
            if (remaining && item.quantity > remaining.remainingQuantity) {
                alert(`${remaining.itemName}의 수량이 잔여 수량(${remaining.remainingQuantity})을 초과했습니다.`);
                return;
            }
        }

        try {
            const invoiceId = await issueInvoice(ordersId, { exchangeRate: rate, items });
            onSuccess(invoiceId);
        } catch (error: any) {
            const message = error.response?.data || '인보이스 발행에 실패했습니다.';
            alert(message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">인보이스 발행 - 품목 선택</h3>

                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm text-gray-600">
                            <th className="px-3 py-2">품목</th>
                            <th className="px-3 py-2">주문 수량</th>
                            <th className="px-3 py-2">잔여 수량</th>
                            <th className="px-3 py-2">청구 수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        {remainingItems.map((item) => (
                            <tr key={item.itemsId} className="border-t border-gray-200">
                                <td className="px-3 py-2">{item.itemName}</td>
                                <td className="px-3 py-2">{item.orderedQuantity}</td>
                                <td className="px-3 py-2">{item.remainingQuantity}</td>
                                <td className="px-3 py-2">
                                    <input
                                        type="number"
                                        value={quantities[item.itemsId] ?? 0}
                                        onChange={(e) => handleQuantityChange(item.itemsId, Number(e.target.value))}
                                        max={item.remainingQuantity}
                                        min={0}
                                        className="border border-gray-300 rounded px-2 py-1 w-24"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center gap-2 mb-4">
                    <label className="text-sm text-gray-700">환율:</label>
                    <input
                        type="number"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(e.target.value)}
                        placeholder="예: 1350"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <p className="text-right font-semibold mb-4">
                    청구 예정 금액: {calculateTotal().toLocaleString()}
                </p>

                <div className="flex gap-2">
                    <button onClick={handleConfirm} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                        확인
                    </button>
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvoiceSplitModal;