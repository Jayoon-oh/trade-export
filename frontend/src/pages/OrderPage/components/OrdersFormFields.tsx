import EntitySelect from "../../../components/EntitySelect";
import ItemPicker from "../../../components/itemPicker";
import type { Company } from "../../../types/company";
import type { Items } from "../../../types/items";
import type { OrdersCreateRequest, OrdersItemRequest } from "../../../types/orders";
import type { Quotation } from "../../../types/quotation";

interface OrdersFormFieldsProps {
    form: OrdersCreateRequest;
    setForm: (form: OrdersCreateRequest) => void;
    currentItem: OrdersItemRequest;
    setCurrentItem: (item: OrdersItemRequest) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    companies: Company[];
    quotationList: Quotation[];
    itemsList: Items[];
    disabled?: boolean;
}

function OrdersFormFields({ form, setForm, currentItem, setCurrentItem, onAddItem, onRemoveItem, companies, quotationList, itemsList, disabled }: OrdersFormFieldsProps) {
    const currencies = ['USD', 'KRW', 'EUR'];
    const incotermsList = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP'];
    const paymentTerms = ['TT'];

    return (
        <>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <EntitySelect
                    value={form.buyerId}
                    onChange={(id) => setForm({ ...form, buyerId: id })}
                    options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="바이어 선택"
                    disabled={disabled}
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
                    <button onClick={onAddItem} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">품목 추가</button>
                </div>

                <ul className="space-y-1">
                    {form.items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                            <span>품목ID: {item.itemsId}, 수량: {item.quantity}</span>
                            <button onClick={() => onRemoveItem(index)} className="text-red-600 hover:underline">삭제</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default OrdersFormFields;