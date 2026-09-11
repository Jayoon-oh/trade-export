import { useState, useEffect } from 'react';
import { createPackingList } from '../../../api/packingListApi'; 
import { getShipmentsList } from '../../../api/shipmentApi'; 
import { getItemsList } from '../../../api/itemsApi';
import PackingListFormFields from './PackingListFormFields'; 
import type { Shipment } from '../../../types/shipment'; 
import type { Items } from '../../../types/items';
import type { PackingListCreateRequest, PackingListItemRequest } from '../../../types/packingList';

interface PackingListCreateFormProps {
    onSuccess: () => void;
}

function PackingListCreateForm({ onSuccess }: PackingListCreateFormProps) {
    const [form, setForm] = useState<PackingListCreateRequest>({
        shipmentId: 0, packingDate: '', totalAmount: 0, totalWeight: 0, comment: '', items: []
    });
    const [currentItem, setCurrentItem] = useState<PackingListItemRequest>({ itemsId: 0, quantity: 0, actualWeight: 0 });
    const [shipmentList, setShipmentList] = useState<Shipment[]>([]);
    const [itemsList, setItemsList] = useState<Items[]>([]);

    useEffect(() => {
        fetchShipments();
        fetchItems();
    }, []);

    const fetchShipments = async () => {
        const data = await getShipmentsList();
        setShipmentList(data.content);
    };

    const fetchItems = async () => {
        const data = await getItemsList();
        setItemsList(data);
    };

    const handleAddItem = () => {
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
                shipmentList={shipmentList} itemsList={itemsList}
            />
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4">
                등록하기
            </button>
        </div>
    );
}

export default PackingListCreateForm;