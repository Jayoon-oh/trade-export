import { createPayment, getInvoiceBalance, getPayments, updatePayment } from "../../api/paymentApi";
import type { PaymentStatus, PaymentCreateRequest, PaymentResponse, InvoiceBalance } from "../../types/payment";
import { useEffect, useState } from "react";
import { getInvoicesByStatus } from "../../api/invoiceApi";
import type { InvoiceResponse } from "../../types/invoice";

function PaymentPage() {
    const [paymentList, setPaymentList] = useState<PaymentResponse[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [status, setStatus] = useState<PaymentStatus>();
    const [form, setForm] = useState<PaymentCreateRequest>({
        invoiceId: 0,
        amount: 0,
        paymentDate: ''
    })
    const [invoiceList, setInvoiceList] = useState<InvoiceResponse[]>([]);
    const [balance, setBalance] = useState<InvoiceBalance | null>(null);

    useEffect(() => {
        fetchInvoiceListByStatus();
    }, []);

    useEffect(() => {
        fetchPaymentList();
    }, [buyerId, status]);

    const fetchPaymentList = async () => {
        const data = await getPayments(buyerId || undefined, status || undefined);
        setPaymentList(data);
    }

    const fetchInvoiceListByStatus = async () => {
        const data = await getInvoicesByStatus('ISSUED');
        setInvoiceList(data);
    }

    const handleSubmit = async () => {
        try {
            await createPayment(form);
            setForm({
                invoiceId: 0,
                amount: 0,
                paymentDate: ''
            });
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
        <div>
            <h1>결제 관리</h1>

            {/* filter */}
            <div>
                <select value={status ?? ''} onChange={(e) => setStatus(e.target.value as PaymentStatus || undefined)} >
                    <option value=''>전체 상태</option>
                    <option value='PENDING'>PENDING</option>
                    <option value='COMPLETED'>COMPLETED</option>
                    <option value='CANCELLED'>CANCELLED</option>
                </select>
            </div>

            {/* list */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>인보이스번호</th>
                        <th>바이어</th>
                        <th>금액</th>
                        <th>결제일</th>
                        <th>상태</th>
                        <th>등록일</th>
                        <th>수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentList.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.invoiceNumber}</td>
                            <td>{p.buyerName}</td>
                            <td>{p.amount}</td>
                            <td>{p.paymentDate}</td>
                            <td>
                                <select
                                    value={p.status}
                                    onChange={(e) => handleStatusChange(p.id, p.invoiceId, e.target.value as PaymentStatus)}
                                >
                                    <option value='PENDING'>PENDING</option>
                                    <option value='COMPLETED'>COMPLETED</option>
                                    <option value='CANCELLED'>CANCELLED</option>
                                </select>
                            </td>
                            <td>{p.createdAt}</td>
                            <td>{p.updatedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* register form */}
            <h2>결제 등록</h2>
            <select
                value={form.invoiceId}
                onChange={(e) => handleInvoiceSelect(Number(e.target.value))}
            >
                <option value={0}>인보이스 선택</option>
                {invoiceList.map((inv) => (
                    <option key={inv.id} value={inv.id}>{inv.invoiceNumber}</option>
                ))
                }
            </select>

            {balance && (
                <p>
                    인보이스 총액: {balance.totalAmount} / 결제완료: {balance.totalPaid} / 잔액: {balance.remaining}
                </p>
            )}

            <input type="number"
                placeholder="결제 금액"
                value={form.amount === 0 ? '' : form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />

            <input
                type='date'
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
            />

            <button onClick={handleSubmit}>등록</button>
        </div >
    )
}

export default PaymentPage;