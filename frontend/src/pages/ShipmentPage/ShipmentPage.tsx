import { getShipmentsList, getShipmentStatusHistory, updateShipmentStatus } from "../../api/shipmentApi";
import { getAllCompanies } from "../../api/companyApi";
import type { Company } from "../../types/company";
import type { Shipment, ShipmentStatus, ShipmentStatusHistory } from "../../types/shipment";
import { useState, useEffect } from "react";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";
import ShipmentQuickEditCard from "./components/ShipmentQuickEditCard";
import ShipmentStatusHistoryPanel from "./components/ShipmentStatusHistory";
import { Clock } from "lucide-react";

function ShipmentPage() {
    const [shipmentList, setShipmentList] = useState<Shipment[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [forwarderId, setForwarderId] = useState(0);
    const [shipmentStatus, setShipmentStatus] = useState<ShipmentStatus>();
    const [companies, setCompanies] = useState<Company[]>([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // selecting company
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [editingShipmentId, setEditingShipmentId] = useState<number | null>(null);

    const [orderNumberSearch, setOrderNumberSearch] = useState('');

    // history of shipment status
    const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);
    const [statusHistory, setStatusHistory] = useState<ShipmentStatusHistory[]>([]);

    useEffect(() => {
        fetchCompanies();
    }, [])

    useEffect(() => {
        fetchShipments();
    }, [buyerId, forwarderId, shipmentStatus, currentPage]);

    const fetchShipments = async () => {
        const data = await getShipmentsList(buyerId || undefined, forwarderId || undefined, shipmentStatus || undefined, orderNumberSearch || undefined, currentPage);
        setShipmentList(data.content);
        setTotalPages(data.totalPages)
    }

    const fetchCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    }

    const handleStatusChange = async (shipmentId: number, newStatus: ShipmentStatus) => {
        const isIrreversible = newStatus === 'DELIVERED' || newStatus === 'CANCELLED';
        const confirmMessage = isIrreversible
            ? `${newStatus}(으)로 변경하면 다시 되돌릴 수 없습니다. 계속하시겠습니까?`
            : `상태를 ${newStatus}(으)로 변경하시겠습니까?`;

        if (!confirm(confirmMessage)) return;

        try {
            await updateShipmentStatus(shipmentId, newStatus);
            fetchShipments();

            if (expandedHistoryId === shipmentId) {
                const historyData = await getShipmentStatusHistory(shipmentId);
                setStatusHistory(historyData);
            }
        } catch (error: any) {
            alert(error.response?.data || '상태 변경에 실패했습니다.');
            fetchShipments();
        }
    };

    // constraint changing status
    const getAvailableStatuses = (currentStatus: string) => {
        if (currentStatus === 'DELIVERED') return ['DELIVERED'];
        if (currentStatus === 'CANCELLED') return ['CANCELLED'];
        return ['PLANNED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
    };

    const handleToggleHistory = async (shipmentId: number) => {
        if (expandedHistoryId === shipmentId) {
            setExpandedHistoryId(null);
            return;
        }
        setIsCardOpen(false);
        
        const data = await getShipmentStatusHistory(shipmentId);
        setStatusHistory(data);
        setExpandedHistoryId(shipmentId);
    };

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">선적 관리</h2>

            {/* filter */}
            <div className="flex gap-2 mb-8">
                <input
                    value={orderNumberSearch}
                    onChange={(e) => setOrderNumberSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchShipments(); }}
                    placeholder="오더번호 검색"
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <button onClick={fetchShipments} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    검색
                </button>
                <EntitySelect
                    value={buyerId}
                    onChange={setBuyerId}
                    options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체 바이어"
                />
                <EntitySelect
                    value={forwarderId}
                    onChange={setForwarderId}
                    options={companies.filter(c => c.role === 'FORWARDER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체 포워더"
                />
                <StatusSelect
                    value={shipmentStatus ?? ''}
                    onChange={(status) => setShipmentStatus(status as ShipmentStatus || undefined)}
                    options={['PLANNED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']}
                    placeholder="전체 상태"
                />
                <button onClick={() => { setEditingShipmentId(null); setExpandedHistoryId(null); setIsCardOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                    + 신규 등록
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    {/* list */}
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">오더번호</th>
                                <th className="px-4 py-3">바이어</th>
                                <th className="px-4 py-3">포워더</th>
                                <th className="px-4 py-3">상태</th>
                                <th className="px-4 py-3 whitespace-nowrap">상태이력</th>
                                <th className="px-4 py-3">선적일</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipmentList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        선적 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                shipmentList.map((s) => (
                                    <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {s.orderNumber}
                                            {s.shipmentSequence > 1 && <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded ml-1">({s.shipmentSequence}차)</span>}
                                        </td>
                                        <td className="px-4 py-3">{s.buyerName}</td>
                                        <td className="px-4 py-3">{s.forwarderName}</td>
                                        <td className="px-4 py-3">
                                            <StatusSelect
                                                value={s.status}
                                                onChange={(status) => handleStatusChange(s.id, status as ShipmentStatus)}
                                                options={getAvailableStatuses(s.status)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggleHistory(s.id)} aria-label="이력 보기">
                                                <Clock size={18} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{s.shipmentDate}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => { setEditingShipmentId(s.id); setExpandedHistoryId(null); setIsCardOpen(true); }} className="text-blue-900 hover:underline">수정</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            이전
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-600">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            다음
                        </button>
                    </div>
                </div>

                {isCardOpen && (
                    <ShipmentQuickEditCard
                        key={editingShipmentId ?? 'new'}
                        shipmentId={editingShipmentId}
                        onSuccess={() => { setIsCardOpen(false); fetchShipments(); }}
                        onCancel={() => setIsCardOpen(false)}
                    />
                )}
                {expandedHistoryId && (
                    <div className="w-1/3 border-l border-gray-200 min-h-screen p-6 bg-white flex-shrink-0">
                        <ShipmentStatusHistoryPanel history={statusHistory} onClose={() => setExpandedHistoryId(null)} />
                    </div>
                )}
            </div>
        </div>
    );

}

export default ShipmentPage;