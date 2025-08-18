'use client';

import React, { useState } from "react";
import ParaHeading from "../../shared/para-heading";
import SubHeading from "../../shared/subHeading";
import { LocationIcon } from "@/app/svg";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { BsShareFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { MdStar } from "react-icons/md";
import { useTranslations } from "next-intl";

type HotelHeaderProps = {
  data: {
    HotelName: string;
    HotelRating: string;
    Address: string;
  };
};

const HotelHeader = ({ data }: HotelHeaderProps) => {
  const [fav, setfav] = useState(false);
  const router = useRouter();
  const t = useTranslations("hotelDetails");

  const hotelRating = parseFloat(data?.HotelRating) || 0;

  return (
    <div className="flex items-center px-4 py-6 justify-between flex-wrap rounded-lg">
      {/* Left Side - Hotel Info */}
      <div className="w-full lg:w-1/2 mb-4 space-y-3">
        <ParaHeading className="!text-black !font-bold">
          {data?.HotelName}
        </ParaHeading>

        <div className="flex items-center">
          <div className="flex items-center gap-1 font-medium text-base text-grayText">
            {[...Array(Math.floor(hotelRating))].map((_, index) => (
              <MdStar className="text-[#FF7300] text-xl" key={index} />
            ))}
          </div>
          <p className="text-primary text-xs ml-2 font-medium">
            {t("stars", { rating: hotelRating })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LocationIcon />
          <SubHeading className="!text-black">{data?.Address}</SubHeading>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="space-y-3 w-full lg:w-1/5">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setfav(!fav)}
            className="text-green flex justify-center items-center p-2 text-2xl font-medium border-2 border-green rounded-lg"
          >
            {fav ? <RiHeart3Fill /> : <RiHeart3Line />}
          </button>

          <button className="text-green flex justify-center items-center p-2 text-2xl font-medium border-2 border-green rounded-lg">
            <BsShareFill />
          </button>

          {/* Uncomment to enable booking */}
          {/* 
          <Button
            onClick={() => router.push(`/book-now?id=...`)}
            label={t("buttons.bookNow")}
            style="!bg-greenGradient !text-center !min-w-32"
          /> 
          */}
        </div>
      </div>
    </div>
  );
};

export default HotelHeader;
