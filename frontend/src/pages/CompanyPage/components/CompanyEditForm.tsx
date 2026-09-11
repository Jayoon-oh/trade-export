import { useState, useEffect } from 'react';
import { getCompany, updateCompany } from '../../../api/companyApi';
import CompanyFormFields from './CompanyFormFields';
import type { CompanyCreateRequest } from '../../../types/company';

interface CompanyEditFormProps {
    companyId: number;
    onSuccess: () => void;
}

const emptyForm: CompanyCreateRequest = {
    companyName: '', address: '', country: '', nameOfOwner: '', role: '',
    registrationNumber: '', partnerDate: '', category: '', deliveryMethod: '', logoPath: '', signaturePath: ''
};

function CompanyEditForm({ companyId, onSuccess }: CompanyEditFormProps) {
    const [form, setForm] = useState<CompanyCreateRequest>(emptyForm);

    useEffect(() => {
        fetchDetail();
    }, [companyId]);

    const fetchDetail = async () => {
        const data = await getCompany(companyId);
        const { id, ...formData } = data;
        setForm(formData);
    };

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
            await updateCompany(companyId, form);
            onSuccess();
        } catch (error) {
            alert('거래처 수정에 실패했습니다.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">거래처 수정</h2>
            <CompanyFormFields form={form} setForm={setForm} />
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 mt-4">
                수정 완료
            </button>
        </div>
    );
}

export default CompanyEditForm;