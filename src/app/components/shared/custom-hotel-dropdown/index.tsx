import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface DropdownWithSearchProps {
    label: string;
    options: { Code: string; Name: string }[];
    selectedOption: string;
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
    label,
    options,
    selectedOption,
    setSelectedOption,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredOptions = options.filter((option) =>
        option.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col">
            <label>{label}</label>
            <div className="relative">
                <div
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer text-md bg-transparent outline-none w-full py-1.5 px-2 flex justify-between items-center"
                >
                    {isOpen ? (
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-2 py-1 border-b border-gray-300 focus:outline-none"
                        />
                    ) : (
                        <span>
                            {selectedOption
                                ? options.find((c) => c.Code === selectedOption)?.Name
                                : placeholder}
                        </span>
                    )}
                    <IoIosArrowDown className="text-lg" />
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full max-h-[300px] overflow-auto bg-white border shadow-lg border-borderColor rounded-sm mt-0.5">
                        {filteredOptions.map((option) => (
                            <div
                                key={option.Code}
                                onClick={() => {
                                    setSelectedOption(option.Code);
                                    setIsOpen(false);
                                }}
                                className="cursor-pointer p-2 hover:bg-gray-200"
                            >
                                {option.Name}
                            </div>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="p-2 text-gray-500">No options found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropdownWithSearch;
