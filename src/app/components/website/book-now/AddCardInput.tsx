import React from 'react';

interface AddCardInputProps {
    type?: string;
    name: string;
    placeholder: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string; 
}

const AddCardInput: React.FC<AddCardInputProps> = ({ type, name, placeholder, label, value, onChange, error }) => {
    return (
        <div className='border border-[#79747E] relative w-full rounded-md'>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                className='w-full p-2 focus:outline-none rounded-md'
            />
            <span className='absolute -top-4 text-sm left-4 bg-white px-1.5 py-0.5'>{label}</span>
            {error && <span className='text-red-500 mt-2'>{error}</span>}
        </div>
    );
};

export default AddCardInput;
