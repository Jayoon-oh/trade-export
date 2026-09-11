import { useState } from 'react';
import { createCompany } from '../../../api/companyApi';
import CompanyFormFields from './CompanyFormFields';
import type { CompanyCreateRequest } from '../../../types/company';

interface CompanyCreateFormProps {
    onSuccess: () => void;
}

const emptyForm: CompanyCreateRequest = {
    companyName: '', address: '', country: '', nameOfOwner: '', role: '',
    registrationNumber: '', partnerDate: '', category: '', deliveryMethod: '', logoPath: '', signaturePath: ''
};

function CompanyCreateForm({ onSuccess }: CompanyCreateFormProps) {
    const [form, setForm] = useState<CompanyCreateRequest>(emptyForm);

    const handleSubmit = async () => {
        if (!form.companyName.trim()) { alert('회사명을 입력해주세요.'); return; }
        if (!form.address.trim()) { alert('주소를 입력해주세요.'); return; }
        if (!form.country.trim()) { alert('국가를 입력해주세요.'); return; }
        if (!form.nameOfOwner.trim()) { alert('대표자명을 입력해주세요.'); return; }
        if (!form.role) { alert('역할을 선택해주세요.'); return; }
        if (form.registrationNumber && !/^[\d-]+$/.test(form.registrationNumber)) {
            alert('사업자번호는 숫자와 하이픈(-)만 입력 가능합니다.');
            return;
        }

        try {
            await createCompany(form);
            onSuccess();
        } catch (error) {
            alert('거래처 등록에 실패했습니다.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">거래처 등록</h2>
            <CompanyFormFields form={form} setForm={setForm} />
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4">
                등록하기
            </button>
        </div>
    );
}

export default CompanyCreateForm;