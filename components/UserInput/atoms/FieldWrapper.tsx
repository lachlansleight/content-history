import { ReactNode } from "react";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";

const FieldWrapper = ({
    id,
    label,
    error,
    errorMode = "right",
    className = "",
    children,
}: {
    id: string;
    label?: string;
    error?: string;
    errorMode?: "left" | "right";
    className?: string;
    children: ReactNode;
}): JSX.Element => {
    return (
        <div className={`flex flex-col relative flex-grow ${className}`}>
            <FieldLabel htmlFor={id} label={label} />
            {children}
            <FieldError error={error} mode={errorMode} />
        </div>
    );
};

export default FieldWrapper;
