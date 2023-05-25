import Link from "next/link";
import React, { ReactNode } from "react";

const ButtonLink = ({
    children,
    href,
    className,
    download,
    blank,
    disabled = false,
}: {
    children: ReactNode;
    href: string;
    className?: string;
    download?: string;
    blank?: boolean;
    disabled?: boolean;
}) => {
    if (disabled) {
        return <span className={`button-link-disabled ${className}`}>{children}</span>;
    }

    if (download) {
        return (
            <a href={href} className={`button-link ${className || ""}`} download={download}>
                {children}
            </a>
        );
    } else {
        return (
            <Link
                href={href}
                className={`button-link ${className || ""}`}
                download={download}
                target={blank ? "_blank" : "_self"}
                rel={blank ? "noreferrer" : undefined}
            >
                {children}
            </Link>
        );
    }
};

export default ButtonLink;
