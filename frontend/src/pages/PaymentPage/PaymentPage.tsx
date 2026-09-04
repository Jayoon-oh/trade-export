import { createPayment, getInvoiceBalance, getPayments, updatePayment } from "../../api/paymentApi";
import type { PaymentStatus, PaymentCreateRequest, PaymentResponse, InvoiceBalance } from "../../types/payment";
import { useEffect, useState } from "react";
import { getInvoicesByStatus } from "../../api/invoiceApi";
import type { InvoiceResponse } from "../../types/invoice";
import type { Company } from "../../types/company";
import { getCompanyList } from "../../api/companyApi";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";
import formatDate from "../../utils/formatDate";

function PaymentPage() {
    const [paymentList, setPaymentList] = useState<PaymentResponse[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [status, setStatus] = useState<PaymentStatus>();
    const [form, setForm] = useState<PaymentCreateRequest>({
        invoiceId: 0,
        amount: 0,
        paymentDate: ''
    })
    const [invoiceList, setInvoiceList] = useState<InvoiceResponse[]>([]);
    const [balance, setBalance] = useState<InvoiceBalance | null>(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchInvoiceListByStatus();
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

    const fetchInvoiceListByStatus = async () => {
        const data = await getInvoicesByStatus('ISSUED');
        setInvoiceList(data);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data.content);
    }

    const handleSubmit = async () => {
        try {
            await createPayment(form);
            setForm({
                invoiceId: 0,
                amount: 0,
                paymentDate: ''
            });
            setBalance(null);
            fetchPaymentList();
        } catch (error) {
            alert('결제 등록에 실패했습니다. 잔액을 초과하지 않았는지 확인해주세요.');
        }
    }

    const handleStatusChange = async (paymentId: number, invoiceId: number, newStatus: PaymentStatus) => {
        if (!confirm(`상태를 ${newStatus}로 변경하시겠습니끼?`)) return;
        await updatePayment(paymentId, newStatus);
        fetchPaymentList();

        if (form.invoiceId) {
            const data = await getInvoiceBalance(invoiceId);
            setBalance(data);
        }
    }

    const handleInvoiceSelect = async (invoiceId: number) => {
        setForm({ ...form, invoiceId });
        if (invoiceId) {
            const data = await getInvoiceBalance(invoiceId);
            setBalance(data);
        } else {
            setBalance(null);
        }
    };

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
            </div>

            {/* list */}
            <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-600">
                        <th className="px-4 py-3">오더 ID</th>
                        <th className="px-4 py-3">인보이스번호</th>
                        <th className="px-4 py-3">바이어</th>
                        <th className="px-4 py-3">금액</th>
                        <th className="px-4 py-3">결제일</th>
                        <th className="px-4 py-3">상태</th>
                        <th className="px-4 py-3">등록일</th>
                        <th className="px-4 py-3">수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentList.map((p) => (
                        <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{p.orderNumber}</td>
                            <td className="px-4 py-3">{p.invoiceNumber}</td>
                            <td className="px-4 py-3">{p.buyerName}</td>
                            <td className="px-4 py-3">{p.amount}</td>
                            <td className="px-4 py-3">{formatDate(p.paymentDate)}</td>
                            <td className="px-4 py-3">
                                <StatusSelect
                                    value={p.status}
                                    onChange={(s) => handleStatusChange(p.id, p.invoiceId, s as PaymentStatus)}
                                    options={['PENDING', 'COMPLETED', 'CANCELLED']}
                                />
                            </td>
                            <td className="px-4 py-3">{formatDate(p.createdAt)}</td>
                            <td className="px-4 py-3">{formatDate(p.updatedAt)}</td>
                        </tr>
                    ))}
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

            {/* register form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">결제 등록</h2>

                <div className="mb-4">
                    <EntitySelect
                        value={form.invoiceId}
                        onChange={handleInvoiceSelect}
                        options={invoiceList.map(inv => ({ id: inv.id, label: inv.invoiceNumber }))}
                        placeholder="인보이스 선택"
                    />
                </div>

                {balance && (
                    <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3 mb-4 text-sm text-gray-700">
                        인보이스 총액: <span className="font-semibold">{balance.totalAmount}</span>
                        {' / '}결제완료: <span className="font-semibold text-green-600">{balance.totalPaid}</span>
                        {' / '}잔액: <span className="font-semibold text-red-600">{balance.remaining}</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <input type="number"
                        placeholder="결제 금액"
                        value={form.amount === 0 ? '' : form.amount}
                        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        type='date'
                        value={form.paymentDate}
                        onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                    등록
                </button>
            </div >
        </div>
    )
}

export default PaymentPage;