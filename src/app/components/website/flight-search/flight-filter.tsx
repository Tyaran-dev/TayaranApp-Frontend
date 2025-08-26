'use client';
import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { ArrowUp, DayFilter } from '@/app/svg';
import PriceRange from '../../shared/filter/price-range';
import CheckboxGroup from '../../shared/filter/filter-checkbox-group';
import { AirlineCarrier } from '@/hooks/useSearchflights';
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

interface FlightFilterProps {
    filterPrice: number;
    filterStops: string[];
    airlines: string[] | AirlineCarrier[]; // Accept both formats
    filterDepartureTime: string;
    filterAirlines: string[];
    filterBaggage: string[];
    onPriceChange: (price: number) => void;
    onStopsChange: (stops: string[]) => void;
    onDepartureTimeChange: (departureTime: string) => void;
    onAirlinesChange: (airlines: string[]) => void;
    onBaggageChange: (baggage: string[]) => void;
}

// Define the possible keys for the isExpanded state
type IsExpanded = {
    price: boolean;
    stops: boolean;
    departureTime: boolean;
    airlines: boolean;
    baggage: boolean;
};

const FlightFilter: React.FC<FlightFilterProps> = ({
    filterPrice,
    airlines,
    filterStops,
    filterDepartureTime,
    filterAirlines,
    filterBaggage,
    onPriceChange,
    onStopsChange,
    onDepartureTimeChange,
    onAirlinesChange,
    onBaggageChange,
}) => {
    const t = useTranslations("filters");

    const [isExpanded, setIsExpanded] = useState<IsExpanded>({
        price: true,
        stops: true,
        departureTime: true,
        airlines: true,
        baggage: true,
    });

    const [priceRange, setPriceRange] = useState<[number, number]>([50, 10000]);

    const toggleSection = (section: keyof IsExpanded) => {
        setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const departureTimeOptions = [
        { key: "before_morning", label: t("departuretime.before_morning") },
        { key: "morning", label: t("departuretime.morning") },
        { key: "afternoon", label: t("departuretime.afternoon") },
        { key: "evening", label: t("departuretime.evening") },
    ];

    const stopsOptions = [
        { name: t("stops.any"), code: "Any number of stops" },
        { name: t("stops.direct"), code: "Direct flights only" },
        { name: t("stops.one"), code: "1 stop" },
        { name: t("stops.two_or_more"), code: "2 stops or more" },
    ];

    const baggageOptions = [
        "All baggage options",
        "Checked baggage included",
    ];

    return (
        <div className="w-full scrollbar-hide max-w-xs max-h-screen sticky top-4 overflow-y-auto p-4 mt-4 border rounded-lg shadow-md bg-white">

            {/* Departure Time Filter */}
            <div className="py-3">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('departureTime')}
                >
                    <h4 className="text-base py-2 font-semibold">{t("departuretime.departuretimeheading")}</h4>
                    <span>
                        {isExpanded.departureTime ? (
                            <ArrowUp />
                        ) : (
                            <MdKeyboardArrowDown className="text-2xl" />
                        )}
                    </span>
                </div>
                {/* useEffect here */}
                {isExpanded.departureTime && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {departureTimeOptions.map((time) => (
                            <div
                                key={time.key}
                                className={`border px-2 py-4 rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:shadow transition ${filterDepartureTime === time.key ? 'bg-[#98FFC80A]' : ''
                                    }`}
                                onClick={() => onDepartureTimeChange(time.key)}
                            >
                                <DayFilter />
                                <span className="text-sm text-center">{time.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Filter */}
            <div className="py-3">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('price')}>
                    <h4 className="text-base py-2 font-semibold">{t("price")}</h4>
                    <span>{isExpanded.price ? <ArrowUp /> : <MdKeyboardArrowDown className="text-2xl" />}</span>
                </div>
                {isExpanded.price && (
                    <PriceRange
                        title=""
                        min={50}
                        max={10000}
                        unit="SAR"
                        value={priceRange}
                        onChange={(newValue) => {
                            setPriceRange(newValue);
                            onPriceChange(newValue[1]); // Pass max value to the parent component
                        }}
                    />
                )}
            </div>

            {/* Stops Filter */}
            <CheckboxGroup
                title={t("stops.stopsheading")}
                options={stopsOptions.map((option) => (option))}
                selectedOptions={filterStops}
                onChange={onStopsChange}
            />

            {airlines && airlines.length > 0 && (
                <CheckboxGroup
                    title={t("airlines")}
                    options={airlines.map((airline: any) => ({
                        code: airline.airLineCode || airline,
                        name: airline.name || airline,
                        image: airline.image
                    }))}
                    selectedOptions={filterAirlines}
                    onChange={onAirlinesChange}
                />
            )}

            {/* Baggage Filter */}
            {/* <CheckboxGroup
                title="Baggage"
                options={baggageOptions.map((label) => ({ label }))}
                selectedOptions={filterBaggage}
                onChange={onBaggageChange}
            /> */}
        </div>
    );
};

export default FlightFilter;
