import { getShipment, createShipment, getShipmentsList, updateShipmentStatus, updateShipment } from "../../api/shipment";
import { getOrdersList } from "../../api/ordersApi";
import { getCompanyList } from "../../api/companyApi";
import type { Company } from "../../types/company";
import type { Orders } from "../../types/orders";
import type { Shipment, ShipmentCreateRequest, ShipmentStatus } from "../../types/shipment";
import { useState, useEffect } from "react";
import EntitySelect from "../../components/EntitySelect";
import StatusSelect from "../../components/StatusSelect";

function ShipmentPage() {
    const [ordersList, setOrdersList] = useState<Orders[]>([]);
    const [shipmentList, setShipmentList] = useState<Shipment[]>([]);
    const [buyerId, setBuyerId] = useState(0);
    const [forwarderId, setForwarderId] = useState(0);
    const [shipmentStatus, setShipmentStatus] = useState<ShipmentStatus>();
    const [form, setForm] = useState<ShipmentCreateRequest>({
        ordersId: 0,
        forwarderId: 0,
        fee: 0,
        shipmentDate: '',
    })
    const [editingId, setEditingId] = useState<number | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        fetchCompanies();
        fetchOrders();
    }, [])

    useEffect(() => {
        fetchShipments();
    }, [buyerId, forwarderId, shipmentStatus]);

    const fetchOrders = async () => {
        const data = await getOrdersList(buyerId || undefined);
        setOrdersList(data);
    }

    const fetchShipments = async () => {
        const data = await getShipmentsList(buyerId || undefined, forwarderId || undefined, shipmentStatus || undefined);
        setShipmentList(data);
    }

    const fetchCompanies = async () => {
        const data = await getCompanyList();
        setCompanies(data);
    }

    const handleSubmit = async () => {
        if (editingId) {
            await updateShipment(editingId, form);
        } else {
            await createShipment(form);
        }
        setForm({
            ordersId: 0,
            forwarderId: 0,
            fee: 0,
            shipmentDate: '',
        });
        setEditingId(null);
        fetchShipments();
    }


    const handleEdit = async (shipmentId: number) => {
        const detail = await getShipment(shipmentId);

        setForm({
            ordersId: detail.ordersId,
            forwarderId: detail.forwarderId,
            fee: detail.fee,
            shipmentDate: detail.shipmentDate,
        });
        setEditingId(shipmentId);
    };

    const handleStatusChange = async (shipmentId: number, newStatus: ShipmentStatus) => {
        if (!confirm(`상태를 ${newStatus}(으)로 변경하시겠습니까?`)) return;
        await updateShipmentStatus(shipmentId, newStatus);
        fetchShipments();
    };

    return (
        <div>
            <h2>배송 관리</h2>

            {/* filter */}
            <div>
                <EntitySelect
                    value={buyerId}
                    onChange={setBuyerId}
                    options={companies.filter(c => c.role === 'BUYER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체 바이어"
                />

                <EntitySelect
                    value={forwarderId}
                    onChange={setForwarderId}
                    options={companies.filter(c => c.role === 'FORWARDER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="전체 포워더"
                />

                <StatusSelect
                    value={shipmentStatus ?? ''}
                    onChange={(status) => setShipmentStatus(status as ShipmentStatus || undefined)}
                    options={['PLANNED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']}
                    placeholder="전체 상태"
                />

            </div>

            {/* list */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>오더 ID</th>
                        <th>바이어</th>
                        <th>포워더</th>
                        <th>운임</th>
                        <th>상태</th>
                        <th>선적일</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {shipmentList.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.ordersId}</td>
                            <td>{s.buyerName}</td>
                            <td>{s.forwarderName}</td>
                            <td>{s.fee}</td>
                            <td>
                                <StatusSelect
                                    value={s.status}
                                    onChange={(status) => handleStatusChange(s.id, status as ShipmentStatus)}
                                    options={['PLANNED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']}
                                />
                            </td>
                            <td>{s.shipmentDate}</td>
                            <td>
                                <button onClick={() => handleEdit(s.id)}>수정</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form of create & update */}
            <div>
                <h3>{editingId ? '배송 수정' : '배송 등록'}</h3>

                <EntitySelect
                    value={form.ordersId}
                    onChange={(id) => setForm({ ...form, ordersId: id })}
                    options={ordersList.map(o => ({ id: o.id, label: `#${o.id} - ${o.buyerName}` }))}
                    placeholder="오더 선택"
                />

                <EntitySelect
                    value={form.forwarderId}
                    onChange={(id) => setForm({ ...form, forwarderId: id })}
                    options={companies.filter(c => c.role === 'FORWARDER').map(c => ({ id: c.id, label: c.companyName }))}
                    placeholder="포워더 선택"
                />

                <input
                    type='number'
                    placeholder='운임비'
                    value={form.fee === 0 ? '' : form.fee}
                    onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                />

                <input
                    type='date'
                    value={form.shipmentDate}
                    onChange={(e) => setForm({ ...form, shipmentDate: e.target.value })}
                />

                <button onClick={handleSubmit}>{editingId ? '수정 완료' : '등록'}</button>
                {editingId && <button onClick={() => setEditingId(null)}>취소</button>}
            </div>
        </div>
    );

}

export default ShipmentPage;