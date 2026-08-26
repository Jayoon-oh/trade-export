import { createQuotation, getQuotation, getQuotationList, updateQuotation, deleteQuotation } from "../../api/quotationApi";
import { getCompanyList } from "../../api/companyApi";
import { getItemsList } from "../../api/itemsApi";
import type { Quotation, QuotationCreateRequest, QuotationDetailResponse, QuotationItemLine, QuotationItemRequest } from "../../types/quotation";
import type { Items } from "../../types/items";
import type { Company } from "../../types/company";
import { useState, useEffect } from "react";

function QuotationPage() {
    const [quotationList, setQuotationList] = useState<Quotation[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [form, setForm] = useState<QuotationCreateRequest>({
        companyId: 0,
        currency: '',
        incoterms: '',
        paymentTerm: '',
        comment: '',
        items: []
    })
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentItem, setCurrentItem] = useState<QuotationItemRequest>({
        itemsId: 0,
        quantity: 0,
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [itemsList, setItemsList] = useState<Items[]>([]);

    const paymentTerms = ['TT'];
    const incotermsList = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP'];
    const currencies = ['USD', 'KRW', 'EUR', 'JPY', 'CNY'];

    useEffect(() => {
        fetchCompanies();
        fetchItems();
    }, []);

    useEffect(() => {
        fetchQuotation();
    }, [buyerId]);

    const fetchQuotation = async () => {
        const data = await getQuotationList(buyerId || undefined);
        setQuotationList(data);
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
            await updateQuotation(editingId, form);
        } else {
            await createQuotation(form);
        }
        setForm({
            companyId: 0,
            currency: '',
            incoterms: '',
            paymentTerm: '',
            comment: '',
            items: []
        });
        setEditingId(null);
        fetchQuotation();
    }

    const handleEdit = async (quotationId: number) => {
        const detail = await getQuotation(quotationId);

        setForm({
            companyId: detail.quotation.companyId,
            currency: detail.quotation.currency,
            incoterms: detail.quotation.incoterms,
            paymentTerm: detail.quotation.paymentTerm,
            comment: detail.quotation.comment,
            items: detail.items.map((item) => ({
                itemsId: item.itemsId,
                quantity: item.quantity,
            })),
        });
        setEditingId(quotationId);
    };

    const handleDelete = async (id: number) => {
        await deleteQuotation(id);
        fetchQuotation();
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

    return (
        <div>
            <h1>견적 조회</h1>
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
                        <th>등록일</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {quotationList.map((quotation) => (
                        <tr key={quotation.id}>
                            <td>{quotation.id}</td>
                            <td>{quotation.companyName}</td>
                            <td>{quotation.totalAmount}</td>
                            <td>{quotation.currency}</td>
                            <td>{quotation.quotationDate}</td>
                            <td>
                                <button onClick={() => handleEdit(quotation.id)}>수정</button>
                                <button onClick={() => handleDelete(quotation.id)}>삭제</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>견적 등록</h2>
            <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: Number(e.target.value) })}
                disabled={editingId != null}>
                <option value={0}>바이어 선택</option>
                {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
            </select>
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
            <select value={currentItem.itemsId} onChange={(e) => setCurrentItem({ ...currentItem, itemsId: Number(e.target.value) })}>
                <option value={0}>품목 선택</option>
                {itemsList.map((item) => (
                    <option key={item.id} value={item.id}>{item.productName}</option>
                ))}
            </select>
            <input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                placeholder="수량"
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

            {/* Indicate cancel button when editing mode*/}
            {editingId && (
                <button onClick={() => {
                    setEditingId(null);
                    setForm({
                        companyId: 0,
                        currency: '',
                        incoterms: '',
                        paymentTerm: '',
                        comment: '',
                        items: []
                    });
                }}>
                    수정 취소
                </button>
            )}
        </div>
    )
}

export default QuotationPage;