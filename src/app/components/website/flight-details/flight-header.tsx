'use client'
import React, { useState } from "react";
import ParaHeading from "../../shared/para-heading";
import SubHeading from "../../shared/subHeading";
import { Location, LocationIcon } from "@/app/svg";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { BsShareFill } from "react-icons/bs";
import Button from "../../shared/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { getAirportByIATA } from "@/utils/airports-helper";

type FlightHeaderProps = {
    data: {
        airline: string;
        location: string;
        reviews: string;
        rating: number;
        price: string;
    };
};

const FlightHeader = ({flightData}:any) => {
    // const { airline, location, reviews, rating, price } = data;
    const [fav, setfav] = useState(false)
    const searchParams = useSearchParams()
    const adults = searchParams.get("adults")
    const router = useRouter();

    return (
        <div className="flex items-center px-4 py-6 justify-between flex-wrap  rounded-lg">
            {/* Header Section */}
            <div className="w-full lg:w-1/2 mb-4 space-y-3">
                <ParaHeading className="!text-black !font-bold">{getAirportByIATA(flightData.itineraries[0].segments[0].departure.iataCode)}</ParaHeading>
                <div className="flex items-center gap-3">
                    <LocationIcon />
                    {/* <SubHeading className="!text-black">{location}</SubHeading> */}

                </div>
                <div className="flex justify-start items-center mt-2">
                    {/* <p className="text-black flex justify-center items-center p-3 text-lg font-medium border-2 border-green rounded-lg ">{rating.toFixed(1)}</p> */}
                    {/* <span className="text-black lg:text-xl font-semibold text-sm ml-2">{reviews}</span> */}
                </div>
            </div>

            {/* Price Section */}
            <div className="space-y-3  w-full  lg:w-1/5">
                <ParaHeading className="!text-black !font-bold !text3xl">{flightData?.price.currency} {flightData?.price.total}</ParaHeading>
                <div className="flex items-center gap-5">
                    <button onClick={() => setfav(!fav)} className="text-green flex justify-center items-center p-2  text-2xl font-medium border-2 border-green  rounded-lg ">{fav ? <RiHeart3Fill /> : <RiHeart3Line />}</button>

                    <button className="text-green flex justify-center items-center p-2  text-2xl font-medium border-2 border-green  rounded-lg "> <BsShareFill /> </button>
                    <Button onClick={() => router.push(`/book-now?adults=${adults}`)} label="Book Now" style="!bg-greenGradient !text-center !min-w-32" />

                </div>

            </div>
        </div>
    );
};

export default FlightHeader;
