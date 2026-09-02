import { createPayment, getInvoiceBalance, getPayments, updatePayment } from "../../api/paymentApi";
import type { PaymentStatus, PaymentCreateRequest, PaymentResponse, InvoiceBalance } from "../../types/payment";
import { useEffect, useState } from "react";
import { getInvoicesByStatus } from "../../api/invoiceApi";
import type { InvoiceResponse } from "../../types/invoice";
import type { Company } from "../../types/company";
import { getCompanyList } from "../../api/companyApi";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";

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

    useEffect(() => {
        fetchInvoiceListByStatus();
        fetchCompanies();
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

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data);
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
                                <StatusSelect
                                    value={p.status}
                                    onChange={(s) => handleStatusChange(p.id, p.invoiceId, s as PaymentStatus)}
                                    options={['PENDING', 'COMPLETED', 'CANCELLED']}
                                />
                            </td>
                            <td>{p.createdAt}</td>
                            <td>{p.updatedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* register form */}
            <h2>결제 등록</h2>
            <EntitySelect
                value={form.invoiceId}
                onChange={handleInvoiceSelect}
                options={invoiceList.map(inv => ({ id: inv.id, label: inv.invoiceNumber }))}
                placeholder="인보이스 선택"
            />

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