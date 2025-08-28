"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Food, Plane, Seat, Time, Wifi } from "@/app/svg/flight-feature-svg";
import {
  getAirportByIATA,
  calculateTotalDuration,
  getFlightNames,
  calculateTotalDurationShort,
  calculateTotalDurationShortNew,
  calculateDurationSimple,
} from "@/utils/airports-helper";
import logo from "/public/assets/logo/ras.png";
import route from "/public/assets/planeRoute.png";
import { IoIosArrowDown } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { LuClock8 } from "react-icons/lu";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "@/redux/store";
import { AirlinesData } from "@/app/data/airlines";
import axios from "axios";
import { addFlightData, selectFlight } from "@/redux/flights/flightSlice";
import { scrollToTop } from "@/utils";
import { useTranslations } from "next-intl";

const FlightCard = ({
  flight,
  airlineName,
  isFlightSelected,
  setIsFlightSelected,
  from,
  setIsSideMenuOpen,
  returnFlights,
}: any) => {
  const t = useTranslations("FlightCard");
  const feature = [<Plane />, <Wifi />, <Time />, <Food />, <Seat />];
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const travelersParam = searchParams.get("adult") || "1";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const dispatch = useDispatch();
  useEffect(() => {
    if (from === "selection") {
      setIsOpenDetails(true);
    }
  }, [from]);

  function formatDateToDayMonth(isoString: string) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(date);
  }

  const filteredAirline = AirlinesData.find(
    (airline) => airline.name.toLowerCase() === airlineName?.toLowerCase()
  );

  function getNumberOfStops(itinerary: any) {
    const stopCount = itinerary.segments.length;

    if (stopCount === 1) {
      return t("direct");
    } else if (stopCount === 2) {
      return `1 ${t("stop")}`;
    } else if (stopCount > 2) {
      return `${stopCount - 1} ${t("stops")}`;
    }
    return t("noStops");
  }

  function calculateWaitingTime(
    arrivalTime: string,
    departureTime: string
  ): string {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);

    const differenceInMs = departure.getTime() - arrival.getTime();
    const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `Waiting time ${hours}h and ${minutes}m`;
  }

  function getStopDetails(itinerary: any) {
    const stops = itinerary.segments.length;

    if (stops === 1) {
      return (
        <div className="p-2 whitespace-nowrap">
          <p>{t("flightHasNoStop")}</p>
        </div>
      );
    } else {
      const arrival = itinerary.segments[0]?.arrival.at;
      const departure = itinerary.segments[1]?.departure.at;
      const waitingIata = itinerary.segments[0]?.toLocation;

      return (
        <p>
          {calculateWaitingTime(arrival, departure)}
          {getAirportByIATA(waitingIata)}
        </p>
      );
    }
  }

  const FlightOfferSearch = async (flight: any) => {
    const response = await axios.post(
      `${baseUrl}/flights/flight-pricing`,
      flight
    );
    const flightData = response.data.data.flightOffers;
    dispatch(addFlightData(flight));
    dispatch(selectFlight(flightData));
    setIsSideMenuOpen(true);
  };

  function calculateSimpleDayDifference(
    departureDate: string,
    arrivalDate: string
  ) {
    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);
    const timeDifference = arrival.getTime() - departure.getTime();
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    return Math.round(dayDifference);
  }

  const ShowBookNowText = () => {
    if (loading) {
      return t("checking");
    } else if (isFlightSelected) {
      return t("bookNow");
    } else if (!isFlightSelected) {
      return t("select");
    }
  };

  return (
    <div className="p-2" key={flight?.id}>
      <div className="border p-5  bg-slate-50 font-cairo text-black border-[#C0C0C0] flex flex-col justify-between md:gap-5 rounded-xl">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {flight?.itineraries_formated?.map(
            (itinerary: any, index: number) => (
              <div key={index} className="mb-2  border-t pt-1">
                {/* Airline Header */}
                <div className="flex items-center ">
                  <Image
                    src={itinerary.segments[0].image || logo}
                    alt=""
                    width={32}
                    height={24}
                    unoptimized
                    className="rounded object-contain"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {itinerary.segments[0].airlineName}
                  </span>
                </div>

                {/* Compact Flight Row */}
                <div className="grid grid-cols-3 items-center gap-   py-2 px-2">
                  {/* Departure */}
                  <div className="text-left">
                    <div className="text-base  text-gray-900">
                      {new Date(
                        itinerary.segments[0].departure.at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="text-xs text-gray-500 ">
                      {itinerary.fromName || "Unknown Airport"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {itinerary.fromLocation}
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">
                      {getNumberOfStops(itinerary)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {itinerary.duration}
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <div className="text-base text-gray-900">
                      {new Date(
                        itinerary.segments[
                          itinerary.segments.length - 1
                        ].arrival.at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {itinerary.toName || "Unknown Airport"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {itinerary.toLocation}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Mobile Price and Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 px-2">
            {/* Seats Warning */}
            <div className="text-sm text-red-600">
              {flight.numberOfBookableSeats} seats remaining
            </div>

            {/* Price Section */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                {flight?.currency == "SAR" ? (
                  <Image
                    src={logo}
                    alt="sar"
                    width={20}
                    height={20}
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <span className="text-sm">{flight?.currency}</span>
                )}
                <span className="text-2xl font-bold ">
                  {flight?.basePrice}
                </span>
              </div>
              {/* 🚩 Banner */}
              <div className="w-full text-xs text-center bg-yellow-100 text-yellow-800  font-semibold p-2 rounded-lg mt-1 ">
                {t("priceWithoutTax")}
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center justify-between mt-3 gap-3 px-2">
            {/* Show Details Button */}
            <button
              className="flex items-center gap-2 text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
              onClick={() => setIsOpenDetails(!isOpenDetails)}
            >
              <span>{t("flightDetails")}</span>
              <div
                className={`transform transition-transform duration-300 ${isOpenDetails ? "rotate-180" : ""
                  }`}
              >
                <IoIosArrowDown size={16} />
              </div>
            </button>

            {/* Select/Book Button */}
            {from === "card" && (
              <button
                onClick={() => {
                  FlightOfferSearch(flight);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-green-700 rounded-lg transition-colors"
              >
                {ShowBookNowText()}
              </button>
            )}
          </div>

          {/* Mobile Airline Features */}
          <div className="px-2 py-3 bg-gray-50 border-t border-gray-100 mt-3">
            <div className="flex items-center justify-center gap-6">
              {feature.map((item, i) => (
                <div key={i} className="text-gray-400">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Keep Original */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center text-sm lg:text-base mb-5 gap-5 flex-wrap ">

            <div className="lg:w-3/4 w-full bg-[#98FFC80A] p-2 md:p-5 text-center md:text-start">

              {flight?.itineraries_formated?.map(
                (itinerary: any, index: number) => (
                  <div key={index}>
                    {/* Airline Header */}
                    <div className="flex items-center gap-2 mb-3 p-2">
                      <Image
                        src={itinerary.segments[0].image || logo}
                        alt=""
                        width={32}
                        height={24}
                        unoptimized
                        className="rounded object-contain"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        {itinerary.segments[0].airlineName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center  my-2 gap-5 flex-wrap">
                      {/* Departure */}
                      <div className="flex flex-col lg:justify-center lg:items-center">
                        <div className="py-1">
                          <span className="flex items-center gap-2">
                            <p className="text-sm">
                              {new Date(
                                itinerary.segments[0].departure.at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </span>
                          <span className="text-sm text-grayDark">
                            {itinerary.segments[0].departure.at?.split("T")[0]}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm">
                            {itinerary.fromName || "Unknown Airport"}
                          </p>
                          <span className="text-sm text-grayDark text-center">
                            {itinerary.fromLocation}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex flex-col justify-center items-center relative">
                        <p className="py-0">{itinerary.duration}</p>
                        <Image src={route} alt="Flight Route" />
                        <div className="py-0 text-sm group">
                          <p>{getNumberOfStops(itinerary)}</p>
                          {getStopDetails(itinerary) && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full p-2 bg-[#333030] text-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              {getStopDetails(itinerary)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="flex flex-col lg:justify-center lg:items-center">
                        <div className="py-1">
                          <span className="flex items-center gap-2">
                            <p className="text-sm">
                              {new Date(
                                itinerary.segments[
                                  itinerary.segments.length - 1
                                ].arrival.at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                            <span className="text-sm text-grayDark">
                              +
                              {calculateSimpleDayDifference(
                                itinerary.segments[0].arrival.at.split("T")[0],
                                itinerary.segments[
                                  itinerary.segments.length - 1
                                ].arrival.at.split("T")[0]
                              )}
                            </span>
                          </span>
                          <span className="text-sm text-grayDark">
                            {
                              itinerary.segments[
                                itinerary.segments.length - 1
                              ].arrival.at?.split("T")[0]
                            }
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-sm">
                            {itinerary.toName || "Unknown Airport"}
                          </p>
                          <span className="text-sm text-grayDark text-center">
                            {itinerary.toLocation}
                          </span>
                        </div>
                      </div>
                      {index !== flight.itineraries.length - 1 && (
                        <hr className="lg:w-[500px] xl:w-[800px]" />
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Price + Banner */}
            <div className="flex lg:w-1/5 w-full items-center gap-5 flex-col">
              <div className="py-2 flex flex-col items-center">
                <div className="flex items-center">
                  {flight?.currency == "SAR" ? (
                    <Image
                      src={logo}
                      alt="sar"
                      width={30}
                      height={30}
                      unoptimized
                      className="m-1 object-contain"
                    />
                  ) : (
                    flight?.currency
                  )}
                  <p className="text-2xl font-bold ml-2">{flight?.basePrice}</p>
                </div>

                {/* 🚩 Banner */}
                <div className="w-full text-xs text-center bg-yellow-100 text-yellow-800  font-semibold p-2 rounded-lg mt-1 ">
                  {t("priceWithoutTax")}
                </div>
              </div>

              {from === "card" && (
                <button
                  onClick={() => {
                    FlightOfferSearch(flight);
                  }}
                  className="py-3 px-6 text-center text-white rounded-lg bg-emerald-700"
                >
                  {ShowBookNowText()}
                </button>
              )}

              <div
                className="flex items-center justify-end gap-2 px-5 cursor-pointer"
                onClick={() => setIsOpenDetails(!isOpenDetails)}
              >
                <div
                  className={`transform transition-transform duration-300 ${isOpenDetails ? "rotate-180" : ""
                    }`}
                >
                  <IoIosArrowDown size={20} color="green" />
                </div>
                <button className="text-green-600 text-lg ">
                  {t("flightDetails")}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom features */}
          <div className="flex justify-between font-medium items-center gap-5 flex-wrap">
            <p className="py-2">{flight.numberOfBookableSeats} seats remaining</p>
            <div className="flex items-center gap-4">
              {feature.map((item, i) => (
                <div key={i} className="py-2 px-4 border-r-2 border-[#D7E2EE]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flight Details Section */}
        {isOpenDetails && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-5 space-y-5">
              {flight.itineraries?.map((itinerary: any, index: number) => (
                <div key={index}>
                  {itinerary.segments.map(
                    (segment: any, segmentIndex: number) => (
                      <div key={segmentIndex} className="flex gap-8 mb-6">
                        <div className="flex flex-col gap-5 justify-between min-w-[120px]">
                          <div className="text-center">
                            <p className="md:font-semibold md:text-lg">
                              {new Date(segment.departure.at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {formatDateToDayMonth(segment.departure_date)}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="py-0 relative group">
                              <p className="text-sm font-medium">
                                {getNumberOfStops(itinerary)}
                              </p>
                              {getStopDetails(itinerary) && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 p-2 bg-[#333030] text-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                  {getStopDetails(itinerary)}
                                </div>
                              )}
                            </div>
                            <LuClock8 size={20} className="my-2 text-gray-400" />
                            <p className="text-slate-500 text-sm">
                              {calculateTotalDurationShort(itinerary.segments)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="md:font-semibold md:text-lg">
                              {new Date(segment.arrival.at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {formatDateToDayMonth(segment.arrival_date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 flex-1">
                          <div className="relative flex flex-col items-center justify-between">
                            <FaLocationCrosshairs size={20} color="green" />
                            <div className="w-[2px] bg-slate-200 absolute h-[75%] top-[20px]"></div>
                            <CiLocationOn size={20} color="#64748b" />
                          </div>
                          <div className="flex flex-col gap-5 justify-between flex-1">
                            <div>
                              <p className="md:font-bold md:text-lg">
                                {segment.fromAirport.name}
                              </p>
                              <p className=" text-slate-500 text-sm mt-1">
                                {segment.fromAirport.city}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Image
                                src={itinerary.segments[0].image || logo}
                                alt=""
                                width={40}
                                height={30}
                                unoptimized
                                className="rounded-2xl mr-3 object-contain"
                              />
                              <div className="flex flex-col">
                                <p className="font-semibold">{airlineName}</p>
                                <p className="text-slate-500 text-sm">
                                  {flight.cabinClass}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className=" md:text-lg md:font-bold">
                                {segment.toAirport.name}
                              </p>
                              <p className="text-slate-500 text-sm mt-1">
                                {segment.toAirport.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
              <div className="border-slate-300 p-4 border rounded-xl bg-white">
                <p className="font-semibold mb-3">{t("baggageIncluded")}</p>
                <p className="font-bold text-sm text-gray-700 mb-3">Adult</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <TiTick color="green" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cabin Baggage</p>
                      <p className="text-gray-500 text-xs">7 kg / 1 piece</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <TiTick color="green" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Checked Baggage</p>
                      <p className="text-gray-500 text-xs">
                        {flight.traveller_pricing[0].allowedBags.quantity}{" "}
                        {flight?.traveller_pricing[0].allowedBags.weight} / 1 piece
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;