import type { PaymentStatusHistory } from '../../../types/payment';
import formatDate from '../../../utils/formatDate';

interface PaymentStatusHistoryPanelProps {
    history: PaymentStatusHistory[];
    onClose: () => void;
}

function PaymentStatusHistoryPanel({ history, onClose }: PaymentStatusHistoryPanelProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">상태 변경 이력</h3>
                <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-800">✕</button>
            </div>
            {history.length === 0 ? (
                <p className="text-sm text-gray-400">이력이 없습니다</p>
            ) : (
                <ul className="text-sm text-gray-600 space-y-2">
                    {history.map((h, idx) => (
                        <li key={idx} className="border-b border-gray-100 pb-2">
                            {h.previousStatus ?? '등록'} → {h.newStatus}<br/>
                            <span className="text-gray-400">{formatDate(h.changedAt)} · {h.changedByName}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PaymentStatusHistoryPanel;