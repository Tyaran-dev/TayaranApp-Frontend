// components/PriceRange.tsx
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface PriceRangeProps {
    title?: string; // Optional title for the slider
    min: number; // Minimum value for the slider
    max: number; // Maximum value for the slider
    unit: string; // Unit of measurement (e.g., USD, SAR)
    value?: [number, number]; // Initial range value
    onChange?: (newValue: [number, number]) => void; // Callback for value changes
    setPeopleCount?: (newRange: { min: number; max: number }) => void; // Optional additional handler
}

const PriceRange: React.FC<PriceRangeProps> = ({
    title,
    min,
    max,
    unit,
    value = [min, max], // Default value to full range if not provided
    onChange,
    setPeopleCount,
}) => {
    const [rangeValues, setRangeValues] = React.useState<[number, number]>(value);

    // Handle slider changes
    const handleSliderChange = (newValue: number | number[]) => {
        if (Array.isArray(newValue) && newValue.length === 2) {
            const range = newValue as [number, number]; // Explicitly cast to [number, number]
            setRangeValues(range); // Update local state
            if (onChange) onChange(range); // Trigger onChange callback if provided
            if (setPeopleCount) {
                setPeopleCount({
                    min: range[0],
                    max: range[1],
                });
            }
        }
    };
    return (
        <div className="mb-4">
            {title && <h3 className="font-semibold">{title}</h3>}

            <div className="mt-4">
                <Slider
                    range
                    min={min}
                    max={max}
                    value={rangeValues}
                    onChange={handleSliderChange}
                    className="w-full"
                    trackStyle={[{ backgroundColor: "#026C34" }]}
                    handleStyle={[
                        { borderColor: "#026C34", backgroundColor: "#026C34" },
                        { borderColor: "#026C34", backgroundColor: "#026C34" },
                    ]}
                />
            </div>
            <div className="flex items-center text-sm justify-between mt-2">
                <span>{`${rangeValues[0]} ${unit}`}</span>
                <span>{`${rangeValues[1]} ${unit}`}</span>
            </div>
        </div>
    );
};

export default PriceRange;
