'use client'
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface Option {
    label: string;
}

interface CheckboxGroupProps {
    title: string;
    options: Option[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const HotelCheckBox: React.FC<CheckboxGroupProps> = ({ title, options, selectedOptions, onChange }) => {
    // State to track whether each section is expanded or not
    const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({ [title]: true });

    // Function to handle toggle of expand/collapse for each section
    const toggleExpand = (section: string) => {
        setIsExpanded(prevState => ({
            ...prevState,
            [section]: !prevState[section] // Toggle the specific section
        }));
    };

    // Function to handle checkbox change
    const handleCheckboxChange = (label: string) => {
        if (selectedOptions.includes(label)) {
            onChange(selectedOptions.filter(option => option !== label));
        } else {
            onChange([...selectedOptions, label]);
        }
    };

    return (
        <div className="mb-4">
            {/* Header with title and toggle icon */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(title)} // Toggle the specific section by title
            >
                <h4 className="text-base py-2 font-semibold">{title}</h4>
                <span>
                    {/* Rotate arrow based on expanded state */}
                    <MdKeyboardArrowDown
                        className={`text-2xl transition-transform duration-300 ${isExpanded[title] ? 'rotate-180' : ''}`}
                    />
                </span>
            </div>

            {/* Conditionally render checkboxes if expanded */}
            {isExpanded[title] && (
                <ul className="mt-2 space-y-2">
                    {options.map((option, index) => (
                        <li key={index} className="flex items-center w-full ">
                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    className="mr-2 w-5 h-5 accent-green"
                                    defaultChecked={selectedOptions.includes(option.label)}
                                    onChange={() => handleCheckboxChange(option.label)}
                                />
                                <span className="text-sm">{option.label}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HotelCheckBox;
