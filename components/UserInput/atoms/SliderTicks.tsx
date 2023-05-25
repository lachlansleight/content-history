import { useMemo, useRef } from "react";
import { roundNumber } from "lib/text";
import useElementDimensions from "lib/hooks/useElementDimensions";

const SliderTicks = ({
    count = 4,
    vertical = false,
    min = 0,
    max = 1,
    decimalPlaces = 0,
}: {
    count?: number;
    vertical?: boolean;
    min?: number;
    max?: number;
    decimalPlaces?: number;
}): JSX.Element | null => {
    if (!count || count === 0) return null;
    const containerDiv = useRef<HTMLDivElement>(null);
    const { width } = useElementDimensions(containerDiv);

    const tickPositions = useMemo(() => {
        const values: number[] = [];
        const minT = min === 1 ? 0 : min;
        for (let i = 0; i <= count + 1; i++) {
            const t = i / (count + 1);
            const value = minT + (max - minT) * t;
            values.push(value);
        }
        return values.map(v => {
            const t = Math.max(0, (v - min) / (max - min));
            return {
                value: v,
                position: 10 + (width - 32) * t,
            };
        });
    }, [count, min, max, width]);

    return (
        <div
            className={`absolute w-full h-full left-0 bottom-0.5 z-0 text-neutral-500 ${
                vertical ? "flex-col pl-1" : "pl-2"
            }`}
            ref={containerDiv}
        >
            {tickPositions.map((tick, i) => {
                return (
                    <div
                        className={`absolute flex items-center ${vertical ? "" : "flex-col"}`}
                        style={{
                            left: tick.position,
                        }}
                        key={"slider_" + i}
                    >
                        <span>{vertical ? "—" : "|"}</span>
                        <span className="text-xs">
                            {roundNumber(
                                min === 1 && tick.value === 0 ? 1 : tick.value,
                                decimalPlaces || 0
                            )}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default SliderTicks;
