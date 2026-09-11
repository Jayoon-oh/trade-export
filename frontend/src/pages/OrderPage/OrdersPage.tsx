import type { Orders } from "../../types/orders";
import { getInvoiceList, issueInvoice, cancelInvoice, handleGenerateInvoice } from "../../api/invoiceApi";
import { getAllCompanies } from "../../api/companyApi";
import { getOrdersList, deleteOrders } from "../../api/ordersApi";
import { useState, useEffect } from "react";
import type { Company } from "../../types/company";
import type { InvoiceResponse } from "../../types/invoice";
import InvoiceHistoryModal from "./components/InvoiceHistoryModal";
import EntitySelect from "../../components/EntitySelect";
import formatDate from "../../utils/formatDate";
import OrdersCreateForm from "./components/OrdersCreateForm";
import OrdersEditForm from "./components/OrdersEditForm";

function OrdersPage() {
    const [ordersList, setOrdersList] = useState<Orders[]>([]);
    const [buyerId, setBuyerId] = useState(0);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);

    const [view, setView] = useState<'list' | 'new' | 'edit'>('list');

    // Invoice
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [invoiceHistory, setInvoiceHistory] = useState<InvoiceResponse[]>([]);
    const [historyOrderId, setHistoryOrderId] = useState<number | null>(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [buyerId, currentPage]);


    const fetchOrders = async () => {
        const data = await getOrdersList(buyerId || undefined, currentPage);
        setOrdersList(data.content);
        setTotalPages(data.totalPages);
    }

    const fetchCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    }

    const handleDelete = async (id: number) => {
        try {
            if (!id) {
                alert('삭제할 오더를 선택해주세요');
                return;
            }
            await deleteOrders(id);
            fetchOrders();
        } catch (error: any) {
            const message = error.response?.data || '오더 삭제에 실패했습니다.';
            alert(message);
        }
    };

    const handleIssueInvoice = async (orderId: number) => {
        try {
            if (!orderId) {
                alert('오더를 선택해주세요.');
                return;
            }

            const rateInput = prompt('환율을 입력하세요');
            if (!rateInput) {
                return;
            }

            const rate = Number(rateInput);
            if (isNaN(rate) || rate <= 0) {
                alert('환율은 0보다 큰 숫자로 입력해주세요.');
                return;
            }

            const invoiceId = await issueInvoice(orderId, { exchangeRate: rate });
            await handleGenerateInvoice(invoiceId);
        } catch (error) {
            alert('발행에 실패했습니다. 이미 인보이스가 존재하는지 확인해주세요.');
        }
    }

    const handleViewHistory = async (orderId: number) => {
        const data = await getInvoiceList(orderId);
        setInvoiceHistory(data);
        setHistoryOrderId(orderId);
        setIsHistoryOpen(true);
    }

    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
        setInvoiceHistory([]);
    }

    const handleCancelInvoice = async (invoiceId: number) => {
        if (!invoiceId) {
            alert('인보이스를 선택해주세요.')
            return;
        }
        try {
            await cancelInvoice(invoiceId);
            if (historyOrderId) {
                const data = await getInvoiceList(historyOrderId);
                setInvoiceHistory(data);
            }
        } catch (error) {
            alert('이미 결제내역이 존재하는 경우 인보이스 취소가 불가능합니다.');
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">오더 조회</h1>

            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
                <button onClick={() => setView('list')} className={view === 'list' ? 'font-semibold text-blue-900' : 'text-gray-500'}>목록</button>
                <button onClick={() => setView('new')} className={view === 'new' ? 'font-semibold text-blue-900' : 'text-gray-500'}>신규 등록</button>
            </div>

            {view === 'list' && (
                <>
                    <div className="mb-8">
                        <EntitySelect
                            value={buyerId}
                            onChange={setBuyerId}
                            options={companies.map(c => ({ id: c.id, label: c.companyName }))}
                            placeholder="전체"
                        />
                    </div>

                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">오더 ID</th>
                                <th className="px-4 py-3">바이어명</th>
                                <th className="px-4 py-3">금액</th>
                                <th className="px-4 py-3">통화</th>
                                <th className="px-4 py-3">주문일</th>
                                <th className="px-4 py-3">특이사항</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        오더 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                ordersList.map((orders) => (
                                    <tr key={orders.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{orders.orderNumber}</td>
                                        <td className="px-4 py-3">{orders.buyerName}</td>
                                        <td className="px-4 py-3">{orders.amount}</td>
                                        <td className="px-4 py-3">{orders.currency}</td>
                                        <td className="px-4 py-3">{formatDate(orders.ordersDate)}</td>
                                        <td className="px-4 py-3">{orders.comment || '-'}</td>
                                        <td className="px-4 py-3 flex gap-2 flex-wrap">
                                            <button onClick={() => { setEditingId(orders.id); setView('edit'); }} className="text-blue-900 hover:underline">수정</button>
                                            {!orders.hasInvoice && (
                                                <button onClick={() => handleDelete(orders.id)} className="text-red-600 hover:underline">삭제</button>
                                            )}
                                            <button onClick={() => handleIssueInvoice(orders.id)} className="text-green-700 hover:underline">인보이스 발행</button>
                                            <button onClick={() => handleViewHistory(orders.id)} className="text-gray-600 hover:underline">발행 이력</button>
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
                </>
            )}

            {view === 'new' && (
                <OrdersCreateForm onSuccess={() => { setView('list'); fetchOrders(); }} />
            )}

            {view === 'edit' && editingId && (
                <OrdersEditForm orderId={editingId} onSuccess={() => { setView('list'); fetchOrders(); }} />
            )}

            <InvoiceHistoryModal
                isOpen={isHistoryOpen}
                history={invoiceHistory}
                onClose={handleCloseHistory}
                onCancel={handleCancelInvoice}
                onDownload={handleGenerateInvoice}
            />
        </div >
    );
}

export default OrdersPage;