import ReactDatePicker from "react-datepicker";
import FieldWrapper from "../atoms/FieldWrapper";

const DateField = ({
    id,
    value,
    label,
    error,
    onChange,
    className,
    wrapperClassName,
}: {
    id: string;
    value: Date;
    label?: string;
    error?: string;
    onChange?: (newVal: Date) => void;
    className?: string;
    wrapperClassName?: string;
    placeholder?: string;
}): JSX.Element => {
    const handleChange = (date: Date) => {
        if (onChange) onChange(date);
    };

    return (
        <FieldWrapper id={id} label={label} error={error} className={wrapperClassName}>
            <ReactDatePicker
                id={id}
                className={`${className} ${error ? "border-red-400 border-opacity-40" : ""}`}
                wrapperClassName="w-full"
                locale="en-AU"
                onChange={handleChange}
                selected={value}
                dateFormat="dd/MM/yyyy"
            />
        </FieldWrapper>
    );
};

export default DateField;
