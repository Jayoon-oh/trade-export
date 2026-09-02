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
        <div>
            <h1>오더 조회</h1>
            <select value={buyerId} onChange={(e) => setBuyerId(Number(e.target.value))}>
                <option value={0}>전체</option>
                {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
            </select>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>바이어명</th>
                        <th>금액</th>
                        <th>통화</th>
                        <th>주문일</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {ordersList.map((orders) => (
                        <tr key={orders.id}>
                            <td>{orders.id}</td>
                            <td>{orders.buyerName}</td>
                            <td>{orders.amount}</td>
                            <td>{orders.currency}</td>
                            <td>{orders.ordersDate}</td>
                            <td>
                                <button onClick={() => handleEdit(orders.id)}>수정</button>
                                {!orders.hasInvoice && (
                                    <button onClick={() => handleDelete(orders.id)}>삭제</button>
                                )
                                }
                                <button onClick={() => handleIssueInvoice(orders.id)}>인보이스 발행</button>
                                <button onClick={() => handleViewHistory(orders.id)}>발행 이력</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>오더 등록</h2>
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
            />
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="">통화 선택</option>
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })}>
                <option value="">인코텀즈 선택</option>
                {incotermsList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.paymentTerm} onChange={(e) => setForm({ ...form, paymentTerm: e.target.value })}>
                <option value="">결제조건 선택</option>
                {paymentTerms.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="코멘트"
            />

            <h3>품목 추가</h3>
            <ItemPicker
                itemsId={currentItem.itemsId}
                quantity={currentItem.quantity}
                itemsList={itemsList.map(item => ({ id: item.id, label: item.productName }))}
                onChangeItem={(id) => setCurrentItem({ ...currentItem, itemsId: id })}
                onChangeQuantity={(qty) => setCurrentItem({ ...currentItem, quantity: qty })}
            />
            <button onClick={handleAddItem}>품목 추가</button>

            <ul>
                {form.items.map((item, index) => (
                    <li key={index}>
                        품목ID: {item.itemsId}, 수량: {item.quantity}
                        <button onClick={() => handleRemoveItem(index)}>삭제</button>
                    </li>
                ))}
            </ul>

            <button onClick={handleSubmit}>{editingId ? '수정하기' : '등록하기'}</button>

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
                }}>
                    수정 취소
                </button>
            )}
            <InvoiceHistoryModal
                isOpen={isHistoryOpen}
                history={invoiceHistory}
                onClose={handleCloseHistory}
                onCancel={handleCancelInvoice}
                onDownload={handleGenerateInvoice}
            />
        </div>
    );
}

export default OrdersPage;