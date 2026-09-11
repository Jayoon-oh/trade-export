import { getPayments, updatePayment } from "../../api/paymentApi";
import type { PaymentStatus, PaymentResponse } from "../../types/payment";
import { useEffect, useState } from "react";
import type { Company } from "../../types/company";
import { getCompanyList } from "../../api/companyApi";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";
import formatDate from "../../utils/formatDate";
import PaymentQuickEditCard from "./components/PaymentQuickEditCard";

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

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchPaymentList();
    }, [buyerId, status, currentPage]);

    const fetchPaymentList = async () => {
        const data = await getPayments(buyerId || undefined, status || undefined, currentPage);
        setPaymentList(data.content);
        setTotalPages(data.totalPages);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data.content);
    }

    const handleStatusChange = async (paymentId: number, newStatus: PaymentStatus) => {
        if (!confirm(`상태를 ${newStatus}로 변경하시겠습니끼?`)) return;
        await updatePayment(paymentId, newStatus);
        fetchPaymentList();
    }

    const handleOpenNew = () => {
        setCardKey(prev => prev + 1);
        setIsCardOpen(true);
    }

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">결제 관리</h1>

            {/* filter */}
            <div className="flex gap-2 mb-8">
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
                                <th className="px-4 py-3">바이어</th>
                                <th className="px-4 py-3">인보이스번호</th>
                                <th className="px-4 py-3">금액</th>
                                <th className="px-4 py-3">결제일</th>
                                <th className="px-4 py-3">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        결제 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                paymentList.map((p) => (
                                    <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{p.buyerName}</td>
                                        <td className="px-4 py-3">{p.invoiceNumber}</td>
                                        <td className="px-4 py-3">{p.amount}</td>
                                        <td className="px-4 py-3">{formatDate(p.paymentDate)}</td>
                                        <td className="px-4 py-3">
                                            <StatusSelect
                                                value={p.status}
                                                onChange={(s) => handleStatusChange(p.id, s as PaymentStatus)}
                                                options={['PENDING', 'COMPLETED', 'CANCELLED']}
                                            />
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
                    <PaymentQuickEditCard
                        key={cardKey}
                        onSuccess={() => { setIsCardOpen(false); fetchPaymentList(); }}
                        onCancel={() => setIsCardOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default PaymentPage;