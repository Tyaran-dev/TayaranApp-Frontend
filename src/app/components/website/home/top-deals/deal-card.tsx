'use client';
import React from 'react';
import Image from 'next/image';
import { StarIcon } from '@/app/svg';

interface HotelCardProps {
    image: string;
    title: string;
    arTitle:string;
    location: string;
    arLocation: string;
    price: number;
    guests: string;
    arGuests: string;
    rating: number;
    reviews: string;
    arReviwes: string;
    nights: string;
    arNights: string;
    discount?: number;
    t: (key: string) => string;
}

const DealCard: React.FC<HotelCardProps> = ({
    image,
    title,
    arTitle,
    location,
    arLocation,
    price,
    guests,
    arGuests,
    rating,
    reviews,
    arReviwes,
    nights,
    arNights,
    discount,
    t
}) => {
    return (
        <div className="border bg-white border-[#D2D2D2] p-3 rounded-xl">
            {/* Image Section */}
            <div className="relative w-full h-48">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-t-xl"
                />

            </div>

            {/* Content Section */}
            <div className="p-4 bg-white rounded-b-xl">
                {/* ar or en */}
                <p className="text-sm ">{location}</p>
                <h3 className="text-lg lg:text-2xl font-semibold text-black">{title}</h3>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex bg-green text-white px-4 rounded-2xl items-center gap-1 text-sm">
                        {rating}
                    </div>
                    <p className="text-sm font-medium">{reviews}</p>
                </div>

                {/* Price Section */}
                <p className="text-lg font-bold text-black mt-2">${price.toFixed(2)} </p>
                <p className="text-sm text-grayText">
                    Per night <br />
                    SAR 2,542 total <br /> Include taxes & fees
                </p>

                {/* CTA Button */}
                <button className="bg-orange lg:w-3/4 text-white px-4 py-2 mt-4 rounded-2xl w-full text-sm">
                    {t("weekendDeals.dealsButton")}
                </button>
            </div>
        </div>
    );
};

export default DealCard;
