'use client'
import React from "react";
import FlightHeader from "@/app/components/website/flight-details/flight-header";
import Section from "@/app/components/shared/section";
import i1 from "/public/assets/flights/a1.png";
import i2 from "/public/assets/flights/a2.png";
import i3 from "/public/assets/flights/a3.png";
import i4 from "/public/assets/flights/a4.png";
import i5 from "/public/assets/flights/a5.png";
import f1 from "/public/assets/flights/fe1.png";
import f2 from "/public/assets/flights/fe2.png";
import f3 from "/public/assets/flights/fe3.png";
import f4 from "/public/assets/flights/fe4.png";
import f5 from "/public/assets/flights/fe5.png";
import f6 from "/public/assets/flights/fe6.png";
import Image from "next/image";
import Heading from "@/app/components/shared/heading";
import FlightClassSelect from "@/app/components/website/flight-details/flight-class-select";
import FlightCard from "@/app/components/website/flight-details/flight-card";
import PriceCards from "@/app/components/website/flight-details/Price-cards";
import { useSelector } from "react-redux";

const data = {
    airline: "Kuwait International Airport (KWI)",
    location: "Gümüssuyu Mah. İnönü Cad. No:8, Istanbul 34437",
    reviews: "Very Good 54 reviews",
    rating: 4.5,
    price: "$240",
    images: [i1, i2, i3, i4, i5],
    featureImages: [f1, f2, f3, f4, f5, f6, f1, f2, f3, f4, f5, f6, f1, f2, f3, f4, f5, f6, f1, f2, f3, f4, f5, f6],
};

const FlightDetails = () => {
    const flightData = useSelector((state:any)=>state.data.value)
    console.log("fl",flightData)

    return (
        <div>
            <Section>
                <div className=" py-10 ">
                    {
                        flightData ? 
                        <FlightHeader data={data} flightData={flightData} />
                        :
                        <p>Loading...</p>
                    }
                    

                    <div className="mt-8 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-3 ">
                        {data.images?.map((item, i: number) => (
                            <div key={i} className="mb-8 sm:break-inside-avoid">
                                <blockquote className="rounded-lg shadow-sm ">
                                    <Image src={item} alt='' width={500} height={600} className="object-cover w-full" />
                                </blockquote>
                            </div>
                        ))}

                    </div>

                    <div className="mt-8  ">
                        <div className="flex flex-wrap justify-between items-center gap-5">
                            <Heading className="!text-black">Basic Economy Features</Heading>
                            <FlightClassSelect />
                        </div>
                        <div className="mt-8  ">

                            <div className="slider py-3 w-full ">
                                <div className="slide-track">
                                    {data.featureImages?.map((item, i: number) => (
                                        <div key={i} className="mb-8 sm:break-inside-avoid">
                                            <Image src={item} alt='' width={500} height={600} className="px-4 rounded-lg w-full" />

                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <FlightCard />
                    </div>
                </div>
            </Section>
            <div className="mt-8 bg-[#FBFBFB]">
                <PriceCards />
            </div>
        </div>
    );
};

export default FlightDetails;
