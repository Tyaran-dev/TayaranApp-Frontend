import React, { useState, useEffect, useRef } from "react";

interface Option {
    label: string;
    value: string;
}

interface SelectInputProps {
    label?: string;
    options?: Option[];
    error?: string;
    placeholder?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    style?: string;
}

const CustomSelect: React.FC<SelectInputProps> = ({
    label,
    options = [],
    placeholder,
    value,
    onChange,
    error,
    style
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleSelect = (selectedValue: string) => {
        if (onChange) {
            onChange(selectedValue);
        }
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div ref={selectRef} className="relative w-full h-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer text-grey1 text-md bg-transparent outline-none w-full py-3 px-2 border border-bordered rounded-lg flex justify-center gap-4 items-center ${isOpen ? "border-green" : ""} ${style}`}
            >
                <span>{value || placeholder}</span>
                <div>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1_4858)">
                            <path d="M6.83456 0.329102C3.51783 0.329102 0.829102 3.01783 0.829102 6.33456C0.829102 9.65128 3.51783 12.34 6.83456 12.34C10.1513 12.34 12.84 9.65128 12.84 6.33456C12.84 3.01783 10.1513 0.329102 6.83456 0.329102ZM6.83456 8.96502L3.45331 5.59479L4.01236 5.03389L6.83456 7.8469L9.65675 5.03389L10.2158 5.59479L6.83456 8.96502Z" fill="black" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1_4858">
                                <rect width="12.0109" height="12.0109" fill="white" transform="translate(0.829102 0.329102)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full bg-white max-h-40 overflow-y-auto border border-bordered shadow-lg rounded-lg mt-0.5">
                    {options.map((option, i) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`cursor-pointer px-2 py-1 ${i === 0 ? "rounded-t-lg" : ""
                                } ${i === options.length - 1 ? "rounded-b-lg" : ""} hover:bg-greenGradient hover:text-white transition-colors`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};

export default CustomSelect;
