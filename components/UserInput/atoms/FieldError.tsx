const FieldError = ({
    error,
    mode = "right",
}: {
    error?: string;
    mode?: "left" | "right";
}): JSX.Element | null => {
    if (!error) return null;
    return (
        <span
            className={`absolute bottom-0 text-xs text-red-300 w-full ${
                mode === "right" ? "text-right" : "text-left ml-5"
            }`}
        >
            {error}
        </span>
    );
};

export default FieldError;
