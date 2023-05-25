import { ReactNode, MouseEvent } from "react";

const Button = ({
    children,
    className,
    onClick,
    type,
    disabled = false,
}: {
    children: ReactNode;
    className?: string;
    onClick?: (event: MouseEvent) => void;
    type?: "submit" | "button" | "reset";
    disabled?: boolean;
}) => {
    return (
        <button
            className={`${disabled ? "btn-disabled " : "btn-enabled "}${className}`}
            onClick={onClick}
            type={type || "button"}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
