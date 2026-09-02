interface EntitySelectOption {
    id: number;
    label: string;
}

interface EntitySelectProps {
    value: number;
    onChange: (id: number) => void;
    options: EntitySelectOption[];
    placeholder: string;
    disabled?: boolean;
}

function EntitySelect({ value, onChange, options, placeholder, disabled }: EntitySelectProps) {
    return (
        <select value={value} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled}>
            <option value={0}>{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
        </select>
    )
}

export default EntitySelect;