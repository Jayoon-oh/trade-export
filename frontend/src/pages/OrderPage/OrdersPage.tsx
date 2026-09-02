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

function OrdersPage() {
    const [ordersList, setOrdersList] = useState<Orders[]>([]);
    const [buyerId, setBuyerId] = useState(0);
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

    useEffect(() => {
        fetchCompanies();
        fetchItems();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [buyerId]);


    const fetchOrders = async () => {
        const data = await getOrdersList(buyerId || undefined);
        setOrdersList(data);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data);
    }

    const fetchItems = async () => {
        const data = await getItemsList();
        setItemsList(data);
    };

    const handleSubmit = async () => {
        if (editingId) {
            await updateOrders(editingId, form);
        } else {
            await registerOrders(form);
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
        await deleteOrders(id);
        fetchOrders();
    };

    const handleAddItem = () => {
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
        const rateInput = prompt('환율을 입력하세요');
        if (!rateInput) return;

        const invoiceId = await issueInvoice(orderId, { exchangeRate: Number(rateInput) });
        await handleGenerateInvoice(invoiceId);
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
        await cancelInvoice(invoiceId);
        if (historyOrderId) {
            const data = await getInvoiceList(historyOrderId);
            setInvoiceHistory(data);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
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
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">바이어명</th>
                        <th className="px-4 py-3">금액</th>
                        <th className="px-4 py-3">통화</th>
                        <th className="px-4 py-3">주문일</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {ordersList.map((orders) => (
                        <tr key={orders.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{orders.id}</td>
                            <td className="px-4 py-3">{orders.buyerName}</td>
                            <td className="px-4 py-3">{orders.amount}</td>
                            <td className="px-4 py-3">{orders.currency}</td>
                            <td className="px-4 py-3">{orders.ordersDate}</td>
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

            {/* Registration section*/}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">오더 등록</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <EntitySelect
                        value={form.buyerId}
                        onChange={(id) => setForm({ ...form, buyerId: id })}
                        options={companies.map(c => ({ id: c.id, label: c.companyName }))}
                        placeholder="바이어 선택"
                        disabled={editingId != null}
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
                            itemsList={itemsList.map(item => ({ id: item.id, label: item.productName }))}
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