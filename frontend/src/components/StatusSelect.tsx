interface StatusSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
}

function StatusSelect({ value, onChange, options, placeholder }: StatusSelectProps) {
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            {placeholder && <option value=''>{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    )
}

export default StatusSelect;