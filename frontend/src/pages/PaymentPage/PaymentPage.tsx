import { getPaymentDetail, getPayments, getPaymentStatusHistory, updatePayment } from "../../api/paymentApi";
import type { PaymentStatus, PaymentResponse, PaymentDetail, PaymentStatusHistory } from "../../types/payment";
import { useEffect, useState } from "react";
import type { Company } from "../../types/company";
import { getCompanyList } from "../../api/companyApi";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";
import PaymentCreateCard from "./components/PaymentCreateCard";
import PaymentDetailPanel from "./components/PaymentDetailPanel";
import PaymentStatusHistoryPanel from "./components/PaymentStatusHistoryPanel";
import formatDateOnly from "../../utils/formatDateOnly";
import { Clock } from "lucide-react";

function PaymentPage() {
    const [paymentList, setPaymentList] = useState<PaymentResponse[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [status, setStatus] = useState<PaymentStatus>();

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isCardOpen, setIsCardOpen] = useState(false);
    // reset card
    const [cardKey, setCardKey] = useState(0);

    // payment detail
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);

    const [invoiceNumberSearch, setInvoiceNumberSearch] = useState('');

    // history per payment status
    const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);
    const [statusHistory, setStatusHistory] = useState<PaymentStatusHistory[]>([]);


    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchPaymentList();
    }, [buyerId, status, currentPage]);

    const fetchPaymentList = async () => {
        const data = await getPayments(buyerId || undefined, status || undefined, invoiceNumberSearch || undefined, currentPage);
        setPaymentList(data.content);
        setTotalPages(data.totalPages);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data.content);
    }

    const handleStatusChange = async (paymentId: number, newStatus: PaymentStatus) => {
        const isIrreversible = newStatus === 'COMPLETED' || newStatus === 'CANCELLED';
        const confirmMessage = isIrreversible
            ? `${newStatus}(으)로 변경하면 다시 되돌릴 수 없습니다. 계속하시겠습니까?`
            : `상태를 ${newStatus}(으)로 변경하시겠습니까?`;

        if (!confirm(confirmMessage)) return;

        try {
            await updatePayment(paymentId, newStatus);
            fetchPaymentList();

            if (selectedInvoiceId === paymentId) {
                const data = await getPaymentDetail(selectedInvoiceId);
                setPaymentDetail(data);
            }

            if (expandedHistoryId === paymentId) {
                const historyData = await getPaymentStatusHistory(paymentId);
                setStatusHistory(historyData);
            }
        } catch (error: any) {
            const message = error.response?.data || '상태 변경에 실패했습니다.';
            alert(message);
            fetchPaymentList;
        }
    }

    // constraint changing status
    const getAvailableStatuses = (currentStatus: string) => {
        if (currentStatus === 'COMPLETED') return ['COMPLETED'];
        if (currentStatus === 'CANCELLED') return ['CANCELLED'];
        return ['PENDING', 'COMPLETED', 'CANCELLED'];
    };

    const handleOpenNew = () => {
        setSelectedInvoiceId(null);
        setPaymentDetail(null);
        setExpandedHistoryId(null);
        setCardKey(prev => prev + 1);
        setIsCardOpen(true);
    }

    const handleViewDetail = async (invoiceId: number) => {
        if (selectedInvoiceId === invoiceId) {
            setSelectedInvoiceId(null);
            setPaymentDetail(null);
            return;
        }
        // close, when register card is open.
        setIsCardOpen(false);
        setExpandedHistoryId(null);
        const data = await getPaymentDetail(invoiceId);
        setPaymentDetail(data);
        setSelectedInvoiceId(invoiceId);
    };

    const handleToggleHistory = async (paymentId: number) => {
        if (expandedHistoryId === paymentId) {
            setExpandedHistoryId(null);
            return;
        }
        setIsCardOpen(false);
        setSelectedInvoiceId(null);
        setPaymentDetail(null);
        const data = await getPaymentStatusHistory(paymentId);
        setStatusHistory(data);
        setExpandedHistoryId(paymentId);
    };

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">결제 관리</h1>

            {/* filter */}
            <div className="flex gap-2 mb-8">
                <input
                    value={invoiceNumberSearch}
                    onChange={(e) => setInvoiceNumberSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchPaymentList(); }}
                    placeholder="인보이스번호 검색"
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <button onClick={fetchPaymentList} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    검색
                </button>
                <EntitySelect
                    value={buyerId}
                    onChange={setBuyerId}
                    options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체 바이어"
                />
                <StatusSelect
                    value={status ?? ''}
                    onChange={(s) => setStatus(s as PaymentStatus || undefined)}
                    options={['PENDING', 'COMPLETED', 'CANCELLED']}
                    placeholder="전체 상태"
                />
                <button onClick={handleOpenNew} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                    + 신규 등록
                </button>
            </div>

            {/* list */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3 whitespace-nowrap">바이어</th>
                                <th className="px-4 py-3 whitespace-nowrap">인보이스번호</th>
                                <th className="px-4 py-3">금액</th>
                                <th className="px-4 py-3">상태</th>
                                <th className="px-4 py-3 whitespace-nowrap">상태이력</th>
                                <th className="px-4 py-3 whitespace-nowrap">등록일</th>
                                <th className="px-4 py-3 whitespace-nowrap">결제일</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        결제 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                paymentList.map((p) => (
                                    <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">{p.buyerName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{p.invoiceNumber}</td>
                                        <td className="px-4 py-3">{p.amount.toLocaleString()} ({p.currency})</td>
                                        <td className="px-4 py-3">
                                            <StatusSelect
                                                value={p.status}
                                                onChange={(s) => handleStatusChange(p.id, s as PaymentStatus)}
                                                options={getAvailableStatuses(p.status)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggleHistory(p.id)} aria-label="이력 보기">
                                                <Clock size={18} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatDateOnly(p.createdAt)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatDateOnly(p.paymentDate)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button onClick={() => handleViewDetail(p.invoiceId)} className="text-blue-900 hover:underline text-sm">
                                                {selectedInvoiceId === p.invoiceId ? '접기' : '상세보기'}
                                            </button>
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

                {/* register form */}
                {isCardOpen && (
                    <PaymentCreateCard
                        key={cardKey}
                        onSuccess={() => { setIsCardOpen(false); fetchPaymentList(); }}
                        onCancel={() => setIsCardOpen(false)}
                    />
                )}
                {paymentDetail && (
                    <div className="w-1/3 border-l border-gray-200 min-h-screen p-6 bg-white flex-shrink-0">
                        <PaymentDetailPanel detail={paymentDetail} onClose={() => { setSelectedInvoiceId(null); setPaymentDetail(null); }} />
                    </div>
                )}
                {expandedHistoryId && (
                    <div className="w-1/3 border-l border-gray-200 min-h-screen p-6 bg-white flex-shrink-0">
                        <PaymentStatusHistoryPanel history={statusHistory} onClose={() => setExpandedHistoryId(null)} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentPage;