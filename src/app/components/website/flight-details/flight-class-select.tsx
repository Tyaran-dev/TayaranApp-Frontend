// components/CustomCheckboxGroup.tsx
'use client'
import { CheckIcon } from '@/app/svg';
import React, { useState } from 'react';

type Option = {
    label: string;
    value: string;
};

const options: Option[] = [
    { label: 'Economy', value: 'economy' },
    { label: 'First Class', value: 'firstClass' },
    { label: 'Business Class', value: 'businessClass' },
];

const FlightClassSelect: React.FC = () => {
    const [selected, setSelected] = useState<string>('economy');

    const handleSelect = (value: string) => {
        setSelected(value);
    };

    return (
        <div className="flex gap-4">
            {options.map((option) => (
                <label
                    key={option.value}
                    className="flex items-center cursor-pointer gap-2"
                >
                    <input
                        type="checkbox"
                        defaultChecked={selected === option.value}
                        onChange={() => handleSelect(option.value)}
                        className="hidden"
                    />
                    <div
                        className={`w-6 h-6 flex items-center justify-center border-2 rounded ${selected === option.value
                            ? 'bg-orange border-orange'
                            : 'border-green'
                            }`}
                    >
                        {selected === option.value && (
                            <CheckIcon />
                        )}
                    </div>
                    <span className="text-black font-medium">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default FlightClassSelect;
