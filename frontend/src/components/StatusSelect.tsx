interface StatusSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
}

const STATUS_COLORS: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-600 border-green-300',
    DELIVERED: 'bg-green-100 text-green-600 border-green-300',
    PENDING: 'bg-amber-100 text-amber-600 border-amber-300',
    PLANNED: 'bg-amber-100 text-amber-600 border-amber-300',
    CANCELLED: 'bg-red-100 text-red-600 border-red-300',
};

function StatusSelect({ value, onChange, options, placeholder }: StatusSelectProps) {
    const colorClass = STATUS_COLORS[value] ?? 'bg-white text-gray-800 border-gray-300';

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`border rounded px-3 py-2 font-medium ${colorClass}`}
        >
            {placeholder && <option value=''>{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    )
}

export default StatusSelect;