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
import Section from "../../shared/section";

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
    <Section>
      <div className=" p-2">
        <div className="w-full flex flex-col md:flex-row items-center gap-6 my-8">
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

          <div className="w-full">
            <div className="flex flex-col items-center w-full p-2 gap-2 ">
              <span className="font-medium">
                {t("showing")}{" "}
                <span className="text-orange">{filteredHotels?.length}</span>{" "}
                {t("places")}
              </span>

              {currentHotels?.map((hotel, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row mb-4 items-stretch shadow-xl border p-4 md:p-6 bg-white gap-4 w-full rounded-lg"
                  style={{ boxShadow: "0px 4px 16px 0px #1122110D" }}
                >
                  {/* Hotel Image */}
                  <div className="w-full md:w-[25%] h-48 md:h-60 flex-shrink-0">
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

                  {/* Hotel Content */}
                  <div className="w-full flex-1 flex flex-col justify-between">
                    {/* Top Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 w-full">
                      <div className="flex-1 min-w-0">
                        {/* Hotel Name */}
                        <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 line-clamp-2">
                          {hotel?.HotelName}
                        </h2>

                        {/* Address */}
                        <div className="flex items-start gap-1 mb-2 md:mb-3">
                          <FaLocationDot className="text-red-500 mt-1 flex-shrink-0" />
                          <p className="text-sm md:text-base text-gray-700 line-clamp-2 md:line-clamp-none">
                            {hotel?.Address}
                          </p>
                        </div>

                        {/* Rating + Amenities */}
                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                          <div className="flex flex-col items-center sm:items-start gap-2">
                            <div className="flex items-center gap-1 font-medium text-base text-grayText">
                              {[...Array(Math.floor(parseFloat(hotel?.HotelRating) || 0))].map(
                                (_, index) => (
                                  <MdStar
                                    className="text-[#FF7300] text-base md:text-xl"
                                    key={index}
                                  />
                                )
                              )}
                            </div>
                            <p className="text-xs md:text-sm font-medium text-[#12121299]">
                              {hotel?.HotelRating || 0} {t("starHotel")}
                            </p>
                          </div>
                          <div className="text-xs md:text-sm text-[#12121299]">
                            20+ {t("amenities")}
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="text-center md:text-right flex-shrink-0 w-full md:w-auto">
                        <p className="text-xs text-[#12121299]">{t("startingFrom")}</p>
                        <h2 className="text-lg md:text-2xl text-black font-bold">
                          {hotel?.MinHotelPrice?.toFixed()}$
                          <span className="text-xs md:text-sm font-normal text-[#12121299]">
                            /{t("night")}
                          </span>
                        </h2>
                        <p className="text-[10px] text-[#12121299]">{t("excludingTax")}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="w-full border-t pt-3 flex justify-center md:justify-end">
                      <Link
                        href={`/hotel-details/${hotel.HotelCode}`}
                        className="text-white bg-greenGradient py-2 md:py-3 px-6 md:px-4 rounded-xl text-center text-sm md:text-base w-full md:w-auto"
                      >
                        {t("viewPlace")}
                      </Link>
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
    </Section>
  );
};

export default Hotel;