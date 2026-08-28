import type { InvoiceResponse } from "../../../types/invoice";

interface InvoiceHistoryModalProps {
    isOpen: boolean;
    history: InvoiceResponse[];
    onClose: () => void;
    onCancel: (inoiceId: number) => void;
    onDownload: (invoieId: number) => void;
}

function InvoiceHistoryModal({ isOpen, history, onClose, onCancel, onDownload }: InvoiceHistoryModalProps) {
    if (!isOpen) return null;

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
            <h3>인보이스 발행 이력</h3>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>상태</th>
                        <th>발행일</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.invoiceNumber}</td>
                            <td>{invoice.status}</td>
                            <td>{invoice.invoiceDate}</td>
                            <button onClick={() => onDownload(invoice.id)}>PDF</button>
                            <button onClick={() => onCancel(invoice.id)}>취소</button>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onClose}>닫기</button>
        </div>
    );
}

export default InvoiceHistoryModal;