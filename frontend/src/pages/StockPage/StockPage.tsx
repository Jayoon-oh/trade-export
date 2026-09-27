import { useState, useEffect } from 'react';
import { getStockList } from '../../api/stockApi';
import type { Stock } from '../../types/stock';
import StockQuickEditCard from './components/StockQuickEditCard';
import StockDetailModal from './components/StockDetailModal';

function StockPage() {
    const [stockList, setStockList] = useState<Stock[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');

    //register card
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    // Item detail card
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchStock();
    }, [currentPage]);

    const fetchStock = async () => {
        const data = await getStockList(searchTerm || undefined, currentPage);
        setStockList(data.content);
        setTotalPages(data.totalPages);
    };

    // Reset card
    const handleOpenNew = () => {
        setCardKey(prev => prev + 1);
        setIsCardOpen(true);
    };

    const handleViewDetail = (stock: Stock) => {
        setSelectedStock(stock);
        setIsDetailOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">재고 조회</h1>

            {/* Search section */}
            <div className="flex gap-2 mb-8">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            fetchStock();
                        }
                    }}
                    placeholder="품목명 검색"
                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                />
                <button
                    onClick={fetchStock}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    검색
                </button>
                <button onClick={handleOpenNew} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">
                    + 품목 등록
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    {/* Table */}
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">제품명</th>
                                <th className="px-4 py-3">수량</th>
                                <th className="px-4 py-3">예약 수량</th>
                                <th className="px-4 py-3">가격(KRW)</th>
                                <th className="px-4 py-3">무게(kg)</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockList.map((stock) => (
                                <tr key={stock.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">{stock.productName}</td>
                                    <td className="px-4 py-3">{stock.quantity}</td>
                                    <td className="px-4 py-3">{stock.reservedQuantity}</td>
                                    <td className="px-4 py-3">{stock.price.toLocaleString()}</td>
                                    <td className="px-4 py-3">{stock.standardWeight}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleViewDetail(stock)} className="text-blue-900 hover:underline">제품 상세</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mb-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            이전
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-600">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            다음
                        </button>
                    </div>
                </div>

                {isCardOpen && (
                    <StockQuickEditCard
                        key={cardKey}
                        onSuccess={() => { setIsCardOpen(false); fetchStock(); }}
                        onCancel={() => setIsCardOpen(false)}
                    />
                )}
                <StockDetailModal
                    isOpen={isDetailOpen}
                    stock={selectedStock}
                    onClose={() => { setIsDetailOpen(false); setSelectedStock(null); }}
                />


            </div>
        </div >
    )
}

export default StockPage;