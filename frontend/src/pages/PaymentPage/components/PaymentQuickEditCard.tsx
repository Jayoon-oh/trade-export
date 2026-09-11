import { useState, useEffect } from 'react';
import { createPayment, getInvoiceBalance } from '../../../api/paymentApi';
import { getInvoicesByStatus} from '../../../api/invoiceApi';
import EntitySelect from '../../../components/EntitySelect';
import type { InvoiceResponse } from '../../../types/invoice';
import type { PaymentCreateRequest, InvoiceBalance} from '../../../types/payment';

interface PaymentQuickEditCardProps {
    onSuccess: () => void;
    onCancel: () => void;
}

function PaymentQuickEditCard({ onSuccess, onCancel }: PaymentQuickEditCardProps) {
    const [form, setForm] = useState<PaymentCreateRequest>({
        invoiceId: 0, amount: 0, paymentDate: ''
    });
    const [invoiceList, setInvoiceList] = useState<InvoiceResponse[]>([]);
    const [balance, setBalance] = useState<InvoiceBalance | null>(null);

    useEffect(() => {
        fetchInvoiceList();
    }, []);

    const fetchInvoiceList = async () => {
        const data = await getInvoicesByStatus('ISSUED');
        setInvoiceList(data);
    };

    const handleInvoiceSelect = async (invoiceId: number) => {
        setForm({ ...form, invoiceId });
        if (invoiceId) {
            const data = await getInvoiceBalance(invoiceId);
            setBalance(data);
        } else {
            setBalance(null);
        }
    };

    const handleSubmit = async () => {
        try {
            await createPayment(form);
            onSuccess();
        } catch (error) {
            alert('결제 등록에 실패했습니다. 잔액을 초과하지 않았는지 확인해주세요.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-80">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">결제 등록</h3>

            <EntitySelect
                value={form.invoiceId}
                onChange={handleInvoiceSelect}
                options={invoiceList.map(inv => ({ id: inv.id, label: inv.invoiceNumber }))}
                placeholder="인보이스 선택"
            />

            {balance && (
                <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mt-3 text-xs text-gray-700">
                    총액: <span className="font-semibold">{balance.totalAmount}</span>
                    <br />완료: <span className="font-semibold text-green-600">{balance.totalPaid}</span>
                    <br />잔액: <span className="font-semibold text-red-600">{balance.remaining}</span>
                </div>
            )}

            <div className="flex flex-col gap-2 mt-3">
                <input
                    type="number"
                    placeholder="결제 금액"
                    value={form.amount === 0 ? '' : form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                    type='date'
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={handleSubmit} className="bg-blue-900 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-800">
                    등록
                </button>
                <button onClick={onCancel} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
                    취소
                </button>
            </div>
        </div>
    );
}

export default PaymentQuickEditCard;