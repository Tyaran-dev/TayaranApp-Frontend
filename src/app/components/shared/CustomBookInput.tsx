import React from 'react'

type CustomInputProps = {
    label?: string;
    style?: string;
    value?: string;
    inputType?: string;
    placeholder?: string;
    onChange?: (e: any) => void;
    name?: string;
    error?: string;
};

const CustomBookInput = (props: CustomInputProps) => {

    const { label, inputType, placeholder, name, style, error, onChange, value, } = props;
    return (
        <div className='border border-bordered rounded-xl p-2 py-3' >
            <input
                type={inputType}
                name={name}
                id=""
                value={value}
               onChange={onChange}
                placeholder={placeholder}
                className='placeholder:text-black sm:text-lg w-full h-full outline-none px-2'
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    )
}

export default CustomBookInput
