export function formatDateOnly(isoString: string | null) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
}


export default formatDateOnly;