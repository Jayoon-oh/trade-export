import { getQuotationList, deleteQuotation, handleGenerateQuotation } from "../../api/quotationApi";
import { getCompanyList } from "../../api/companyApi";
import type { Quotation } from "../../types/quotation";
import type { Company } from "../../types/company";
import { useState, useEffect } from "react";
import EntitySelect from "../../components/EntitySelect";
import formatDate from "../../utils/formatDate";
import QuotationCreateForm from "./components/QuotationCreateFom";
import QuotationEditForm from "./components/QuotationEditForm";

function QuotationPage() {
    const [quotationList, setQuotationList] = useState<Quotation[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [view, setView] = useState<'list' | 'new' | 'edit'>('list');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchQuotation();
    }, [buyerId, currentPage]);

    const fetchQuotation = async () => {
        const data = await getQuotationList(buyerId || undefined, currentPage);
        setQuotationList(data.content);
        setTotalPages(data.totalPages);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data.content);
    }

    const handleDelete = async (id: number) => {
        try {
            if (!id) {
                alert('견적id를 선택해주세요.');
            }
            await deleteQuotation(id);
            fetchQuotation();
        }
        catch (error: any) {
            const message = error.response?.data || '견적서 삭제에 실패했습니다.';
            alert(message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">견적 조회</h1>

            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
                <button onClick={() => setView('list')} className={view === 'list' ? 'font-semibold text-blue-900' : 'text-gray-500'}>목록</button>
                <button onClick={() => setView('new')} className={view === 'new' ? 'font-semibold text-blue-900' : 'text-gray-500'}>신규 등록</button>
            </div>

            {view === 'list' && (
                <>
                    <div className="mb-8">
                        <EntitySelect
                            value={buyerId}
                            onChange={setBuyerId}
                            options={companies.map(c => ({ id: c.id, label: c.companyName }))}
                            placeholder="전체"
                        />
                    </div>

                    {/* Table */}
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">바이어명</th>
                                <th className="px-4 py-3">금액</th>
                                <th className="px-4 py-3">통화</th>
                                <th className="px-4 py-3">등록일</th>
                                <th className="px-4 py-3">특이사항</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotationList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        견적 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                quotationList.map((quotation) => (
                                    <tr key={quotation.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{quotation.id}</td>
                                        <td className="px-4 py-3">{quotation.companyName}</td>
                                        <td className="px-4 py-3">{quotation.totalAmount}</td>
                                        <td className="px-4 py-3">{quotation.currency}</td>
                                        <td className="px-4 py-3">{formatDate(quotation.quotationDate)}</td>
                                        <td className="px-4 py-3">{quotation.comment || '-'}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button onClick={() => { setEditingId(quotation.id); setView('edit'); }} className="text-blue-900 hover:underline">수정</button>
                                            <button onClick={() => handleDelete(quotation.id)} className="text-red-600 hover:underline">삭제</button>
                                            <button onClick={() => handleGenerateQuotation(quotation.id)} className="text-gray-600 hover:underline">PDF 다운로드</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* pagination */}
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
                <QuotationCreateForm onSuccess={() => { setView('list'); fetchQuotation(); }} />
            )}

            {view === 'edit' && editingId && (
                <QuotationEditForm quotationId={editingId} onSuccess={() => { setView('edit'); fetchQuotation(); }} />
            )}
        </div>
    )
}

export default QuotationPage;