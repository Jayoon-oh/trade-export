import { useState, useEffect } from 'react';
import { getStockList } from '../../api/stockApi';
import type { Stock } from '../../types/stock';
import type { ItemsCreateRequest } from '../../types/items';
import { createItems } from '../../api/itemsApi';

function StockPage() {
    const [stockList, setStockList] = useState<Stock[]>([]);
    const [form, setForm] = useState<ItemsCreateRequest>({
        productName: '',
        price: 0,
        setQty: 0,
        standardWeight: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        const data = await getStockList(searchTerm || undefined);
        setStockList(data);
    };

    const handleCreate = async () => {
        const savedId = await createItems(form);
        console.log('등록된 id:', savedId);
        setForm({ productName: '', price: 0, setQty: 0, standardWeight: 0 });
        fetchStock();
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">재고 조회</h1>

            {/* Search section */}
            <div className="flex gap-2 mb-8">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="품목명 검색"
                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                />
                <button
                    onClick={fetchStock}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    검색
                </button>
            </div>

            {/* Registration section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">품목 등록</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <input value={form.productName}
                        onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        placeholder='제품명'
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        placeholder='가격'
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        type="number"
                        value={form.setQty}
                        onChange={(e) => setForm({ ...form, setQty: Number(e.target.value) })}
                        placeholder='세트 수'
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        type="number"
                        value={form.standardWeight}
                        onChange={(e) => setForm({ ...form, standardWeight: Number(e.target.value) })}
                        placeholder='무게'
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                    등록하기
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-600">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">제품명</th>
                        <th className="px-4 py-3">수량</th>
                    </tr>
                </thead>
                <tbody>
                    {stockList.map((stock) => (
                        <tr key={stock.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{stock.id}</td>
                            <td className="px-4 py-3">{stock.productName}</td>
                            <td className="px-4 py-3">{stock.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StockPage;