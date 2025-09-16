"use client";

import React, { useState } from "react";
import ParaHeading from "../../shared/para-heading";
import { LocationIcon } from "@/app/svg";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { BsShareFill } from "react-icons/bs";
import { MdStar } from "react-icons/md";
import { useTranslations } from "next-intl";
import { FiInfo } from "react-icons/fi";

type HotelHeaderProps = {
  data?: {
    HotelName: string;
    HotelRating: number;
    Address: string;
    Description?: string;
  };
};

const HotelHeader = ({ data }: HotelHeaderProps) => {
  const [fav, setfav] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("hotelDetails");

  const hotelRating = data?.HotelRating ?? 0;
  const description = data?.Description ?? "";

  const shortText = description.slice(0, 220);

  return (
    <div className="px-4 py-6 space-y-6 rounded-lg">
      {/* Top row: hotel info and actions */}
      <div className="flex items-center justify-between flex-wrap">
        {/* Left Side - Hotel Info */}
        <div className="w-full lg:w-3/4 mb-4 space-y-3">
          <ParaHeading className="!text-black !font-bold text-2xl">
            {data?.HotelName}
          </ParaHeading>

          {/* Rating */}
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
        </div>

        {/* Right Side - Action Buttons */}
        <div className="w-full lg:w-1/5 flex gap-5 justify-end">
          <button
            onClick={() => setfav(!fav)}
            className="text-green flex justify-center items-center p-2 text-2xl font-medium border-2 border-green rounded-lg hover:bg-green/10 transition"
          >
            {fav ? <RiHeart3Fill /> : <RiHeart3Line />}
          </button>

          <button className="text-green flex justify-center items-center p-2 text-2xl font-medium border-2 border-green rounded-lg hover:bg-green/10 transition">
            <BsShareFill />
          </button>
        </div>
      </div>

      {/* Address + Description Section */}
      <div className="bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 p-4 rounded-xl shadow-sm space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <LocationIcon />
          <p className="text-gray-800 text-sm leading-relaxed">
            {data?.Address}
          </p>
        </div>

        {/* Description */}
        {description && (
          <div className="flex items-start gap-3">
            <FiInfo className="text-green-600 text-lg mt-1" />
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {expanded
                  ? description
                  : shortText + (description.length > 220 ? "..." : "")}
              </p>

              {description.length > 220 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-green font-medium text-sm hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelHeader;
