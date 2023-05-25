import FieldWrapper from "../atoms/FieldWrapper";

const TextField = ({
    id,
    value,
    label,
    error,
    onChange,
    onRawChange,
    className,
    wrapperClassName = "",
    placeholder = "",
    onFocus,
    onBlur,
}: {
    id: string;
    value: string;
    label?: string;
    error?: string;
    onChange?: (newVal: string) => void;
    onRawChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    wrapperClassName?: string;
    placeholder?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}): JSX.Element => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onRawChange) onRawChange(e);
        if (onChange) onChange(e.target.value);
    };

    return (
        <FieldWrapper id={id} label={label} error={error} className={wrapperClassName}>
            <input
                className={`${className || ""} ${error ? "border-red-400 border-opacity-40" : ""}`}
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                autoComplete={"off"}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </FieldWrapper>
    );
};

export default TextField;
