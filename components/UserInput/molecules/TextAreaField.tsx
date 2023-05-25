import FieldWrapper from "../atoms/FieldWrapper";

const TextAreaField = ({
    id,
    value,
    label,
    error,
    onChange,
    onRawChange,
    className,
    placeholder = "",
    rows = 5,
}: {
    id: string;
    value: string;
    label?: string;
    error?: string;
    onChange?: (newVal: string) => void;
    onRawChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    placeholder?: string;
    rows?: number;
}): JSX.Element => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onRawChange) onRawChange(e);
        if (onChange) onChange(e.target.value);
    };

    return (
        <FieldWrapper id={id} label={label} error={error}>
            <textarea
                className={`${className || ""} ${error ? "border-red-400 border-opacity-40" : ""}`}
                id={id}
                value={value}
                onChange={handleChange}
                autoComplete={"off"}
                placeholder={placeholder}
                rows={rows}
            ></textarea>
        </FieldWrapper>
    );
};

export default TextAreaField;
