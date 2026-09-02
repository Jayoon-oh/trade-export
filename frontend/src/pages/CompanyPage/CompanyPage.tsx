import { createCompany, updateCompany, getCompanyList, getCompany } from "../../api/companyApi";
import type { CompanyCreateRequest, Company } from "../../types/company";
import { useState, useEffect } from "react";
import CompanyDetailModal from "./CompanyDetailModal";

function CompanyPage() {
    const [companyList, setCompanyList] = useState<Company[]>([]);
    const [form, setForm] = useState<CompanyCreateRequest>({
        companyName: '',
        address: '',
        country: '',
        nameOfOwner: '',
        role: '',

        registrationNumber: '',
        partnerDate: '',
        category: '',
        deliveryMethod: '',
        logoPath: '',
        signaturePath: ''
    })
    const [searchRole, setSearchRole] = useState('');
    const roles = ['Forwarder', 'Buyer', 'Seller', 'Carrier'];
    const categories = ['국제운송', '국내운송'];
    const deliveryMethods = ['해상', '항공', '육상'];
    const [editingId, setEditingId] = useState<number | null>(null);


    // modal for detail of Company
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        const data = await getCompanyList(searchRole || undefined);
        setCompanyList(data);
    }

    // Detail of Company
    const handleViewDatail = async (id: number) => {
        const data = await getCompany(id);
        setSelectedCompany(data);
        setIsDetailOpen(true);
    }

    const handleCloseModal = () => {
        setIsDetailOpen(false);
        setSelectedCompany(null);
    }

    // Editing & Creating
    const handleSubmit = async () => {
        if (editingId) {
            await updateCompany(editingId, form);
        } else {
            await createCompany(form);
        }
        setForm({
            companyName: '',
            address: '',
            country: '',
            nameOfOwner: '',
            role: '',

            registrationNumber: '',
            partnerDate: '',
            category: '',
            deliveryMethod: '',
            logoPath: '',
            signaturePath: ''
        });
        setEditingId(null);
        fetchCompanies();
    }

    const handleEdit = (company: Company) => {
        const { id, ...formData } = company;
        setForm(formData);
        setEditingId(id);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">회사 조회</h1>

            {/* Search section */}
            <div className="flex gap-2 mb-8">
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

            {/* Table */}
            <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm text-gray-600">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">회사명</th>
                        <th className="px-4 py-3">주소</th>
                        <th className="px-4 py-3">국가</th>
                        <th className="px-4 py-3">사업자번호</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {companyList.map((company) => (
                        <tr key={company.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">{company.id}</td>
                            <td className="px-4 py-3">{company.companyName}</td>
                            <td className="px-4 py-3">{company.address}</td>
                            <td className="px-4 py-3">{company.country}</td>
                            <td className="px-4 py-3">{company.registrationNumber}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <button
                                    onClick={() => handleViewDatail(company.id)}
                                    className="text-blue-900 hover:underline"
                                >
                                    상세
                                </button>
                                <button
                                    onClick={() => handleEdit(company)}
                                    className="text-blue-900 hover:underline"
                                >
                                    수정
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Registration section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">거래처 등록</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <input
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder="회사명"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="주소"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="국가"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        value={form.nameOfOwner}
                        onChange={(e) => setForm({ ...form, nameOfOwner: e.target.value })}
                        placeholder="대표자명"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                        value={form.registrationNumber}
                        onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                        placeholder="사업자번호"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">역할 선택</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                {/* when Role is Forwarder OR Carrier */}
                {(form.role === 'Forwarder' || form.role === 'Carrier') && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={form.deliveryMethod}
                            onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">운송방법 선택</option>
                            {deliveryMethods.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                    {editingId ? '수정하기' : '신규등록'}
                </button>
            </div>

            <CompanyDetailModal
                isOpen={isDetailOpen}
                company={selectedCompany}
                onClose={handleCloseModal}
            />
        </div>


    )
}

export default CompanyPage;