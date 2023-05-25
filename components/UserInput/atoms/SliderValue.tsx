import { roundNumber } from "lib/text";

const SliderValue = ({
    className = "",
    value,
    valueUnit = "",
    valuePrefix = "",
    valueOverride = undefined,
    min = 0,
    max = 1,
    showValue = true,
    minValueDisplay = undefined,
    maxValueDisplay = undefined,
    decimalPlaces = 0,
    vertical = false,
}: {
    className?: string;
    value: number | [number, number];
    valuePrefix?: string;
    valueUnit?: string;
    valueOverride?: string;
    min?: number;
    max?: number;
    showValue?: boolean;
    minValueDisplay?: string;
    maxValueDisplay?: string;
    decimalPlaces?: number;
    vertical?: boolean;
}): JSX.Element | null => {
    if (!(vertical || showValue)) return null;

    const getDisplayValue = (val: number): string => {
        if (valueOverride != null) {
            console.log(JSON.stringify({ valueOverride }));
            return valueOverride;
        }
        if (val === min && minValueDisplay != null) return minValueDisplay;
        if (val === max && maxValueDisplay != null) return maxValueDisplay;
        return (valuePrefix || "") + roundNumber(val, decimalPlaces) + (valueUnit || "");
    };

    return (
        <div className={`flex justify-between ${className}`}>
            <p className="whitespace-nowrap text-xs">
                {typeof value === "number"
                    ? getDisplayValue(value)
                    : getDisplayValue(value[0]) + " - " + getDisplayValue(value[1])}
            </p>
        </div>
    );
};

export default SliderValue;
