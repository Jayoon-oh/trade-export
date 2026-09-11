import { useState, useEffect } from 'react';
import { createShipment, updateShipment, getShipment } from '../../../api/shipmentApi';
import { getAllCompanies } from '../../../api/companyApi';
import EntitySelect from '../../../components/EntitySelect';
import OrderSelectModal from './OrderSelectModal';
import type { Company } from '../../../types/company';
import type { ShipmentCreateRequest } from '../../../types/shipment';

interface ShipmentQuickEditCardProps {
    shipmentId: number | null;
    onSuccess: () => void;
    onCancel: () => void;
}

function ShipmentQuickEditCard({ shipmentId, onSuccess, onCancel }: ShipmentQuickEditCardProps) {
    const [form, setForm] = useState<ShipmentCreateRequest>({
        ordersId: 0, forwarderId: 0, fee: 0, shipmentDate: ''
    });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedOrderLabel, setSelectedOrderLabel] = useState('');
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    useEffect(() => {
        fetchCompanies();
        if (shipmentId) {
            fetchDetail();
        }
    }, [shipmentId]);

    const fetchCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    };

    const fetchDetail = async () => {
        if (!shipmentId) return;
        const detail = await getShipment(shipmentId);
        setForm({
            ordersId: detail.ordersId,
            forwarderId: detail.forwarderId,
            fee: detail.fee,
            shipmentDate: detail.shipmentDate,
        });
        setSelectedOrderLabel(`#${detail.orderNumber} - ${detail.buyerName}`);
    };

    const handleSubmit = async () => {
        if (!form.ordersId) { alert('오더를 선택해주세요.'); return; }
        if (!form.forwarderId) { alert('포워더 선택해주세요.'); return; }
        if (!form.fee) { alert('운임비 입력해주세요.'); return; }
        if (!form.shipmentDate) { alert('날짜를 선택해주세요.'); return; }

        try {
            if (shipmentId) {
                await updateShipment(shipmentId, form);
            } else {
                await createShipment(form);
            }
            onSuccess();
        } catch (error: any) {
            alert('저장에 실패했습니다.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-80">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">{shipmentId ? '선적' : '선적 등록'}</h3>

            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(true)}
                    className="border border-gray-300 rounded px-3 py-2 text-left text-gray-700 text-sm"
                >
                    {selectedOrderLabel || '오더 선택'}
                </button>

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
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />

                <input
                    type='date'
                    value={form.shipmentDate}
                    onChange={(e) => setForm({ ...form, shipmentDate: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={handleSubmit} className="bg-blue-900 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-800">
                    저장
                </button>
                <button onClick={onCancel} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300">
                    취소
                </button>
            </div>

            <OrderSelectModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                onSelect={(orderId, orderNumber, buyerName) => {
                    setForm({ ...form, ordersId: orderId });
                    setSelectedOrderLabel(`#${orderNumber} - ${buyerName}`);
                    setIsOrderModalOpen(false);
                }}
            />
        </div>
    );
}

export default ShipmentQuickEditCard;