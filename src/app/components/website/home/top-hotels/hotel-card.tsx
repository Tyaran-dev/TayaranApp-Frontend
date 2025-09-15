'use client'
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import discounttag from "/public/assets/icons/discount.svg";
import Image from "next/image";
import { Calendar, Clock, Guests, LocationIcon, StarIcon } from "@/app/svg";

// HotelCard Component
interface HotelCardProps {
    image: string;
    title: string;
    location: string;
    price: number;
    guests: string;
    rating: number;
    nights: string;
    discount: number;
    t: (key: string) => string;
}

const HotelCard: React.FC<HotelCardProps> = ({ image, title, location, price, guests, rating, nights, discount ,t}) => {
    const [favourite, setfavourite] = useState(false)
    return (
        <div className=" flex flex-wrap rounded-2xl lg:rounded-3xl ">
            <div className="relative lg:w-2/5 w-full ">
                <img src={image} alt={title} className="w-full  object-cover  lg:rounded-bl-3xl lg:rounded-tl-3xl" />

                <button onClick={() => setfavourite(!favourite)} className="absolute top-2 left-2 bg-white text-lg rounded-2xl p-1 shadow-md">
                    {favourite ? <GoHeartFill className="text-red-500" /> : <GoHeart />}
                </button>
            </div>
            <div className="px-4 py-5 lg:w-3/5 w-full  bg-white lg:rounded-[30px] relative lg:ml-[-20px] z-10">
                {discount > 0 && (

                    <div className="absolute -top-1 right-4 font-medium text-xs  text-black px-2 py-1  rounded">
                        <Image src={discounttag} alt="" className="-z-10 w-10" />
                        <p className="z-10 -mt-8 px-1">
                            -{discount}%
                        </p>
                    </div>
                )}
                <span className="bg-orange text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase">Luxury</span>
                <h3 className="text-lg lg:text-2xl text-black pt-2 font-bold">{title}</h3>
                <p className="text-grayText text-sm">{location}</p>
                <div className="flex items-center gap-2 py-2 justify-between flex-wrap ">
                    <div className="flex items-center gap-1 font-medium  text-base text-grayText ">
                        <Clock />
                        <span>{nights}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium  text-base text-grayText ">
                        {/* ar or en */}
                        <Guests /> {guests} 
                    </div>
                </div>

                <div className="flex items-center gap-2 font-medium  text-base text-grayText ">
                    <Calendar /> 22-08-2024
                </div>

                <div className="flex items-center gap-2 py-2 justify-between flex-wrap ">
                    <div className="flex items-center gap-2 font-medium  text-base text-grayText ">
                        <LocationIcon />
                        <span>Dubai, UAE</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-base text-grayText">
                        {[...Array(rating)].map((_, index) => (
                            <StarIcon key={index} />
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold">${price.toFixed(2)} / night</p>
                    <button className="bg-secondary text-white px-4 py-2 rounded-2xl text-sm">
                    {t("topDeals.bookNowButton")}   
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;