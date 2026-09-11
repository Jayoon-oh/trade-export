import type { CompanyCreateRequest } from '../../../types/company';

interface CompanyFormFieldsProps {
    form: CompanyCreateRequest;
    setForm: (form: CompanyCreateRequest) => void;
}

function CompanyFormFields({ form, setForm }: CompanyFormFieldsProps) {
    const roles = ['FORWARDER', 'BUYER', 'SELLER', 'CARRIER'];
    const categories = ['국제운송', '국내운송'];
    const deliveryMethods = ['해상', '항공', '육상'];

    return (
        <>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="회사명" className="border border-gray-300 rounded px-3 py-2" />
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="주소" className="border border-gray-300 rounded px-3 py-2" />
                <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="국가" className="border border-gray-300 rounded px-3 py-2" />
                <input value={form.nameOfOwner} onChange={(e) => setForm({ ...form, nameOfOwner: e.target.value })} placeholder="대표자명" className="border border-gray-300 rounded px-3 py-2" />
                <input value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} placeholder="사업자번호" className="border border-gray-300 rounded px-3 py-2" />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                    <option value="">역할 선택</option>
                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>

            {(form.role === 'FORWARDER' || form.role === 'CARRIER') && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option value="">카테고리 선택</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={form.deliveryMethod} onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                        <option value="">운송방법 선택</option>
                        {deliveryMethods.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            )}
        </>
    );
}

export default CompanyFormFields;