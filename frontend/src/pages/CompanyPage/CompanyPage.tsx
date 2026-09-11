import { createCompany, updateCompany, getCompanyList, getCompany } from "../../api/companyApi";
import type { CompanyCreateRequest, Company } from "../../types/company";
import { useState, useEffect } from "react";
import CompanyDetailModal from "./components/CompanyDetailModal";
import CompanyCreateForm from "./components/CompanyCreateForm";
import CompanyEditForm from "./components/CompanyEditForm";

function CompanyPage() {
    const [companyList, setCompanyList] = useState<Company[]>([]);
    const [searchName, setSearchName] = useState('');

    const [searchRole, setSearchRole] = useState('');
    const roles = ['FORWARDER', 'BUYER', 'SELLER', 'CARRIER'];

    // pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // modal for detail of Company
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [view, setView] = useState<'list' | 'new' | 'edit'>('list');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, [currentPage]);

    const fetchCompanies = async () => {
        const data = await getCompanyList(searchRole || undefined, searchName || undefined, currentPage);
        setCompanyList(data.content);
        setTotalPages(data.totalPages);
    }

    // Detail of Company
    const handleViewDatail = async (id: number) => {
        if (!id) {
            alert('회사명을 선택해주세요');
            return;
        }
        try {
            const data = await getCompany(id);
            setSelectedCompany(data);
            setIsDetailOpen(true);
        } catch (error) {
            alert('조회되는 거래처가 없습니다. 이름을 다시 확인해주세요.')
        }
    }

    const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedCompany(null);
};

    return (
        <div className="max-w-6xl mx-auto p-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">회사 조회</h1>

            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
                <button onClick={() => setView('list')} className={view === 'list' ? 'font-semibold text-blue-900' : 'text-gray-500'}>목록</button>
                <button onClick={() => setView('new')} className={view === 'new' ? 'font-semibold text-blue-900' : 'text-gray-500'}>신규 등록</button>
            </div>
            {/* Search section */}
            <div className="flex gap-2 mb-8">
                <input
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            fetchCompanies();
                        }
                    }}
                    placeholder="회사명 검색"
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <select
                    value={searchRole}
                    onChange={(e) => setSearchRole(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">전체</option>
                    {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                <button
                    onClick={fetchCompanies}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    검색
                </button>
            </div>

            {view === 'list' && (
                <>
                    {/* Table */}
                    <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">회사명</th>
                                <th className="px-4 py-3">주소</th>
                                <th className="px-4 py-3">역할</th>
                                <th className="px-4 py-3">국가</th>
                                <th className="px-4 py-3">사업자번호</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        거래처 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                companyList.map((company) => (
                                    <tr key={company.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3">{company.id}</td>
                                        <td className="px-4 py-3">{company.companyName}</td>
                                        <td className="px-4 py-3">{company.address}</td>
                                        <td className="px-4 py-3">{company.role}</td>
                                        <td className="px-4 py-3">{company.country}</td>
                                        <td className="px-4 py-3">{company.registrationNumber}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button onClick={() => handleViewDatail(company.id)} className="text-blue-900 hover:underline">
                                                상세
                                            </button>
                                            <button onClick={() => { setEditingId(company.id); setView('edit'); }} className="text-blue-900 hover:underline">
                                                수정
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                </>
            )}

            {view === 'new' &&
                <CompanyCreateForm onSuccess={() => { setView('list'); fetchCompanies(); }} />
            }
            {view === 'edit' && editingId &&
                <CompanyEditForm companyId={editingId} onSuccess={() => { setView('list'); fetchCompanies(); }} />
            }

            <CompanyDetailModal
                isOpen={isDetailOpen}
                company={selectedCompany}
                onClose={handleCloseModal}
            />
        </div>
    )
}

export default CompanyPage;