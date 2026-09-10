import { useEffect, useState } from "react";
import { registerOrders } from "../../../api/ordersApi";
import type { OrdersCreateRequest, OrdersItemRequest } from "../../../types/orders";
import OrdersFormFields from "./OrdersFormFields";
import type { Company } from "../../../types/company";
import type { Items } from "../../../types/items";
import type { Quotation } from "../../../types/quotation";
import { getItemsList } from "../../../api/itemsApi";
import { getQuotationList } from "../../../api/quotationApi";
import { getAllCompanies } from "../../../api/companyApi";

interface OrdersCreateFormProps {
    onSuccess: () => void;
}

function OrdersCreateForm({ onSuccess }: OrdersCreateFormProps) {
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
    const [currentItem, setCurrentItem] = useState<OrdersItemRequest>({
        itemsId: 0,
        quantity: 0,
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [quotationList, setQuotationList] = useState<Quotation[]>([]);
    const [itemsList, setItemsList] = useState<Items[]>([]);

    useEffect(() => {
        fetchCompanies();
        fetchQuotations();
        fetchItems();
    }, []);

    const fetchCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    };

    const fetchQuotations = async () => {
        const data = await getQuotationList();
        setQuotationList(data.content);
    };

    const fetchItems = async () => {
        const data = await getItemsList();
        setItemsList(data);
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
        setForm({ ...form, items: form.items.filter((_, index) => index !== indexToRemove) });
    };

    const handleSubmit = async () => {
        if (!form.buyerId) { alert('바이어를 선택해주세요.'); return; }
        if (!form.ordersDate) { alert('주문일을 선택해주세요.'); return; }
        if (!form.currency) { alert('통화를 선택해주세요.'); return; }
        if (!form.incoterms) { alert('인코텀즈를 선택해주세요.'); return; }
        if (!form.paymentTerm) { alert('결제조건을 선택해주세요.'); return; }
        if (form.items.length === 0) { alert('품목을 최소 1개 이상 추가해주세요.'); return; }

        try {
            const payload = { ...form, quotationId: form.quotationId || undefined };
            await registerOrders(payload)
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data || '오더 등록/수정에 실패했습니다.';
            alert(message);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">오더 등록</h2>

            <OrdersFormFields
                form={form}
                setForm={setForm}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                companies={companies}
                quotationList={quotationList}
                itemsList={itemsList}
            />

            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                등록하기
            </button>
        </div>
    );
};


export default OrdersCreateForm;