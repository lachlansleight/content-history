const FieldLabel = ({
    htmlFor,
    label,
}: {
    htmlFor: string;
    label?: string;
}): JSX.Element | null => {
    if (!label) return null;
    return (
        <label className="mb-1 text-xs" htmlFor={htmlFor}>
            {label}
        </label>
    );
};

export default FieldLabel;
