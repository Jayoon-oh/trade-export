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
        <div>
            <h1>회사 조회</h1>
            <select
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
            >
                <option value="">전체</option>
                {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
            <button onClick={fetchCompanies}>검색</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>회사명</th>
                        <th>주소</th>
                        <th>국가</th>
                        <th>사업자번호</th>
                    </tr>
                </thead>
                <tbody>
                    {companyList.map((company) => (
                        <tr key={company.id}>
                            <td>{company.id}</td>
                            <td>{company.companyName}</td>
                            <td>{company.address}</td>
                            <td>{company.country}</td>
                            <td>{company.registrationNumber}</td>
                            <td>
                                <button onClick={() => handleViewDatail(company.id)}>상세</button>
                                <button onClick={() => handleEdit(company)}>수정</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>거래처 등록</h2>
            <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="회사명"
            />
            <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="주소"
            />
            <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="국가"
            />
            <input
                value={form.nameOfOwner}
                onChange={(e) => setForm({ ...form, nameOfOwner: e.target.value })}
                placeholder="대표자명"
            />
            <input
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                placeholder="사업자번호"
            />
            <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
                <option value="">역할 선택</option>
                {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>

            {/* when Role is Forwarder OR Carrier */}
            {(form.role === 'Forwarder' || form.role === 'Carrier') && (
                <>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        <option value="">카테고리 선택</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        value={form.deliveryMethod}
                        onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                    >
                        <option value="">운송방법 선택</option>
                        {deliveryMethods.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </>
            )}

            <button onClick={handleSubmit}>{editingId ? '수정하기' : '신규등록'}</button>

            <CompanyDetailModal
                isOpen={isDetailOpen}
                company={selectedCompany}
                onClose={handleCloseModal}
            />
        </div>


    )
}

export default CompanyPage;