import { useState } from 'react';
import { createItems } from '../../../api/itemsApi';
import type { ItemsCreateRequest } from '../../../types/items';

interface StockQuickEditCardProps {
    onSuccess: () => void;
    onCancel: () => void;
}

function StockQuickEditCard({ onSuccess, onCancel }: StockQuickEditCardProps) {
    const [form, setForm] = useState<ItemsCreateRequest>({
        productName: '', price: 0, setQty: 0, standardWeight: 0,
    });

    const handleSubmit = async () => {
        try {
            await createItems(form);
            alert('수정이 완료되었습니다.');
            onSuccess();
        } catch (error) {
            alert('품목 등록에 실패했습니다.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-80">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">품목 등록</h3>

            <div className="flex flex-col gap-2">
                <input
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    placeholder="제품명"
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                    type="number"
                    value={form.price === 0 ? '' : form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="가격"
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                    type="number"
                    value={form.setQty === 0 ? '' : form.setQty}
                    onChange={(e) => setForm({ ...form, setQty: Number(e.target.value) })}
                    placeholder="세트 수"
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                    type="number"
                    value={form.standardWeight === 0 ? '' : form.standardWeight}
                    onChange={(e) => setForm({ ...form, standardWeight: Number(e.target.value) })}
                    placeholder="무게"
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={handleSubmit} className="bg-blue-900 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-800">
                    등록
                </button>
                <button onClick={onCancel} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
                    취소
                </button>
            </div>
        </div>
    );
}

export default StockQuickEditCard;