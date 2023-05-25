import FieldWrapper from "../atoms/FieldWrapper";

export type SelectOption = {
    value: string | number;
    label: string;
};

const SelectField = ({
    id,
    value,
    options,
    label,
    error,
    onChange,
    onRawChange,
    className,
}: {
    id: string;
    value: string | number;
    options: SelectOption[];
    label?: string;
    error?: string;
    onChange?: (newVal: SelectOption) => void;
    onRawChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}): JSX.Element => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onRawChange) onRawChange(e);
        if (onChange) onChange(options.find(o => String(o.value) === e.target.value) || options[0]);
    };

    if (options.length === 0) return <></>;

    return (
        <FieldWrapper id={id} label={label} error={error}>
            <select
                id={id}
                value={value}
                onChange={handleChange}
                className={`${className} ${error ? "border-red-400 border-opacity-40" : ""}`}
            >
                {options.map(o => (
                    <option key={String(o.value)} value={String(o.value)}>
                        {o.label}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    );
};

export default SelectField;
