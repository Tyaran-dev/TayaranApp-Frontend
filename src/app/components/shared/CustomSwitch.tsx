import React, { useState } from 'react';

interface SwitchProps {
    isOn: boolean;
    handleToggle: () => void;
    label: string;
}

const CustomSwitch: React.FC<SwitchProps> = ({ isOn, handleToggle, label }) => {
    return (
        <div className="flex items-center">
            {/* Switch Toggle */}
            <div
                onClick={handleToggle}
                className={`relative w-12 h-5 flex items-center rounded-2xl p-1 cursor-pointer transition-all duration-300 ${isOn ? 'bg-greenGradient' : 'bg-[#DADADA]'
                    }`}
            >
                <div
                    className={`bg-white w-6 h-6 rounded-2xl shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-[-4px]'
                        }`}
                />
            </div>
            {/* Label */}
            <span className="ml-3 md:text-xl font-medium">{label}</span>
        </div>
    );
};

export default CustomSwitch;
