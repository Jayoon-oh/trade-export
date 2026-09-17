import type { Stock } from '../../../types/stock';

interface StockDetailModalProps {
    isOpen: boolean;
    stock: Stock | null;
    onClose: () => void;
}

function StockDetailModal({ isOpen, stock, onClose }: StockDetailModalProps) {
    if (!isOpen || !stock) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">제품 상세 정보</h3>

                <table className="w-full border-collapse mb-4">
                    <tbody>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 w-32">ID</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.id}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">제품명</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.productName}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">가격</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.price?.toLocaleString() ?? '-'}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">세트 수</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.setQty ?? '-'}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">무게</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.standardWeight ?? '-'} kg</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">전체 수량</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.quantity}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">예약된 수량</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.reservedQuantity}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">잔여 수량</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{stock.quantity - stock.reservedQuantity}</td>
                        </tr>
                    </tbody>
                </table>

                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    닫기
                </button>
            </div>
        </div>
    );
}

export default StockDetailModal;