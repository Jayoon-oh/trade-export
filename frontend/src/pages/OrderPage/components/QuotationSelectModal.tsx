import { useState, useEffect } from 'react';
import { getAllCompanies } from '../../../api/companyApi';
import { getQuotationList, getQuotation } from '../../../api/quotationApi';
import type { Company } from '../../../types/company';
import type { Quotation } from '../../../types/quotation';

interface QuotationSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (quotationId: number, label: string) => void;
}

function QuotationSelectModal({ isOpen, onClose, onSelect }: QuotationSelectModalProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedBuyerId, setSelectedBuyerId] = useState(0);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [expandedQuotationId, setExpandedQuotationId] = useState<number | null>(null);
    const [expandedItems, setExpandedItems] = useState<{ itemName: string; quantity: number }[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
        }
    }, [isOpen]);

    const fetchCompanies = async () => {
        const data = await getAllCompanies('BUYER');
        setCompanies(data);
    };

    const handleSelectBuyer = async (buyerId: number) => {
        setSelectedBuyerId(buyerId);
        setExpandedQuotationId(null);
        if (buyerId) {
            const data = await getQuotationList(buyerId);
            setQuotations(data.content);
        } else {
            setQuotations([]);
        }
    };

    const handleToggleDetail = async (quotationId: number) => {
        if (expandedQuotationId === quotationId) {
            setExpandedQuotationId(null);
            return;
        }
        const detail = await getQuotation(quotationId);
        setExpandedItems(detail.items.map(item => ({ itemName: item.itemName, quantity: item.quantity })));
        setExpandedQuotationId(quotationId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">견적 선택</h3>

                <select
                    value={selectedBuyerId}
                    onChange={(e) => handleSelectBuyer(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                >
                    <option value={0}>바이어를 먼저 선택하세요</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                </select>

                {selectedBuyerId > 0 && (
                    <table className="w-full border-collapse mb-4">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-2">견적 ID</th>
                                <th className="px-4 py-2">금액</th>
                                <th className="px-4 py-2">등록일</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-4 text-center text-gray-400 text-sm">
                                        이 바이어의 견적이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                quotations.map((q) => (
                                    <>
                                        <tr key={q.id} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-2">#{q.id}</td>
                                            <td className="px-4 py-2">{q.totalAmount}</td>
                                            <td className="px-4 py-2">{q.quotationDate}</td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <button
                                                    onClick={() => handleToggleDetail(q.id)}
                                                    className="text-gray-600 hover:underline text-sm"
                                                >
                                                    {expandedQuotationId === q.id ? '접기' : '상세보기'}
                                                </button>
                                                <button
                                                    onClick={() => onSelect(q.id, `#${q.id} - ${q.companyName}`)}
                                                    className="text-blue-900 hover:underline text-sm"
                                                >
                                                    선택
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedQuotationId === q.id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={4} className="px-4 py-3">
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {expandedItems.map((item, idx) => (
                                                            <li key={idx}>{item.itemName} × {item.quantity}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    닫기
                </button>
            </div>
        </div>
    );
}

export default QuotationSelectModal;