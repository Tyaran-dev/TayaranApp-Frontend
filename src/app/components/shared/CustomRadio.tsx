import React from 'react';

interface CustomRadioProps {
    label?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
    label,
    name,
    value,
    checked,
    onChange,
}) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="radio"
                name={name}
                value={value}
                defaultChecked={checked}
                onChange={onChange}
                className="hidden"
            />
            <span
                className={`w-5 h-5 inline-block rounded-2xl border-2 flex items-center justify-center ${checked ? 'border-green-500' : 'border-gray-300'
                    }`}
            >
                {checked && <span className="w-3 h-3 bg-green-500 rounded-2xl"></span>}
            </span>
            <span className="ml-2 text-gray-800">{label}</span>
        </label>
    );
};

export default CustomRadio;
