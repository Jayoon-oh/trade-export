import { getShipmentsList, updateShipmentStatus } from "../../api/shipmentApi";
import { getAllCompanies } from "../../api/companyApi";
import type { Company } from "../../types/company";
import type { Shipment, ShipmentStatus } from "../../types/shipment";
import { useState, useEffect } from "react";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";
import ShipmentQuickEditCard from "./components/ShipmentQuickEditCard";

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

    useEffect(() => {
        fetchCompanies();
    }, [])

    useEffect(() => {
        fetchShipments();
    }, [buyerId, forwarderId, shipmentStatus, currentPage]);

    const fetchShipments = async () => {
        const data = await getShipmentsList(buyerId || undefined, forwarderId || undefined, shipmentStatus || undefined, currentPage);
        setShipmentList(data.content);
        setTotalPages(data.totalPages)
    }

    const fetchCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    }

    const handleStatusChange = async (shipmentId: number, newStatus: ShipmentStatus) => {
        if (!confirm(`상태를 ${newStatus}(으)로 변경하시겠습니까?`)) return;
        await updateShipmentStatus(shipmentId, newStatus);
        fetchShipments();
    };

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">선적 관리</h2>

            {/* filter */}
            <div className="flex gap-2 mb-8">
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
                <button onClick={() => { setEditingShipmentId(null); setIsCardOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                    + 신규 등록
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    {/* list */}
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">오더 ID</th>
                                <th className="px-4 py-3">바이어</th>
                                <th className="px-4 py-3">포워더</th>
                                <th className="px-4 py-3">운임</th>
                                <th className="px-4 py-3">상태</th>
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
                                        <td className="px-4 py-3">{s.orderNumber}</td>
                                        <td className="px-4 py-3">{s.buyerName}</td>
                                        <td className="px-4 py-3">{s.forwarderName}</td>
                                        <td className="px-4 py-3">{s.fee}</td>
                                        <td className="px-4 py-3">
                                            <StatusSelect
                                                value={s.status}
                                                onChange={(status) => handleStatusChange(s.id, status as ShipmentStatus)}
                                                options={['PLANNED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']}
                                            />
                                        </td>
                                        <td className="px-4 py-3">{s.shipmentDate}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => { setEditingShipmentId(s.id); setIsCardOpen(true); }} className="text-blue-900 hover:underline">수정</button>
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
            </div>
        </div>
    );

}

export default ShipmentPage;