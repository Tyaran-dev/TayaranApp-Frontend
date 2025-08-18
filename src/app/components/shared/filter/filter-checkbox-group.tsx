import React from "react";
import Image from "next/image";

export interface Option {
    code?: string;
    name: string;
    image?: string;
}

interface CheckboxGroupProps {
    title: string;
    options: Option[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, options, selectedOptions, onChange }) => {
    const handleCheckboxChange = (code?: string) => {
        if (!code) return; // or throw an error if this should never happen
        console.log(code,"codeeeeeeeeeeeeeeee")

        if (selectedOptions.includes(code)) {
            onChange(selectedOptions.filter((option) => option !== code));
        } else {
            onChange([...selectedOptions, code]);
        }
    };


    return (
        <div className="mb-4">
            <h3 className="font-semibold pb-2">{title}</h3>
            <ul className="mt-2 space-y-2">
                {options.map((option, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <input
                            type="checkbox"
                            className="mr-2 w-5 h-5 accent-green"
                            defaultChecked={option.code ? selectedOptions.includes(option.code) : false}
                            onChange={() => handleCheckboxChange(option.code)}
                        />
                        <span className="text-sm">{option.name}</span>
                        {option.image && (
                            <Image
                                src={option.image}
                                alt={option.name}
                                width={20}
                                height={20}
                                className="ml-2"
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CheckboxGroup;
