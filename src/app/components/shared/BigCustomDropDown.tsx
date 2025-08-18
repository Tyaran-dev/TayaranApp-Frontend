'use client'
import { BlueArrowDownIcon, GreenTickIcon } from "@/app/svg";
import React, { useState, useRef, useEffect } from "react";

interface BigCustomDropdownProps {
    value: string; // Selected value
    options: string[]; // Dropdown options
    onChange: (value: string) => void; // Callback when value changes
}

const BigCustomDropdown: React.FC<BigCustomDropdownProps> = ({
    value,
    options,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false); // Close dropdown after selection
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Selected Option */}
            <div
                className="flex items-center justify-between bg-white  p-3 cursor-pointer"
                onClick={toggleDropdown}
            >
                <div className="flex items-center gap-3">
                    {/* Green Check Icon */}
                    <GreenTickIcon />
                    <span className="font-bold sm:text-4xl text-2xl">{value}</span>
                </div>

                {/* Blue Dropdown Arrow */}
                <div
                    className={`transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    <BlueArrowDownIcon />
                </div>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <ul className="absolute top-full left-0 w-full bg-white border border-bordered rounded shadow-lg mt-1 z-10">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-greenGradient hover:text-white text-lg font-semibold cursor-pointer"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BigCustomDropdown;
