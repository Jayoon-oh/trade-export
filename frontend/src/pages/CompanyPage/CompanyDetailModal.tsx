import type { Company } from "../../types/company";

interface CompanyDetailModalProps {
    isOpen: boolean;
    company: Company | null;
    onClose: () => void;
}

function CompanyDetailModal({ isOpen, company, onClose }: CompanyDetailModalProps) {
    if (!isOpen || !company) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: 1000
        }}>
            <h3>회사 상세 정보</h3>
            <p><strong>ID:</strong> {company.id}</p>
            <p><strong>회사명:</strong> {company.companyName}</p>
            <p><strong>주소:</strong> {company.address}</p>
            <p><strong>국가:</strong> {company.country}</p>
            <p><strong>대표자:</strong> {company.nameOfOwner}</p>
            <p><strong>역할:</strong> {company.role}</p>
            <p><strong>사업자번호:</strong> {company.registrationNumber}</p>
            {company.category && <p><strong>카테고리:</strong> {company.category}</p>}
            {company.deliveryMethod && <p><strong>운송방법:</strong> {company.deliveryMethod}</p>}

            <button onClick={onClose}>닫기</button>
        </div>
    );
}

export default CompanyDetailModal;