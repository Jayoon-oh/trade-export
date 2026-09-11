import { deletePackingList, getPackingLists, handleGeneratePackingList, updatePackingList } from "../../api/packingListApi"
import type { Company } from "../../types/company"
import { getAllCompanies } from "../../api/companyApi";
import { useState, useEffect } from "react"
import type { PackingListResponse } from "../../types/packingList";
import EntitySelect from "../../components/EntitySelect";
import formatDate from "../../utils/formatDate";
import PackingListCreateForm from "./components/PackingListCreateForm";
import PackingListEditForm from "./components/PackingListEditForm";

function PackingListPage() {
    const [packingList, setPackingList] = useState<PackingListResponse[]>([]);
    const [buyerId, setBuyerId] = useState(0);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [companies, setCompanies] = useState<Company[]>([]);

    const [view, setView] = useState<'list' | 'new' | 'edit'>('list');

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchPackingLists();
    }, [buyerId, currentPage]);

    const fetchPackingLists = async () => {
        const data = await getPackingLists(buyerId || undefined, currentPage);
        setPackingList(data.content);
        setTotalPages(data.totalPages);
    }

    const fetchCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    }

    const handleDelete = async (id: number) => {
        await deletePackingList(id);
        fetchPackingLists();
    };

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">패킹리스트 등록</h1>

            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
                <button onClick={() => setView('list')} className={view === 'list' ? 'font-semibold text-blue-900' : 'text-gray-500'}>목록</button>
                <button onClick={() => setView('new')} className={view === 'new' ? 'font-semibold text-blue-900' : 'text-gray-500'}>신규 등록</button>
            </div>

            {view === 'list' && (
                <>
                    <div className="flex gap-2 mb-8">
                        <EntitySelect
                            value={buyerId}
                            onChange={setBuyerId}
                            options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                            placeholder="전체 바이어"
                        />
                        <button onClick={fetchPackingLists} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            검색
                        </button>
                    </div>

                    {/* Table */}
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">오더 ID</th>
                                <th className="px-4 py-3">회사명</th>
                                <th className="px-4 py-3">운송사</th>
                                <th className="px-4 py-3">포장날짜</th>
                                <th className="px-4 py-3">총수량</th>
                                <th className="px-4 py-3">총무게</th>
                                <th className="px-4 py-3">등록날짜</th>
                                <th className="px-4 py-3">수정날짜</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {packingList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        패킹 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                packingList.map((packingList) => (
                                    <tr key={packingList.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{packingList.orderNumber}</td>
                                        <td className="px-4 py-3">{packingList.buyerName}</td>
                                        <td className="px-4 py-3">{packingList.forwarderName}</td>
                                        <td className="px-4 py-3">{packingList.packingDate}</td>
                                        <td className="px-4 py-3">{packingList.totalAmount}</td>
                                        <td className="px-4 py-3">{packingList.totalWeight}</td>
                                        <td className="px-4 py-3">{formatDate(packingList.createdAt)}</td>
                                        <td className="px-4 py-3">{formatDate(packingList.updatedAt)}</td>
                                        <td className="px-4 py-3 flex gap-2 flex-wrap">
                                            <button onClick={() => { setEditingId(packingList.id); setView('edit'); }} className="text-blue-900 hover:underline">수정</button>
                                            <button onClick={() => handleDelete(packingList.id)} className="text-red-600 hover:underline">삭제</button>
                                            <button onClick={() => handleGeneratePackingList(packingList.id)} className="text-gray-600 hover:underline">다운로드</button>
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
                </>
            )}

            {view === 'new' && (
                <PackingListCreateForm onSuccess={() => { setView('list'); fetchPackingLists(); }} />
            )}

            {view === 'edit' && editingId && (
                <PackingListEditForm packingListId={editingId} onSuccess={() => { setView('list'); fetchPackingLists(); }} />
            )}
        </div>
    )
}

export default PackingListPage;