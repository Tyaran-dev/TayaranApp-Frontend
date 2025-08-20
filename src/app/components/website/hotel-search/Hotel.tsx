// no images hotel 1010065 "1000057"
"use client";
import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdStar } from "react-icons/md";
import { TiStarHalf } from "react-icons/ti";
import emptyImg from "@/../public/assets/emptyImg.png";
import Image from "next/image";
import HotelSearch from "../home/components/hotel-search-form";
import Link from "next/link";
import Filters from "./Filters";
import Pagination from "../../shared/Pagination";
import { useTranslations } from "next-intl";
import { Hotel as HotelType } from "@/redux/hotels/hotelsSlice";

interface Props {
  hotels: { data: HotelType[] } | HotelType[];
}

const starRatingMap: { [key: string]: number } = {
  OneStar: 1,
  TwoStar: 2,
  ThreeStar: 3,
  FourStar: 4,
  FiveStar: 5,
  SixStar: 6,
  SevenStar: 7,
};

const starRatingMapFiltering: { [key: string]: string } = {
  "1 stars": "OneStar",
  "2 stars": "TwoStar",
  "3 stars": "ThreeStar",
  "4 stars": "FourStar",
  "5 stars": "FiveStar",
  "6 stars": "SixStar",
  "7 stars": "SevenStar",
};

const filterHotels = (
  hotels: any[],
  priceRange: [number, number],
  selectedStarRatingOptions: string[],
  selectedGuestRatingOptions: string[]
) => {
  return hotels?.filter((hotel) => {
    // Filter by price range (only if price range is not the default)
    const price = hotel.MinHotelPrice || 0;
    const isInPriceRange =
      priceRange[0] === 10 && priceRange[1] === 1000
        ? true
        : price >= priceRange[0] && price <= priceRange[1];

    // Convert filter options to the correct format for comparison
    const convertedStarRatings = selectedStarRatingOptions.map(
      option => starRatingMapFiltering[option]
    );

    // Filter by star rating (if any options are selected)
    const isStarRatingMatch =
      selectedStarRatingOptions.length === 0 ||
      convertedStarRatings.includes(hotel.HotelInfo?.Rating);

    // Filter by guest rating (if any options are selected)
    const guestRating = parseFloat(hotel.HotelInfo?.TripAdvisorRating || "0");
    const isGuestRatingMatch =
      selectedGuestRatingOptions.length === 0 ||
      selectedGuestRatingOptions.some((option) => {
        const minRating = parseFloat(option.split("+")[0]);
        return guestRating >= minRating;
      });

    // Return true only if all applied filters are satisfied
    return isInPriceRange && isStarRatingMatch && isGuestRatingMatch;
  });
};

const Hotel = ({ hotels }: Props) => {

  console.log(hotels, "here is the hotelsssssssss")
  const hotelData = Array.isArray(hotels) ? hotels : hotels.data;
  const t = useTranslations("HotelPage");
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 1000]);
  const [selectedHotelOptions, setSelectedHotelOptions] = useState<string[]>([]);
  const [selectedStarRatingOptions, setSelectedStarRatingOptions] = useState<string[]>([]);
  const [selectedGuestRatingOptions, setSelectedGuestRatingOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(50);

  const filteredHotels = filterHotels(
    hotelData,
    priceRange,
    selectedStarRatingOptions,
    selectedGuestRatingOptions
  );

  const totalPages = Math.ceil(filteredHotels?.length / hotelsPerPage);
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels?.slice(indexOfFirstHotel, indexOfLastHotel);

  return (
    <div className="py-5">
      <div className="w-full flex items-start gap-6 my-8">
        <Filters
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedHotelOptions={selectedHotelOptions}
          onHotelOptionsChange={setSelectedHotelOptions}
          selectedStarRatingOptions={selectedStarRatingOptions}
          onStarRatingOptionsChange={setSelectedStarRatingOptions}
          selectedGuestRatingOptions={selectedGuestRatingOptions}
          onGuestRatingOptionsChange={setSelectedGuestRatingOptions}
        />

        {!hotelData?.length && (
          <p className="text-center text-gray-500">{t("noHotelsFound")}</p>
        )}

        <div className="w-[75%]">
          <div className="flex flex-col gap-5">
            <span className="font-medium">
              {t("showing")}{" "}
              <span className="text-orange">{filteredHotels?.length}</span>{" "}
              {t("places")}
            </span>

            {currentHotels?.map((hotel, i) => (
              <div
                key={i}
                className="flex mb-4 items-center shadow-xl border p-8 gap-4 w-full rounded-lg"
                style={{ boxShadow: "0px 4px 16px 0px #1122110D" }}
              >
                <div className="w-[25%] h-60">
                  {hotel?.Images ? (
                    <img
                      src={hotel.Images[0]}
                      className="w-full h-full object-cover rounded-xl"
                      alt={hotel?.HotelName}
                    />
                  ) : (
                    <Image
                      alt={t("noImage")}
                      src={emptyImg}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="w-full flex-1 flex flex-col p-2 items-center justify-center">
                  <div className="flex items-start gap-3 justify-between p-4 mb-4 w-full">
                    <div>
                      <h2 className="text-2xl font-bold mb-3">
                        {hotel?.HotelName}
                      </h2>
                      <div className="flex items-center gap-1 mb-3">
                        <FaLocationDot />
                        <p className="text-base text-[#12121299]">
                          {hotel?.Address}
                        </p>
                      </div>
                      <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 font-medium text-base text-grayText">
                            {[...Array(Math.floor(parseFloat(hotel?.HotelRating) || 0))].map((_, index) => (
                              <MdStar
                                className="text-[#FF7300] text-xl"
                                key={index}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-[#12121299]">
                            {hotel?.HotelRating || 0} {t("starHotel")}
                          </p>
                        </div>
                        <div className="text-sm text-[#12121299]">
                          20+ {t("amenities")}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#12121299]">
                      <p>{t("startingFrom")}</p>
                      <h2 className="text-base font-bold gap-1 flex">
                        <span className="text-2xl  text-black">
                          {hotel?.MinHotelPrice?.toFixed()}$
                        </span>
                        /{t("night")}
                      </h2>
                      <p className="text-[10px] text-end mt-1">
                        {t("excludingTax")}
                      </p>
                    </div>
                  </div>
                  <div className="w-full border-[#12121299] flex justify-center border-t py-3">
                    <div className="flex justify-end w-full pt-5">
                      <Link
                        href={`/hotel-details/${hotel.HotelCode}`}
                        className="text-white bg-greenGradient py-3 px-4 rounded-xl text-center"
                      >
                        {t("viewPlace")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Optional Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;