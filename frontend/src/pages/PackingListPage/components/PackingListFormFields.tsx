import EntitySelect from '../../../components/EntitySelect'; 
import ItemPicker from '../../../components/itemPicker'; 
import type { Shipment } from '../../../types/shipment'; 
import type { Items } from '../../../types/items'; 
import type { PackingListCreateRequest, PackingListItemRequest } from '../../../types/packingList';

interface PackingListFormFieldsProps {
    form: PackingListCreateRequest;
    setForm: (form: PackingListCreateRequest) => void;
    currentItem: PackingListItemRequest;
    setCurrentItem: (item: PackingListItemRequest) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    shipmentList: Shipment[];
    itemsList: Items[];
    disabled?: boolean;
}

function PackingListFormFields({ form, setForm, currentItem, setCurrentItem, onAddItem, onRemoveItem, shipmentList, itemsList, disabled }: PackingListFormFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <EntitySelect
                    value={form.shipmentId}
                    onChange={(id) => setForm({ ...form, shipmentId: id })}
                    options={shipmentList.map(s => ({ id: s.id, label: `#${s.id} - ${s.buyerName}` }))}
                    placeholder="선적 선택"
                    disabled={disabled}
                />
                <input
                    type="date"
                    value={form.packingDate}
                    onChange={(e) => setForm({ ...form, packingDate: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2"
                />
            </div>
            <input
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="특이사항"
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">품목 추가</h3>
                <div className="flex gap-2 mb-3">
                    <ItemPicker
                        itemsId={currentItem.itemsId}
                        quantity={currentItem.quantity}
                        itemsList={itemsList.map(item => ({ id: item.id, label: item.productName, weight: item.standardWeight }))}
                        onChangeItem={(id) => {
                            const selected = itemsList.find(item => item.id === id);
                            setCurrentItem({ ...currentItem, itemsId: id, itemName: selected?.productName });
                        }}
                        onChangeQuantity={(qty) => setCurrentItem({ ...currentItem, quantity: qty })}
                    />
                    <div className="relative">
                        <input
                            type="number"
                            value={currentItem.actualWeight || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, actualWeight: Number(e.target.value) })}
                            placeholder="실측 중량"
                            className="border border-gray-300 rounded px-3 py-2 pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">kg</span>
                    </div>
                    <button onClick={onAddItem} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">품목 추가</button>
                </div>

                <ul className="space-y-1">
                    {form.items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                            <span>제품: {item.itemName}, 수량: {item.quantity}, 실측중량: {item.actualWeight} kg</span>
                            <button onClick={() => onRemoveItem(index)} className="text-red-600 hover:underline">삭제</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default PackingListFormFields;