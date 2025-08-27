import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useTranslations, useLocale } from "next-intl";
import { TravelerFormData } from '@/app/[locale]/(root)/book-now/page';
import { monthOptions, nationalityOptions, countryCodesOptions } from "@/app/data/data.js"
interface DateFields {
    day: string;
    month: string;
    year: string;
}

interface TravelerAccordionProps {
    travelers: TravelerFormData[];
    onTravelerUpdate: (index: number, data: TravelerFormData) => void;
}

const TravelerAccordion: React.FC<TravelerAccordionProps> = ({ travelers, onTravelerUpdate }) => {
    const [expandedIndex, setExpandedIndex] = useState<number>(0);
    const locale = useLocale();
    const t = useTranslations("bookNow");

    // Generate year options from 1915 to 2025
    const yearOptions = Array.from({ length: 111 }, (_, i) => 2025 - i);
    const passportYearOptions = Array.from({ length: 11 }, (_, i) => 2025 + i)


    // Generate day options
    const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleToggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? -1 : index);
    };

    // Validation function for English names only
    const isValidEnglishName = (name: string): boolean => {
        const englishNameRegex = /^[a-zA-Z\s'-]+$/;
        return englishNameRegex.test(name) || name === '';
    };

    const updateTravelerData = (index: number, field: string, value: string) => {
        // Validate English names for firstName, middleName, and lastName
        if (['firstName', 'middleName', 'lastName'].includes(field)) {
            if (!isValidEnglishName(value)) {
                return; // Don't update if validation fails
            }
        }

        const updatedTraveler = { ...travelers[index] };

        if (field.includes('.')) {
            const [parent, child] = field.split('.') as [keyof TravelerFormData, keyof DateFields];

            if (parent === 'dateOfBirth' || parent === 'passportExpiry') {
                updatedTraveler[parent] = {
                    ...updatedTraveler[parent],
                    [child]: value
                };
            }
        } else {
            const key = field as keyof Omit<TravelerFormData, 'dateOfBirth' | 'passportExpiry'>;
            if (key in updatedTraveler) {
                (updatedTraveler[key] as string) = value;
            }
        }

        updatedTraveler.isCompleted = checkTravelerCompletion(updatedTraveler);
        onTravelerUpdate(index, updatedTraveler);
    };

    const checkTravelerCompletion = (traveler: TravelerFormData): boolean => {
        return !!(
            traveler.firstName &&
            traveler.lastName &&
            traveler.dateOfBirth.day &&
            traveler.dateOfBirth.month &&
            traveler.dateOfBirth.year &&
            traveler.nationality &&
            traveler.passportNumber &&
            traveler.issuanceCountry &&
            traveler.passportExpiry.day &&
            traveler.passportExpiry.month &&
            traveler.passportExpiry.year &&
            traveler.email &&
            traveler.phoneNumber
        );
    };

    const getTravelerDisplayName = (traveler: TravelerFormData, index: number): string => {
        if (traveler.firstName && traveler.lastName) {
            return `${traveler.title} ${traveler.firstName} ${traveler.lastName}`;
        }
        return `Traveler`;
    };

    const getTravelerDateOfBirth = (traveler: TravelerFormData): string => {
        if (traveler?.dateOfBirth?.day && traveler?.dateOfBirth?.month && traveler?.dateOfBirth?.year) {
            const monthName = monthOptions.find(m => m.value === traveler.dateOfBirth.month)?.label || traveler.dateOfBirth.month;
            return `${traveler.dateOfBirth.day} ${monthName} ${traveler.dateOfBirth.year}`;
        }
        return '';
    };

    const CustomSelect: React.FC<{
        value: string;
        required: boolean;
        onChange: (value: string) => void;
        options: Array<{ value?: string; label?: string; country?: string, arabicName?: string }> | number[];
        placeholder: string;
        className?: string;
        searchable?: boolean;
    }> = ({ value, onChange, options, placeholder, className = '', searchable = false, required = true }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');

        const filteredOptions = searchable && Array.isArray(options) && typeof options[0] === 'object'
            ? (options as Array<{ value: string; label: string }>).filter(option =>
                option.label?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : options;

        const displayValue = Array.isArray(options) && typeof options[0] === 'object'
            ? (options as Array<{ value: string; label: string }>).find(opt => opt.value === value)?.label || placeholder
            : value || placeholder;

        return (
            <div className={`relative ${className}`}>
                <div
                    className="w-full  py-1 text-sm px-4 md:py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer transition-colors hover:border-stone-400 flex items-center justify-between"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={value ? 'text-stone-900' : 'text-stone-500'}>
                        {displayValue}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border  border-stone-300 rounded-lg shadow-lg max-h-60 md:overflow-hidden">
                        {searchable && (
                            <div className="p-2 border-b w-full  bg-white border-stone-200">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full  px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onClick={(e) => e.stopPropagation()}
                                    required={required}
                                />
                            </div>
                        )}
                        <div className="max-h-48 w-full overflow-y-auto bg-white">
                            {Array.isArray(filteredOptions) && typeof filteredOptions[0] === 'object'
                                ? (filteredOptions as Array<{ value: string; label: string }>).map((option, indx) => (
                                    <div
                                        key={indx}
                                        className="px-4  py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-stone-100 last:border-b-0"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                ))
                                : (filteredOptions as number[]).map((option) => (
                                    <div
                                        key={option}
                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-stone-100 last:border-b-0"
                                        onClick={() => {
                                            onChange(option.toString());
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="space-y-4">
            {travelers.map((traveler: any, index: number) => (
                <div key={traveler.travelerId} className="border border-stone-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div
                        className="flex items-center justify-between p-4 rounded-lg text-white bg-emerald-800 cursor-pointer hover:from-stone-100 hover:to-stone-200 transition-all duration-200"
                        onClick={() => handleToggle(index)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-200 mx-2 ${traveler.isCompleted
                                ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg"
                                : "bg-white"
                                }`}>
                                {traveler.isCompleted ? (
                                    <Check className="w-4 h-4 text-white" />
                                ) : (
                                    <span className="text-md  text-emerald-800 font-bold">{index + 1}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg capitalize">
                                    {getTravelerDisplayName(traveler, index)}
                                </h3>
                                {getTravelerDateOfBirth(traveler) && (
                                    <p className="text-sm text-white font-medium">{getTravelerDateOfBirth(traveler)}</p>
                                )}
                                {!traveler.isCompleted && expandedIndex !== index && (
                                    <p className="text-sm text-orange-600">
                                        {t("errors.requiredField")} : {traveler.travelerType}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className={`transform transition-transform duration-200 ${expandedIndex === index ? "rotate-180" : ""}`}>
                            <ChevronDown className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {expandedIndex === index && (
                        <div className="p-6 border-t border-stone-200 bg-white space-y-8">
                            <div className="rounded-lg p-6">
                                <h4 className="text-xl font-semibold text-stone-900 mb-6 flex items-center">
                                    {t("personalDetails.title")}
                                </h4>

                                <div className="flex gap-3 mb-6">
                                    {["Mr", "Ms", "Mrs"].map((title) => (
                                        <button
                                            key={title}
                                            type="button"
                                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${traveler.title === title
                                                ? "bg-emerald-800 text-white shadow-lg transform scale-105"
                                                : "bg-white border-2 border-stone-200 text-stone-700 hover:border-[#1C1466] hover:shadow-md"
                                                }`}
                                            onClick={() => updateTravelerData(index, "title", title)}
                                        >
                                            {t(`personalDetails.titleOptions.${title.toLowerCase()}`)}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {["firstName", "middleName", "lastName"].map((field, i) => (
                                        <div key={field}>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                                                {t(`personalDetails.${field}`)}
                                            </label>
                                            <input
                                                type="text"
                                                required={field !== "middleName"}
                                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1C1466] focus:border-[#1C1466] transition-colors"
                                                value={traveler[field] || ""}
                                                onChange={(e) => updateTravelerData(index, field, e.target.value)}
                                                placeholder={t(`personalDetails.${field}`)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-sm font-semibold text-stone-700 mb-3">
                                        {t("personalDetails.dateOfBirth")}
                                    </h5>
                                    <div className="grid grid-cols-3 gap-4">
                                        <CustomSelect
                                            value={traveler?.dateOfBirth?.day || ""}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "dateOfBirth.day", value)}
                                            options={dayOptions}
                                            placeholder={t("personalDetails.dayPlaceholder")}
                                        />
                                        <CustomSelect
                                            value={traveler?.dateOfBirth?.month || ""}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "dateOfBirth.month", value)}
                                            options={monthOptions}
                                            placeholder={t("personalDetails.monthPlaceholder")}
                                        />
                                        <CustomSelect
                                            value={traveler?.dateOfBirth?.year || ""}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "dateOfBirth.year", value)}
                                            options={yearOptions}
                                            placeholder={t("personalDetails.yearPlaceholder")}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                                        {t("personalDetails.nationality")}
                                    </label>
                                    <CustomSelect
                                        value={traveler.nationality}
                                        required={true}
                                        onChange={(value) => {
                                            updateTravelerData(index, "nationality", value);
                                            console.log(value, "nationalty")

                                        }}
                                        options={nationalityOptions}
                                        placeholder={t("personalDetails.nationality")}
                                        searchable={true}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-6">
                                <h4 className="text-xl font-semibold text-stone-900 mb-6 flex items-center">
                                    {t("travelDocument.title")}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                                            {t("travelDocument.documentType")}
                                        </label>
                                        <input
                                            type="text"
                                            value="Passport"
                                            disabled
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-stone-100 text-stone-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                                            {t("travelDocument.passportNumber")}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1C1466] focus:border-[#1C1466] transition-colors"
                                            value={traveler.passportNumber}
                                            onChange={(e) => updateTravelerData(index, "passportNumber", e.target.value)}
                                            placeholder={t("travelDocument.passportNumber")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                                            {t("travelDocument.issuingCountry")}
                                        </label>
                                        <CustomSelect
                                            value={traveler.issuanceCountry}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "issuanceCountry", value)}
                                            options={countryCodesOptions.map((country) => ({
                                                value: country.flag,
                                                label: locale === "en" ? `${country.country}` : `${country.arabicName}`,
                                            }))}
                                            placeholder={t("travelDocument.issuingCountry")}
                                            searchable={true}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="text-sm font-semibold text-stone-700 mb-3">
                                        {t("travelDocument.expiryDate")}
                                    </h5>
                                    <div className="grid grid-cols-3 gap-4">
                                        <CustomSelect
                                            value={traveler?.passportExpiry?.day || ""}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "passportExpiry.day", value)}
                                            options={dayOptions}
                                            placeholder={t("personalDetails.dayPlaceholder")}
                                        />
                                        <CustomSelect
                                            value={traveler?.passportExpiry?.month || ""}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "passportExpiry.month", value)}
                                            options={monthOptions}
                                            placeholder={t("personalDetails.monthPlaceholder")}
                                        />
                                        <CustomSelect
                                            value={traveler?.passportExpiry?.year || ""}
                                            required={true}
                                            onChange={(value) => updateTravelerData(index, "passportExpiry.year", value)}
                                            options={passportYearOptions}
                                            placeholder={t("personalDetails.yearPlaceholder")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {index === 0 && (
                                <div className="rounded-lg p-6">
                                    <h4 className="text-xl font-semibold text-stone-900 mb-6 flex items-center">
                                        {t("contactDetails.title")}
                                    </h4>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                                            {t("contactDetails.email")}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1C1466] focus:border-[#1C1466] transition-colors"
                                            value={traveler.email}
                                            onChange={(e) => updateTravelerData(index, "email", e.target.value)}
                                            placeholder={t("contactDetails.email")}
                                        />
                                        <p className="text-sm text-stone-600 mt-2">{t("contactDetails.emailNote")}</p>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                                                {t("contactDetails.phoneCode")}
                                            </label>
                                            <CustomSelect
                                                value={traveler.phoneCode}
                                                required={true}
                                                onChange={(value) => updateTravelerData(index, "phoneCode", value)}
                                                options={countryCodesOptions.map((country) => ({
                                                    value: country.code,
                                                    label: locale === "en" ? `${country.country} ${country.code}` : `${country.arabicName} ${country.code}`,
                                                }))}
                                                placeholder="+1"
                                                searchable={true}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                                                {t("contactDetails.phoneNumber")}
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1C1466] focus:border-[#1C1466] transition-colors"
                                                value={traveler.phoneNumber}
                                                onChange={(e) => updateTravelerData(index, "phoneNumber", e.target.value)}
                                                placeholder={t("contactDetails.phoneNumber")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TravelerAccordion;
