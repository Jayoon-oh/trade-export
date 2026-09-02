import { getPackingList, createPackingList, deletePackingList, getPackingLists, handleGeneratePackingList, updatePackingList } from "../../api/packingListApi"
import type { Items } from "../../types/items"
import type { Company } from "../../types/company"
import { getCompanyList } from "../../api/companyApi";
import { getItemsList } from "../../api/itemsApi";
import { useState, useEffect } from "react"
import type { PackingListCreateRequest, PackingListItemRequest, PackingListResponse } from "../../types/packingList";
import type { Shipment } from "../../types/shipment";
import { getShipmentsList } from "../../api/shipmentApi";
import EntitySelect from "../../components/EntitySelect";
import ItemPicker from "../../components/itemPicker";

function PackingListPage() {
    const [packingList, setPackingList] = useState<PackingListResponse[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [shipmentList, setShipmentList] = useState<Shipment[]>([]);
    const [form, setForm] = useState<PackingListCreateRequest>({
        shipmentId: 0,
        packingDate: '',
        totalAmount: 0,
        totalWeight: 0,
        comment: '',
        items: []
    })
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentItem, setCurrentItem] = useState<PackingListItemRequest>({
        itemsId: 0,
        quantity: 0,
        actualWeight: 0,
    })
    const [companies, setCompanies] = useState<Company[]>([]);
    const [itemsList, setItemsList] = useState<Items[]>([]);

    useEffect(() => {
        fetchCompanies();
        fetchItems();
        fetchShipmentLists();
    }, []);

    useEffect(() => {
        fetchPackingLists();
    }, [buyerId]);

    const fetchPackingLists = async () => {
        const data = await getPackingLists(buyerId || undefined);
        setPackingList(data);
    }

    const fetchShipmentLists = async () => {
        const data = await getShipmentsList();
        setShipmentList(data);
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
        if (!form.packingDate) {
            alert('포장일을 선택해주세요');
            return;
        }
        try {
            if (editingId) {
                await updatePackingList(editingId, form);
            } else {
                await createPackingList(form);
            }
            setForm({
                shipmentId: 0,
                packingDate: '',
                totalAmount: 0,
                totalWeight: 0,
                comment: '',
                items: []
            });
            setEditingId(null);
            fetchPackingLists();

        } catch (error) {
            alert('등록에 실패했습니다. 이미 등록된 패킹리스트가 있는지 확인해주세요.')
        }
    }

    const handleEdit = async (packingListId: number) => {
        const detail = await getPackingList(packingListId);

        setForm({
            shipmentId: detail.packingList.shipmentId,
            packingDate: detail.packingList.packingDate,
            totalAmount: detail.packingList.totalAmount,
            totalWeight: detail.packingList.totalWeight,
            comment: detail.packingList.comment,
            items: detail.items.map((item) => ({
                itemsId: item.itemsId,
                quantity: item.quantity,
                actualWeight: item.actualWeight,
            }))
        });
        setEditingId(packingListId);
    };

    const handleDelete = async (id: number) => {
        await deletePackingList(id);
        fetchPackingLists();
    };

    const handleAddItem = () => {
        setForm({ ...form, items: [...form.items, currentItem] });
        setCurrentItem({
            itemsId: 0,
            quantity: 0,
            actualWeight: 0,
        });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setForm({
            ...form,
            items: form.items.filter((_, index) => index !== indexToRemove),
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">패킹리스트 등록</h1>

            <div className="flex gap-2 mb-8">
                <EntitySelect
                    value={buyerId}
                    onChange={setBuyerId}
                    options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체 바이어"
                />
                <button onClick={fetchPackingLists} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    검색
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-600">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">회사명</th>
                        <th className="px-4 py-3">운송사</th>
                        <th className="px-4 py-3">포장날짜</th>
                        <th className="px-4 py-3">총수량</th>
                        <th className="px-4 py-3">총무게</th>
                        <th className="px-4 py-3">등록날짜</th>
                        <th className="px-4 py-3">수정날짜</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {packingList.map((packingList) => (
                        <tr key={packingList.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{packingList.id}</td>
                            <td className="px-4 py-3">{packingList.buyerName}</td>
                            <td className="px-4 py-3">{packingList.forwarderName}</td>
                            <td className="px-4 py-3">{packingList.packingDate}</td>
                            <td className="px-4 py-3">{packingList.totalAmount}</td>
                            <td className="px-4 py-3">{packingList.totalWeight}</td>
                            <td className="px-4 py-3">{packingList.createdAt}</td>
                            <td className="px-4 py-3">{packingList.updatedAt}</td>
                            <td className="px-4 py-3 flex gap-2 flex-wrap">
                                <button onClick={() => handleEdit(packingList.id)} className="text-blue-900 hover:underline">수정</button>
                                <button onClick={() => handleDelete(packingList.id)} className="text-red-600 hover:underline">삭제</button>
                                <button onClick={() => handleGeneratePackingList(packingList.id)} className="text-gray-600 hover:underline">다운로드</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Packing list */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">패킹리스트 등록</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <EntitySelect
                        value={form.shipmentId}
                        onChange={(id) => setForm({ ...form, shipmentId: id })}
                        options={shipmentList.map(s => ({ id: s.id, label: `#${s.id} - ${s.buyerName}` }))}
                        placeholder="선적 선택"
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

                {/* Add items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">품목 추가</h3>
                    <div className="flex gap-2 mb-3">
                        <ItemPicker
                            itemsId={currentItem.itemsId}
                            quantity={currentItem.quantity}
                            itemsList={itemsList.map(item => ({ id: item.id, label: item.productName }))}
                            onChangeItem={(id) => setCurrentItem({ ...currentItem, itemsId: id })}
                            onChangeQuantity={(qty) => setCurrentItem({ ...currentItem, quantity: qty })}
                        />
                        <input
                            type="number"
                            value={currentItem.actualWeight || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, actualWeight: Number(e.target.value) })}
                            placeholder="실측 중량"
                            className="border border-gray-300 rounded px-3 py-2"
                        />
                        <button onClick={handleAddItem} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">품목 추가</button>
                    </div>

                    <ul className="space-y-1">
                        {form.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                                <span>품목ID: {item.itemsId}, 수량: {item.quantity}, 실측중량: {item.actualWeight}</span>
                                <button onClick={() => handleRemoveItem(index)} className="text-red-600 hover:underline">삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                        {editingId ? '수정하기' : '등록하기'}
                    </button>
                    {editingId && (
                        <button onClick={() => {
                            setEditingId(null);
                            setForm({
                                shipmentId: 0,
                                packingDate: '',
                                totalAmount: 0,
                                totalWeight: 0,
                                comment: '',
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

export default PackingListPage;