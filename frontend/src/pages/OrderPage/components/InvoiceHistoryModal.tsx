import type { InvoiceResponse } from "../../../types/invoice";
import formatDate from "../../../utils/formatDate";

interface InvoiceHistoryModalProps {
    isOpen: boolean;
    history: InvoiceResponse[];
    onClose: () => void;
    onCancel: (inoiceId: number) => void;
    onDownload: (invoieId: number) => void;
}

function InvoiceHistoryModal({ isOpen, history, onClose, onCancel, onDownload }: InvoiceHistoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">인보이스 발행 이력</h3>

                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm text-gray-600">
                            <th className="px-4 py-2">번호</th>
                            <th className="px-4 py-2">상태</th>
                            <th className="px-4 py-2">발행일</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((invoice) => (
                            <tr key={invoice.id} className="border-t border-gray-200">
                                <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                                <td className="px-4 py-2">{invoice.status}</td>
                                <td className="px-4 py-2">{formatDate(invoice.invoiceDate)}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button onClick={() => onDownload(invoice.id)} className="text-blue-900 hover:underline text-sm">PDF</button>
                                    <button onClick={() => onCancel(invoice.id)} className="text-red-600 hover:underline text-sm">취소</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    닫기
                </button>
            </div>
        </div>
    );
}

export default InvoiceHistoryModal;