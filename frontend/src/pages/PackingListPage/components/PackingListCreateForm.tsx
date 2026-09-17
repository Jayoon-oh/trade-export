import { useState, useEffect } from 'react';
import { createPackingList, getAvailableItems } from '../../../api/packingListApi';
import { getShipmentsList } from '../../../api/shipmentApi';
import PackingListFormFields from './PackingListFormFields';
import type { Shipment } from '../../../types/shipment';
import type { AvailableItem, PackingListCreateRequest, PackingListItemRequest } from '../../../types/packingList';

interface PackingListCreateFormProps {
    onSuccess: () => void;
}

function PackingListCreateForm({ onSuccess }: PackingListCreateFormProps) {
    const [form, setForm] = useState<PackingListCreateRequest>({
        shipmentId: 0, packingDate: '', totalAmount: 0, totalWeight: 0, comment: '', items: []
    });
    const [currentItem, setCurrentItem] = useState<PackingListItemRequest>({ itemsId: 0, quantity: 0, actualWeight: 0 });
    const [shipmentList, setShipmentList] = useState<Shipment[]>([]);

    // fetch from orders
    const [availableItems, setAvailableItems] = useState<AvailableItem[]>([]);

    useEffect(() => {
        fetchShipments();
    }, []);

    useEffect(() => {
        if (form.shipmentId) {
            fetchAvailableItems();
        } else {
            setAvailableItems([]);
        }
    }, [form.shipmentId]);

    const fetchAvailableItems = async () => {
        const data = await getAvailableItems(form.shipmentId);
        setAvailableItems(data);
    };

    const fetchShipments = async () => {
        const data = await getShipmentsList();
        setShipmentList(data.content);
    };

    const handleAddItem = () => {
        if (!currentItem.itemsId) {
            alert('품목을 선택해주세요.');
            return;
        }
        if (!currentItem.quantity || currentItem.quantity <= 0) {
            alert('수량은 0보다 큰 숫자로 입력해주세요.');
            return;
        }

        const selectedItem = availableItems.find(item => item.itemsId === currentItem.itemsId);
        if (selectedItem && currentItem.quantity > selectedItem.orderedQuantity) {
            alert(`주문 수량(${selectedItem.orderedQuantity})을 초과할 수 없습니다.`);
            return;
        }

        setForm({ ...form, items: [...form.items, currentItem] });
        setCurrentItem({ itemsId: 0, quantity: 0, actualWeight: 0 });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setForm({ ...form, items: form.items.filter((_, index) => index !== indexToRemove) });
    };

    const handleSubmit = async () => {
        if (!form.packingDate) { alert('포장일을 선택해주세요'); return; }
        try {
            const payload = {
                ...form,
                items: form.items.map(({ itemsId, quantity, actualWeight }) => ({ itemsId, quantity, actualWeight })),
            };
            await createPackingList(payload);
            onSuccess();
        } catch (error: any) {
            alert('등록에 실패했습니다. 이미 등록된 패킹리스트가 있는지 확인해주세요.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">패킹리스트 등록</h2>
            <PackingListFormFields
                form={form} setForm={setForm}
                currentItem={currentItem} setCurrentItem={setCurrentItem}
                onAddItem={handleAddItem} onRemoveItem={handleRemoveItem}
                shipmentList={shipmentList} itemsList={availableItems}
            />
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4">
                등록하기
            </button>
        </div>
    );
}

export default PackingListCreateForm;