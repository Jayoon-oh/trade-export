import { getPackingList, createPackingList, deletePackingList, getPackingLists, handleGeneratePackingList, updatePackingList } from "../../api/packingListApi"
import type { Items } from "../../types/items"
import type { Company } from "../../types/company"
import { getCompanyList } from "../../api/companyApi";
import { getItemsList } from "../../api/itemsApi";
import { useState, useEffect } from "react"
import type { PackingListCreateRequest, PackingListItemRequest, PackingListResponse } from "../../types/packingList";
import type { Shipment } from "../../types/shipment";
import { getShipmentsList } from "../../api/shipment";

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
        <div>
            <h1>패킹리스트 등록</h1>

            <button onClick={fetchPackingLists}>검색</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>회사명</th>
                        <th>운송사</th>
                        <th>포장날짜</th>
                        <th>총수량</th>
                        <th>총무게</th>
                        <th>등록날짜</th>
                        <th>수정날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {packingList.map((packingList) => (
                        <tr key={packingList.id}>
                            <td>{packingList.id}</td>
                            <td>{packingList.buyerName}</td>
                            <td>{packingList.forwarderName}</td>
                            <td>{packingList.packingDate}</td>
                            <td>{packingList.totalAmount}</td>
                            <td>{packingList.totalWeight}</td>
                            <td>{packingList.createdAt}</td>
                            <td>{packingList.updatedAt}</td>
                            <td>
                                <button onClick={() => handleEdit(packingList.id)}>수정</button>
                                <button onClick={() => handleDelete(packingList.id)}>삭제</button>
                                <button onClick={() => handleGeneratePackingList(packingList.id)}>패킹리스트 다운로드</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>패킹리스트 등록</h2>
            <select
                value={form.shipmentId}
                onChange={(e) => setForm({ ...form, shipmentId: Number(e.target.value) })}
            >
                <option value={0}>선적 선택</option>
                {shipmentList.map((s) => (
                    <option key={s.id} value={s.id}>#{s.id} - {s.buyerName}</option>
                ))}
            </select>
            <input
                type="date"
                value={form.packingDate}
                onChange={(e) => setForm({ ...form, packingDate: e.target.value })}
                placeholder="포장일"
            />
            <input
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="특이사항"
            />

            <h3>품목 추가</h3>
            <select
                value={currentItem.itemsId}
                onChange={(e) => setCurrentItem({ ...currentItem, itemsId: Number(e.target.value) })}
            >
                <option value={0}>품목 선택</option>
                {itemsList.map((item) => (
                    <option key={item.id} value={item.id}>{item.productName}</option>
                ))}
            </select>
            <input
                type="number"
                value={currentItem.quantity || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                placeholder="수량"
            />
            <input
                type="number"
                value={currentItem.actualWeight || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, actualWeight: Number(e.target.value) })}
                placeholder="실측 중량"
            />
            <button onClick={handleAddItem}>품목 추가</button>

            <ul>
                {form.items.map((item, index) => (
                    <li key={index}>
                        품목ID: {item.itemsId}, 수량: {item.quantity}, 실측중량: {item.actualWeight}
                        <button onClick={() => handleRemoveItem(index)}>삭제</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit}>{editingId ? '수정하기' : '등록하기'}</button>

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
                }}>
                    수정 취소
                </button>
            )}
        </div>
    )
}

export default PackingListPage;