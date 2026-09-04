import type { Orders, OrdersCreateRequest, OrdersItemRequest } from "../../types/orders";
import { getInvoiceList, issueInvoice, cancelInvoice, handleGenerateInvoice } from "../../api/invoiceApi";
import { getCompanyList } from "../../api/companyApi";
import { getItemsList } from "../../api/itemsApi";
import { getOrdersList, deleteOrders, getOrder, registerOrders, updateOrders } from "../../api/ordersApi";
import { useState, useEffect } from "react";
import type { Items } from "../../types/items";
import type { Company } from "../../types/company";
import type { InvoiceResponse } from "../../types/invoice";
import InvoiceHistoryModal from "./components/InvoiceHistoryModal";
import EntitySelect from "../../components/EntitySelect";
import ItemPicker from "../../components/itemPicker";
import formatDate from "../../utils/formatDate";
import { getQuotationList } from "../../api/quotationApi";
import type { Quotation } from "../../types/quotation";

function OrdersPage() {
    const [ordersList, setOrdersList] = useState<Orders[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [quotationList, setQuotationList] = useState<Quotation[]>([])
    const [form, setForm] = useState<OrdersCreateRequest>({
        buyerId: 0,
        quotationId: 0,
        amount: 0,
        ordersDate: '',
        comment: '',
        currency: '',
        incoterms: '',
        paymentTerm: '',
        items: []
    })
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentItem, setCurrentItem] = useState<OrdersItemRequest>({
        itemsId: 0,
        quantity: 0,
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [itemsList, setItemsList] = useState<Items[]>([]);

    const paymentTerms = ['TT'];
    const incotermsList = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP'];
    const currencies = ['USD', 'KRW', 'EUR', 'JPY', 'CNY'];

    // Invoice
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [invoiceHistory, setInvoiceHistory] = useState<InvoiceResponse[]>([]);
    const [historyOrderId, setHistoryOrderId] = useState<number | null>(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        fetchCompanies();
        fetchItems();
        fetchQuotations();
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
        const data = await getCompanyList();
        setCompanies(data.content);
    }

    const fetchQuotations = async () => {
        const data = await getQuotationList();
        setQuotationList(data.content);
    }

    const fetchItems = async () => {
        const data = await getItemsList();
        setItemsList(data);
    };

    const handleSubmit = async () => {
        // validation
        if (!form.buyerId) {
            alert('바이어를 선택해주세요.');
            return;
        }
        if (!form.ordersDate) {
            alert('주문일을 선택해주세요.');
            return;
        }
        if (!form.currency) {
            alert('통화를 선택해주세요.');
            return;
        }
        if (!form.incoterms) {
            alert('인코텀즈를 선택해주세요.');
            return;
        }
        if (!form.paymentTerm) {
            alert('결제조건을 선택해주세요.');
            return;
        }
        if (form.items.length === 0) {
            alert('품목을 최소 1개 이상 추가해주세요.');
            return;
        }

        try {
            const payload = {
                ...form,
                quotationId: form.quotationId || undefined,
            };
            if (editingId) {
                await updateOrders(editingId, payload);
            } else {
                await registerOrders(payload);
            }
            setForm({
                buyerId: 0,
                quotationId: 0,
                amount: 0,
                ordersDate: '',
                comment: '',
                currency: '',
                incoterms: '',
                paymentTerm: '',
                items: []
            });
            setEditingId(null);
            fetchOrders();
        } catch (error: any) {
            const message = error.response?.data || '오더 등록/수정에 실패했습니다.';
            alert(message);
        }
    }

    const handleEdit = async (ordersId: number) => {
        const detail = await getOrder(ordersId);

        setForm({
            buyerId: detail.orders.buyerId,
            quotationId: detail.orders.quotationId,
            amount: detail.orders.amount,
            ordersDate: detail.orders.ordersDate,
            comment: detail.orders.comment,
            currency: detail.orders.currency,
            incoterms: detail.orders.incoterms,
            paymentTerm: detail.orders.paymentTerm,
            items: detail.items.map((item) => ({
                itemsId: item.itemsId,
                quantity: item.quantity
            }))
        });
        setEditingId(ordersId);
    };

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

    const handleAddItem = () => {
        if (!currentItem.itemsId) {
            alert('품목을 선택해주세요.');
            return;
        }
        if (!currentItem.quantity || currentItem.quantity <= 0) {
            alert('수량은 0보다 큰 숫자로 입력해주세요');
            return;
        }
        setForm({ ...form, items: [...form.items, currentItem] });
        setCurrentItem({ itemsId: 0, quantity: 0 });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setForm({
            ...form,
            items: form.items.filter((_, index) => index !== indexToRemove),
        });
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
        if (!invoiceId == null) {
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

            <div className="mb-8">
                <EntitySelect
                    value={buyerId}
                    onChange={setBuyerId}
                    options={companies.map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체"
                />
            </div>

            {/* Table */}
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
                    {ordersList.map((orders) => (
                        <tr key={orders.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{orders.orderNumber}</td>
                            <td className="px-4 py-3">{orders.buyerName}</td>
                            <td className="px-4 py-3">{orders.amount}</td>
                            <td className="px-4 py-3">{orders.currency}</td>
                            <td className="px-4 py-3">{formatDate(orders.ordersDate)}</td>
                            <td className="px-4 py-3">{orders.comment || '-'}</td>
                            <td className="px-4 py-3 flex gap-2 flex-wrap">
                                <button onClick={() => handleEdit(orders.id)} className="text-blue-900 hover:underline">수정</button>
                                {!orders.hasInvoice && (
                                    <button onClick={() => handleDelete(orders.id)} className="text-red-600 hover:underline">삭제</button>
                                )}
                                <button onClick={() => handleIssueInvoice(orders.id)} className="text-green-700 hover:underline">인보이스 발행</button>
                                <button onClick={() => handleViewHistory(orders.id)} className="text-gray-600 hover:underline">발행 이력</button>
                            </td>
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

            {/* Registration section*/}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">오더 등록</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <EntitySelect
                        value={form.buyerId}
                        onChange={(id) => setForm({ ...form, buyerId: id })}
                        options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                        placeholder="바이어 선택"
                        disabled={editingId != null}
                    />
                    <EntitySelect
                        value={form.quotationId ?? 0}
                        onChange={(id) => setForm({ ...form, quotationId: id })}
                        options={quotationList.map(q => ({ id: q.id, label: `#${q.id} - ${q.companyName}` }))}
                        placeholder="견적 선택 (선택사항)"
                    />
                    <input
                        type="date"
                        value={form.ordersDate}
                        onChange={(e) => setForm({ ...form, ordersDate: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option value="">통화 선택</option>
                        {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option value="">인코텀즈 선택</option>
                        {incotermsList.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={form.paymentTerm} onChange={(e) => setForm({ ...form, paymentTerm: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option value="">결제조건 선택</option>
                        {paymentTerms.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <input
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    placeholder="코멘트"
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                />

                {/* Add itmes */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">품목 추가</h3>
                    <div className="flex gap-2 mb-3">
                        <ItemPicker
                            itemsId={currentItem.itemsId}
                            quantity={currentItem.quantity}
                            itemsList={itemsList.map(item => ({ id: item.id, label: item.productName, price: item.price }))}
                            onChangeItem={(id) => setCurrentItem({ ...currentItem, itemsId: id })}
                            onChangeQuantity={(qty) => setCurrentItem({ ...currentItem, quantity: qty })}
                        />
                        <button onClick={handleAddItem} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">품목 추가</button>
                    </div>

                    <ul className="space-y-1">
                        {form.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                                <span>품목ID: {item.itemsId}, 수량: {item.quantity}</span>
                                <button onClick={() => handleRemoveItem(index)} className="text-red-600 hover:underline">삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                        {editingId ? '수정하기' : '등록하기'}
                    </button>
                    {editingId && (
                        <button onClick={() => {
                            setEditingId(null);
                            setForm({
                                buyerId: 0,
                                quotationId: 0,
                                amount: 0,
                                ordersDate: '',
                                comment: '',
                                currency: '',
                                incoterms: '',
                                paymentTerm: '',
                                items: []
                            });
                        }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            수정 취소
                        </button>
                    )}
                </div>
            </div>

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