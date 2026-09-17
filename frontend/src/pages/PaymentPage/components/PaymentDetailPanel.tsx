import type { PaymentDetail } from '../../../types/payment';

interface PaymentDetailPanelProps {
    detail: PaymentDetail;
    onClose: () => void;
}

function PaymentDetailPanel({ detail, onClose }: PaymentDetailPanelProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {detail.invoiceNumber}
                </h3>
                <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-800">
                    ✕
                </button>
            </div>

            <div className="mb-4 text-sm text-gray-700">
                <p><span className="font-semibold">발행일:</span> {detail.invoiceDate}</p>
                <p><span className="font-semibold">청구금액:</span> {detail.invoiceAmount.toLocaleString()}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3 mb-4 text-sm">
                청구액: <span className="font-semibold">{detail.invoiceAmount.toLocaleString()}</span>
                <br />입금액: <span className="font-semibold text-green-600">{detail.totalPaid.toLocaleString()}</span>
                <br />잔액: <span className="font-semibold text-red-600">{detail.remaining.toLocaleString()}</span>
            </div>

            {detail.payments.length > 0 ? (
                <ul className="text-sm text-gray-600 space-y-1">
                    {detail.payments.map((p, idx) => (
                        <li key={idx}>{p.paymentDate} — {p.amount.toLocaleString()}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-400">완료된 결제 내역이 없습니다.</p>
            )}
        </div>
    );
}

export default PaymentDetailPanel;