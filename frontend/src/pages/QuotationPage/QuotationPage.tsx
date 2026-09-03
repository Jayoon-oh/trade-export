import { createQuotation, getQuotation, getQuotationList, updateQuotation, deleteQuotation } from "../../api/quotationApi";
import { getCompanyList } from "../../api/companyApi";
import { getItemsList } from "../../api/itemsApi";
import type { Quotation, QuotationCreateRequest, QuotationItemRequest } from "../../types/quotation";
import type { Items } from "../../types/items";
import type { Company } from "../../types/company";
import { useState, useEffect } from "react";
import EntitySelect from "../../components/EntitySelect";
import ItemPicker from "../../components/itemPicker";
import formatDate from "../../utils/formatDate";

function QuotationPage() {
    const [quotationList, setQuotationList] = useState<Quotation[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [form, setForm] = useState<QuotationCreateRequest>({
        companyId: 0,
        currency: '',
        incoterms: '',
        paymentTerm: '',
        quotationDate: '',
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

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCompanies();
        fetchItems();
    }, []);

    useEffect(() => {
        fetchQuotation();
    }, [buyerId, currentPage]);

    const fetchQuotation = async () => {
        const data = await getQuotationList(buyerId || undefined, currentPage);
        setQuotationList(data.content);
        setTotalPages(data.totalPages);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data.content);
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
            quotationDate: '',
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
            quotationDate: detail.quotation.quotationDate,
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
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">견적 조회</h1>

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
                        <th className="px-4 py-3">등록일</th>
                        <th className="px-4 py-3">특이사항</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {quotationList.map((quotation) => (
                        <tr key={quotation.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{quotation.id}</td>
                            <td className="px-4 py-3">{quotation.companyName}</td>
                            <td className="px-4 py-3">{quotation.totalAmount}</td>
                            <td className="px-4 py-3">{quotation.currency}</td>
                            <td className="px-4 py-3">{formatDate(quotation.quotationDate)}</td>
                            <td className="px-4 py-3">{quotation.comment || '-'}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => handleEdit(quotation.id)} className="text-blue-900 hover:underline">수정</button>
                                <button onClick={() => handleDelete(quotation.id)} className="text-red-600 hover:underline">삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* pagination */}
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

            {/* Registration section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">견적 등록</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <EntitySelect
                        value={form.companyId}
                        onChange={(id) => setForm({ ...form, companyId: id })}
                        options={companies.map(c => ({ id: c.id, label: c.companyName }))}
                        placeholder="바이어 선택"
                        disabled={editingId != null}
                    />
                    <input
                        type="date"
                        value={form.quotationDate}
                        onChange={(e) => setForm({ ...form, quotationDate: e.target.value })}
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

                {/* Add items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">품목 추가</h3>
                    <div className="flex gap-2 mb-3">
                        <ItemPicker
                            itemsId={currentItem.itemsId}
                            quantity={currentItem.quantity}
                            itemsList={itemsList.map(i => ({ id: i.id, label: i.productName }))}
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
                    {/* Indicate cancel button when editing mode*/}
                    {editingId && (
                        <button onClick={() => {
                            setEditingId(null);
                            setForm({
                                companyId: 0,
                                currency: '',
                                incoterms: '',
                                paymentTerm: '',
                                quotationDate: '',
                                'comment': '',
                                items: []
                            });
                        }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                            수정 취소
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuotationPage;