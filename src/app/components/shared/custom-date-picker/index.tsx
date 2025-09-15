import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoChevronBackSharp } from "react-icons/io5";
import { LuCalendar } from "react-icons/lu";

interface CustomDatePickerProps {
    label?: string;
    className?: string;
    placeholder?: string;
    value: Date | null;
    minDate?: Date | null;  // Changed from Date | undefined
    maxDate?: Date | null;  // Also updated for consistency
    onChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    label,
    className,
    placeholder,
    value,
    minDate,
    maxDate,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false); // State to control visibility
    const [tempDate, setTempDate] = useState<Date | null>(value); // Store temporary date for month/year navigation
    const toggleDatePicker = () => setIsOpen((prev) => !prev); // Toggle open/close state

    const handleDayClick = (date: Date | null) => {
        onChange(date);
        setIsOpen(false); // Close on day selection
    };

    const handleMonthChange = (date: Date | null) => {
        // Don't trigger a date selection; only change the month view.
        setTempDate(date); // Update temp date without selecting it
    };

    useEffect(() => {
        // Ensure that the initial value of the tempDate is set correctly
        if (value) {
            setTempDate(value);
        }
    }, [value]);

    return (
        <div className="custom-date-picker w-full text-grayText relative">
            {label && <label className="block mb-2 text-sm ">{label}</label>}
            <div
                className={`flex items-center justify-between px-3 w-full mx-auto py-2.5 text-base text-grayText cursor-pointer ${className}`}
                onClick={toggleDatePicker} // Toggle on click
            >
                <p className="font-medium text-sm text-black">
                    {value
                        ? new Date(value).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })
                        : placeholder || "Select a date"}
                </p>
                <LuCalendar size={18} className="dark:text-primary text-darkGreen" />
            </div>
            {isOpen && ( // Conditionally render the DatePicker
                <div className="absolute z-10 top-14">
                    <DatePicker
                        selected={tempDate || value} // Use tempDate for month/year navigation
                        onChange={handleDayClick} // Handle day selection
                        inline
                        minDate={minDate || undefined}   // ✅ ensures it's Date | undefined
                        maxDate={maxDate || undefined}
                        calendarStartDay={1}
                        onMonthChange={handleMonthChange} // Handle month change without selecting a date
                        onYearChange={handleMonthChange} // Handle year change without selecting a date
                        renderCustomHeader={({
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        }) => (
                            <div className="flex justify-between items-center mb-3">
                                {/* Previous Month Button */}
                                <div
                                    className="bg-emerald-600 w-6 h-6 rounded-2xl flex items-center justify-center cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        decreaseMonth(); // Go to the previous month
                                    }}
                                    aria-disabled={prevMonthButtonDisabled}
                                >
                                    <IoChevronBackSharp className="text-white" />
                                </div>

                                {/* Current Month and Year */}
                                <span className="text-sm font-semibold">
                                    {tempDate?.toLocaleString("default", {
                                        month: "long",
                                        year: "numeric",
                                    }) || value?.toLocaleString("default", {
                                        month: "long",
                                        year: "numeric",
                                    }) || "Select a month"}
                                </span>

                                {/* Next Month Button */}
                                <div
                                    className="bg-emerald-600 w-6 h-6 rounded-2xl flex items-center justify-center cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        increaseMonth(); // Go to the next month
                                    }}
                                    aria-disabled={nextMonthButtonDisabled}
                                >
                                    <IoChevronBackSharp className="text-white rotate-180" />
                                </div>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
