import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    placeholder: string;
    options: Option[];
    onSelect: (value: string) => void;
    error?: string; // Optional error prop
    style?: any
}

const CardCustomSelect: React.FC<CustomSelectProps> = ({ value, placeholder, options, onSelect, error, style }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedValue: string) => {
        onSelect(selectedValue);
        setIsOpen(false);
    };

    return (
        <div className="relative border border-[#79747E] rounded-lg">
            {/* Selector */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer text-grey1 text-md bg-transparent outline-none w-full py-1.5 px-2 rounded-lg flex justify-between items-center ${isOpen ? "border-green" : ""
                    } ${style}`}
            >
                <span>{value || placeholder}</span>
                <IoIosArrowDown className="text-lg" />
            </div>

            {/* Dropdown options */}
            {isOpen && (
                <div className="absolute z-10 w-full bg-white border border-bordered shadow-lg rounded-lg mt-0.5">
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

            {/* Error message */}
            {error && <span className="text-sm text-red-500 mt-2">{error}</span>}
        </div>
    );
};

export default CardCustomSelect;
