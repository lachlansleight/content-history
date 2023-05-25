import { FaCheck } from "react-icons/fa";

const Checkbox = ({
    containerClassName,
    checkClassName,
    checked,
    onChange,
}: {
    containerClassName?: string;
    checkClassName?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}): JSX.Element => {
    const handleClick = () => {
        if (onChange) onChange(checked ? false : true);
    };

    return (
        <div className={`checkbox-container ${containerClassName}`} onClick={handleClick}>
            {checked ? <FaCheck className={`checkbox-check ${checkClassName}`} /> : null}
        </div>
    );
};

export default Checkbox;
