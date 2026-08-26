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
        <div>
            <h1>재고 조회</h1>
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="품목명 검색"
            />
            <button onClick={fetchStock}>검색</button>

            <h2>품목 등록</h2>
            <input value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                placeholder='제품명'
            />
            <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder='가격'
            />
            <input
                type="number"
                value={form.setQty}
                onChange={(e) => setForm({ ...form, setQty: Number(e.target.value) })}
                placeholder='세트 수'
            />
            <input
                type="number"
                value={form.standardWeight}
                onChange={(e) => setForm({ ...form, standardWeight: Number(e.target.value) })}
                placeholder='무게'
            />
            <button onClick={handleCreate}>등록하기</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제품명</th>
                        <th>수량</th>
                    </tr>
                </thead>
                <tbody>
                    {stockList.map((stock) => (
                        <tr key={stock.id}>
                            <td>{stock.id}</td>
                            <td>{stock.productName}</td>
                            <td>{stock.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StockPage;