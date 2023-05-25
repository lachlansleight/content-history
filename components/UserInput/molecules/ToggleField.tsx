import FieldWrapper from "../atoms/FieldWrapper";

const ToggleField = ({
    id,
    value,
    label,
    error,
    onChange,
}: {
    id: string;
    value: boolean;
    label?: string;
    error?: string;
    onChange?: (newVal: boolean) => void;
}): JSX.Element => {
    return (
        <FieldWrapper id={id} label={label} error={error} errorMode="left">
            <div
                className={`h-12 w-24 mb-5 border rounded-full ${
                    error
                        ? "border-red-400 border-opacity-40 bg-red-900"
                        : "border-white border-opacity-20 bg-green-700"
                } relative cursor-pointer ${
                    value ? "bg-opacity-100 border-opacity-80" : "bg-opacity-0 border-opacity-20"
                }`}
                style={{
                    transition: "all 0.3s",
                }}
                onClick={() => (onChange ? onChange(!value) : null)}
            >
                <div
                    className={`rounded-full bg-white absolute`}
                    style={{
                        height: "calc(100% - 0.5rem)",
                        width: "2.5rem",
                        top: "0.25rem",
                        transition: "all 0.3s",
                        left: value ? "calc(100% - 2.75rem)" : "0.25rem",
                    }}
                ></div>
            </div>
        </FieldWrapper>
    );
};

export default ToggleField;
