import { useState, useEffect } from 'react';
import { getQuotation, updateQuotation } from '../../../api/quotationApi';
import { getCompanyList } from '../../../api/companyApi';
import { getItemsList } from '../../../api/itemsApi';
import QuotationFormFields from './QuotationFormFields';
import type { Company } from '../../../types/company';
import type { Items } from '../../../types/items';
import type { QuotationCreateRequest, QuotationItemRequest } from '../../../types/quotation';

interface QuotationEditFormProps {
    quotationId: number;
    onSuccess: () => void;
}

function QuotationEditForm({ quotationId, onSuccess }: QuotationEditFormProps) {
    const [form, setForm] = useState<QuotationCreateRequest>({
        companyId: 0, currency: '', incoterms: '', paymentTerm: '', quotationDate: '', comment: '', items: []
    });
    const [currentItem, setCurrentItem] = useState<QuotationItemRequest>({ itemsId: 0, quantity: 0 });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [itemsList, setItemsList] = useState<Items[]>([]);

    useEffect(() => {
        fetchCompanies();
        fetchItems();
        fetchDetail();
    }, [quotationId]);

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data.content);
    };

    const fetchItems = async () => {
        const data = await getItemsList();
        setItemsList(data);
    };

    const fetchDetail = async () => {
        const detail = await getQuotation(quotationId);
        setForm({
            companyId: detail.quotation.companyId,
            currency: detail.quotation.currency,
            incoterms: detail.quotation.incoterms,
            paymentTerm: detail.quotation.paymentTerm,
            quotationDate: detail.quotation.quotationDate,
            comment: detail.quotation.comment,
            items: detail.items.map((item) => ({ itemsId: item.itemsId, quantity: item.quantity })),
        });
    };

    const handleAddItem = () => {
        if (!currentItem.itemsId) { alert('품목을 선택해주세요.'); return; }
        if (!currentItem.quantity || currentItem.quantity <= 0) { alert('수량은 0보다 큰 숫자로 입력해주세요'); return; }
        setForm({ ...form, items: [...form.items, currentItem] });
        setCurrentItem({ itemsId: 0, quantity: 0 });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setForm({ ...form, items: form.items.filter((_, index) => index !== indexToRemove) });
    };

    const handleSubmit = async () => {
        try {
            await updateQuotation(quotationId, form);
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data || '견적 수정에 실패했습니다.';
            alert(message);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">견적 수정</h2>
            <QuotationFormFields
                form={form} setForm={setForm}
                currentItem={currentItem} setCurrentItem={setCurrentItem}
                onAddItem={handleAddItem} onRemoveItem={handleRemoveItem}
                companies={companies} itemsList={itemsList}
                disabled={true}
            />
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4">
                수정 완료
            </button>
        </div>
    );
}

export default QuotationEditForm;