"use client";
import Section from "@/app/components/shared/section";
import HotelHeader from "@/app/components/website/hotel-details/HotelHeader";
import Tabs from "@/app/components/website/hotel-details/Tabs";
import React from "react";
import i1 from "/public/assets/hotels/hd1.png";
import i2 from "/public/assets/hotels/hd2.png";
import i3 from "/public/assets/hotels/hd3.png";
import i4 from "/public/assets/hotels/hd4.png";
import i5 from "/public/assets/hotels/hd5.png";
import Image from "next/image";
import RoomChoices from "@/app/components/website/hotel-details/RoomChoices";
import WeekendDeals from "@/app/components/website/flight-details/WeekendDeals";
import AminitiesSection from "@/app/components/website/hotel-details/AminitiesSection";
import Reviews from "@/app/components/website/hotel-details/Reviews";
import { Hotel } from "@/redux/hotels/hotelsSlice";
import PhotosSection from "./PhotoSection";
// import FAQs from '@/app/components/website/hotel-details/FAQs';

interface HotelDetailsProps {
  hotel: Hotel;
  availableRooms: any[]; // Replace `any[]` with your actual room type if you have one
}

const HotelDetails = ({ hotel, availableRooms }: HotelDetailsProps) => {
  const data = {
    airline: "Ramada Plaza by Wyndham Istanbul City Center Adults Only",
    location: "Halaskargazi Cad No 63",
    reviews: "Very Good 54 reviews",
    rating: 4.2,
    price: "$240",
    images: [i1, i2, i3, i4, i5],
    // featureImages: [f1, f2, f3, f4, f5, f6, f1, f2, f3, f4, f5, f6, f1, f2, f3, f4, f5, f6, f1, f2, f3, f4, f5, f6],
  };


  console.log(hotel,"Hotellllllllllllllllllll")

  const tabs = [
    { id: "photos", label: "Photos" },
    { id: "room-choices", label: "Room Choices" },
    { id: "reviews", label: "Reviews" },
    { id: "amenities", label: "Amenities" },
    { id: "faqs", label: "FAQs" },
    { id: "attractions", label: "Attractions" },
    { id: "about-property", label: "About The Property" },
    { id: "similar-properties", label: "Similar Properties" },
  ];

  // console.log(hotel, "hotel")

  const amenities = hotel.HotelFacilities;

  // console.log("----👩‍💻👨‍🎤", hotel);
  return (
    <Section>
      <HotelHeader data={hotel} />
      {/* <div className="my-5">
        <Tabs tabs={tabs} />
      </div> */}

      {/* photos */}
      {hotel?.Images && (
        <PhotosSection images={hotel.Images} />

      )}

      <div className="mt-8 w-full">
        <RoomChoices rooms={availableRooms} />
      </div>

      <div className="mt-8 ">
        <AminitiesSection aminities={amenities} count={14} />
      </div>

      {/* <div className="mt-8 ">
        <WeekendDeals />
      </div>

      <div className="mt-8 ">
        <Reviews />
      </div> */}

      <div className="mt-8 ">{/* <FAQs /> */}</div>
    </Section>
  );
};

export default HotelDetails;
