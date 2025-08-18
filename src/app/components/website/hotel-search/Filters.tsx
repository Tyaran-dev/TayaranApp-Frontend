'use client'
import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import PriceRange from '../../shared/filter/price-range';
import HotelCheckBox from '../../shared/filter/HotelCheckBox';


// Define the props interface for the Filters component
interface FiltersProps {
    priceRange: [number, number];
    onPriceRangeChange: (newValue: [number, number]) => void;
    selectedHotelOptions: string[];
    onHotelOptionsChange: (selected: string[]) => void;
    selectedStarRatingOptions: string[];
    onStarRatingOptionsChange: (selected: string[]) => void;
    selectedGuestRatingOptions: string[];
    onGuestRatingOptionsChange: (selected: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
    priceRange,
    onPriceRangeChange,
    selectedHotelOptions,
    onHotelOptionsChange,
    selectedStarRatingOptions,
    onStarRatingOptionsChange,
    selectedGuestRatingOptions,
    onGuestRatingOptionsChange,
}) => {
    const [isExpanded, setIsExpanded] = useState({ price: true });

    return (
        <div className='w-[25%] bg-white p-4' style={{ boxShadow: '0px 0px 20px 0px #0000001A' }}>
            <h1 className='font-semibold font-lg'>Filters</h1>

            {/* Price Filter */}
            <div className="py-3">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(prev => ({ ...prev, price: !prev.price }))}>
                    <h4 className="text-base py-2 font-semibold">Price Range</h4>
                    <span>{isExpanded.price ? <MdKeyboardArrowDown className="text-2xl rotate-180" /> : <MdKeyboardArrowDown className="text-2xl" />}</span>
                </div>
                {isExpanded.price && (
                    <PriceRange
                        title=""
                        min={10}
                        max={1000}
                        unit="SAR"
                        value={priceRange}
                        onChange={onPriceRangeChange}
                    />
                )}
            </div>

            {/* Property Name */}
            <div className="flex flex-col mb-4">
                <h4 className="text-base py-2 font-semibold">Property Name</h4>
                <div className='border border-grayDark flex items-center gap-2 rounded-2xl py-2 px-4'>
                    <FiSearch className='text-lg flex-shrink-0' />
                    <input type="text" placeholder='Search' className='w-full flex-1 outline-none' />
                </div>
            </div>

            {/* Available Hotels */}
            <HotelCheckBox
                title="Available hotels"
                options={[{ label: 'Available hotels' }]}
                onChange={onHotelOptionsChange}
                selectedOptions={selectedHotelOptions}
            />

            {/* Star Rating */}
            <HotelCheckBox
                title="Star rating"
                options={[
                    { label: '5 stars' },
                    { label: '4 stars' },
                    { label: '3 stars' },
                    { label: '2 stars' },
                    { label: '1 stars' },
                    { label: 'Unrated' },
                ]}
                onChange={onStarRatingOptionsChange}
                selectedOptions={selectedStarRatingOptions}
            />

            {/* Guest Rating */}
            <HotelCheckBox
                title="Guest rating"
                options={[
                    { label: '6+ Excellent' },
                    { label: '5+ Excellent' },
                    { label: '4+ Excellent' },
                    { label: '3+ Excellent' },
                    { label: '2+ Excellent' },
                    { label: '1+ Excellent' },
                ]}
                onChange={onGuestRatingOptionsChange}
                selectedOptions={selectedGuestRatingOptions}
            />

        </div>
    );
};

export default Filters;