import { useState, useEffect } from 'react';
import { getAllCompanies } from '../../../api/companyApi';
import { getShipmentsList } from '../../../api/shipmentApi';
import { getAvailableItems } from '../../../api/packingListApi';
import type { Company } from '../../../types/company';
import type { Shipment } from '../../../types/shipment';

interface ShipmentSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (shipmentId: number, label: string) => void;
}

function ShipmentSelectModal({ isOpen, onClose, onSelect }: ShipmentSelectModalProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedBuyerId, setSelectedBuyerId] = useState(0);
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [expandedShipmentId, setExpandedShipmentId] = useState<number | null>(null);
    const [expandedItems, setExpandedItems] = useState<{ itemName: string; orderedQuantity: number }[]>([]);

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
        setExpandedShipmentId(null);
        if (buyerId) {
            const data = await getShipmentsList(buyerId);
            setShipments(data.content);
        } else {
            setShipments([]);
        }
    };

    const handleToggleDetail = async (shipmentId: number) => {
        if (expandedShipmentId === shipmentId) {
            setExpandedShipmentId(null);
            return;
        }
        const items = await getAvailableItems(shipmentId);
        setExpandedItems(items.map(item => ({ itemName: item.itemName, orderedQuantity: item.orderedQuantity })));
        setExpandedShipmentId(shipmentId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">선적 선택</h3>

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
                                <th className="px-4 py-2">포워더</th>
                                <th className="px-4 py-2">선적일</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400 text-sm">
                                        이 바이어의 선적이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                shipments.map((s) => (
                                    <>
                                        <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                {s.orderNumber}
                                                {s.shipmentSequence > 1 && <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded ml-1">({s.shipmentSequence}차)</span>}
                                            </td>
                                            <td className="px-4 py-2">{s.forwarderName}</td>
                                            <td className="px-4 py-2">{s.shipmentDate}</td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <button
                                                    onClick={() => handleToggleDetail(s.id)}
                                                    className="text-gray-600 hover:underline text-sm"
                                                >
                                                    {expandedShipmentId === s.id ? '접기' : '상세보기'}
                                                </button>
                                                <button
                                                    onClick={() => onSelect(s.id, `#${s.orderNumber}${s.shipmentSequence > 1 ? ` (${s.shipmentSequence}차)` : ''} - ${s.buyerName}`)}
                                                    className="text-blue-900 hover:underline text-sm"
                                                >
                                                    선택
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedShipmentId === s.id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={4} className="px-4 py-3">
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {expandedItems.map((item, idx) => (
                                                            <li key={idx}>{item.itemName} × {item.orderedQuantity}</li>
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

export default ShipmentSelectModal;