import type { Company } from "../../types/company";

interface CompanyDetailModalProps {
    isOpen: boolean;
    company: Company | null;
    onClose: () => void;
}

function CompanyDetailModal({ isOpen, company, onClose }: CompanyDetailModalProps) {
    if (!isOpen || !company) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">회사 상세 정보</h3>

                <table className="w-full border-collapse mb-4">
                    <tbody>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 w-32">ID</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.id}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">회사명</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.companyName}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">주소</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.address}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">국가</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.country}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">대표자</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.nameOfOwner}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">역할</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.role}</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">사업자번호</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{company.registrationNumber}</td>
                        </tr>
                        {company.category && (
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">카테고리</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{company.category}</td>
                            </tr>
                        )}
                        {company.deliveryMethod && (
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">운송방법</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{company.deliveryMethod}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    닫기
                </button>
            </div>
        </div>
    );
}

export default CompanyDetailModal;