import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

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
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<SelectInputProps> = ({
  label,
  options = [],
  placeholder,
  value,
  onChange,
  error,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  console.log(value)

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
    <div ref={selectRef} className="flex flex-col w-full">
      {label && <label className="block text-[#12121299]">{label}</label>}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-pointer text-grey1 text-sm bg-transparent outline-none w-full py-1.5 px-2  flex justify-between items-center ${className} ${isOpen ? "border-green" : ""
            }`}
        >
          <span>{value || placeholder}</span>
          <IoIosArrowDown className="text-lg" />
        </div>
        {isOpen && (
          <div className="absolute min-w-48 z-10 w-full bg-white border border-bordered shadow-lg rounded-lg mt-0.5">
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
    </div>
  );
};

export default CustomSelect;
