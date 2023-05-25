import Slider, { SliderProps } from "../atoms/Slider";
import SliderTicks from "../atoms/SliderTicks";
import SliderValue from "../atoms/SliderValue";
import FieldWrapper from "../atoms/FieldWrapper";

export interface SliderFieldOptions {
    id: string;
    label?: string;
    showValue?: boolean;
    valueUnit?: string;
    valuePrefix?: string;
    valueOverride?: string;
    minValueDisplay?: string;
    maxValueDisplay?: string;
    decimalPlaces?: number;
    ticks?: number;
    error?: string;
}

const SliderField = ({
    id,
    value,
    onChange,
    onIntervalChange,
    onStartEdit,
    onStopEdit,
    interval = 500,
    min = 0,
    max = 1,
    disabled = false,
    vertical = false,
    trackSize = "0.5rem",
    knobSize = "1.5rem",
    activeColor = "#2ab034",
    inactiveColor = "rgb(200,200,200)",
    label = "",
    showValue = true,
    valueUnit = "",
    valuePrefix = "",
    valueOverride = undefined,
    minValueDisplay = undefined,
    maxValueDisplay = undefined,
    decimalPlaces = 0,
    ticks = 4,
    error = "",
    wholeNumbers = false,
}: SliderProps & SliderFieldOptions): JSX.Element => {
    return (
        <FieldWrapper id={id} label={label} error={error}>
            <SliderValue
                value={value}
                valueUnit={valueUnit}
                valuePrefix={valuePrefix}
                valueOverride={valueOverride}
                minValueDisplay={minValueDisplay}
                maxValueDisplay={maxValueDisplay}
                showValue={showValue}
                decimalPlaces={decimalPlaces}
                min={min}
                max={max}
                className="absolute right-0"
            />
            <div
                className={`relative grid place-items-center ${
                    vertical ? "w-6 h-full" : "w-full h-6"
                } ${ticks && ticks > 0 ? (vertical ? "mr-4" : "mb-10") : ""}`}
            >
                <Slider
                    interval={interval}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    onIntervalChange={onIntervalChange}
                    onStartEdit={onStartEdit}
                    onStopEdit={onStopEdit}
                    disabled={disabled}
                    vertical={vertical}
                    trackSize={trackSize}
                    knobSize={knobSize}
                    activeColor={activeColor}
                    inactiveColor={inactiveColor}
                    wholeNumbers={wholeNumbers}
                />
                <SliderTicks
                    count={ticks}
                    min={min}
                    max={max}
                    vertical={vertical}
                    decimalPlaces={decimalPlaces}
                />
            </div>
        </FieldWrapper>
    );
};

export default SliderField;
