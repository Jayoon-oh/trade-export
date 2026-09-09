import { useEffect, useState } from "react";
import type { OrderDetail } from "../../../types/dashboard";
import formatDate from "../../../utils/formatDate";

interface OrderDetailPanelProps {
    detail: OrderDetail;
    onClose: () => void;
}

function OrderDetailPanel({ detail, onClose }: OrderDetailPanelProps) {

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {detail.orderNumber} — {detail.buyerName}
                </h3>
                <button onClick={onClose} className="text-gray-500 text-xl hover:text-gray-800">
                    ✕
                </button>
            </div>
            {detail.invoiceNumber ? (
                <div className="mb-4 text-sm text-gray-700">
                    <p><span className="font-semibold">인보이스:</span> {detail.invoiceNumber}</p>
                    <p><span className="font-semibold">발행일:</span> {formatDate(detail.invoiceDate)}</p>
                    <p><span className="font-semibold">청구금액:</span> ${detail.invoiceAmount.toLocaleString()} (환율: {detail.exchangeRate})</p>
                </div>
            ) : (
                <p className="text-sm text-gray-400 mb-4">아직 인보이스가 발행되지 않았습니다.</p>
            )}

            {detail.invoiceNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded px-4 py-3 mb-4 text-sm">
                    청구액: <span className="font-semibold">${detail.invoiceAmount.toLocaleString()}</span>
                    <br />입금액: <span className="font-semibold text-green-600">${detail.totalPaid.toLocaleString()}</span>
                    <br />잔액: <span className="font-semibold text-red-600">${detail.remaining.toLocaleString()}</span>
                </div>
            )}

            {detail.payments.length > 0 && (
                <ul className="text-sm text-gray-600 space-y-1">
                    {detail.payments.map((p, idx) => (
                        <li key={idx}>{p.paymentDate} — ${p.amount.toLocaleString()}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OrderDetailPanel;