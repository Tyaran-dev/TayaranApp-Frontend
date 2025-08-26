"use client";
import React, { useEffect, useState } from "react";
import FlightFilter from "@/app/components/website/flight-search/flight-filter";
import FlightCard from "@/app/components/website/flight-details/flight-card";
import Section from "@/app/components/shared/section";
import FlightSearchForm from "@/app/components/website/flight-search/search-form";
import { useRouter, useSearchParams } from "next/navigation";
import CustomProgressBar from "@/app/components/shared/progress-bar";
import Image from "next/image";
import Heading from "@/app/components/shared/heading";
import { calculateTotalDurationShortNew } from "@/utils/airports-helper";
import { differenceInMinutes, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { clearFlightData, removeFlightData, setSearchData } from "@/redux/flights/flightSlice";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import FlightTicketSkeletonGrid from "@/app/components/shared/Feedback/FlightTicketSkeletonGrid";
import { getPersistedFlightData } from '@/utils/flightStorage';
import useSearchflights from "@/hooks/useSearchflights"
import Stepper from "@/app/components/shared/Feedback/Stepper";
import logo from "/public/assets/logo/ras.png";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";


interface FlightPrice {
  currency: string;
  total: number;
  base?: number;
  taxes?: number;
}

export interface Flight {
  id: string;
  price: FlightPrice;
  airLineName: string;
  itineraries: any[]; // Update with proper type if available
  segments: any[];    // Update with proper type if available
  // Add other flight properties as needed
}


const Page: React.FC = () => {
  const {
    getFlights,
    carriers,
    flights,
    loading,
    flightClass,
    hasHydrated
  } = useSearchflights();

  console.log(flights, "fetched flights")

  const locale = useLocale();
  const t = useTranslations("filters");
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);


  const searchParamsData = useSelector((state: any) => state.flightData.searchParamsData);
  const searchParams = useSearchParams();
  const travelersParam = searchParams.get("adult") || "1";
  const [sortedFlights, setSortedFlights] = useState<any[]>([]);
  const [flightClasss, setFlightClass] = useState(flightClass || "ECONOMY");
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    price: Infinity, // Default to no price limit
    stops: [], // Default to show all stops
    airlines: [], // Default to show all airlines
    departureTime: "any", // Default to any time
  });

  const [selectedSorts, setSelectedSorts] = useState<string[]>([]);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  const [isFlightSelected, setIsFlightSelected] = useState(false);
  const slectedData = useSelector((state: any) => state.flightData.slectedFlight);
  const flightDataSlice = useSelector((state: any) => state.flightData.flights);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();


  // Filter Flights Function
  const filteredFlights = flights?.filter((flight) => {
    // Safeguard: Ensure flight and necessary properties exist
    if (!flight?.price || !flight?.itineraries) return false;

    // Filter by price
    const price = parseFloat(flight.basePrice);
    const isPriceValid = price <= filters.price;

    const isStopsValid =
      filters.stops.length === 0 ||
      filters.stops.includes("Any number of stops") ||
      flight.itineraries.some((itinerary: any) => {
        const totalStops = itinerary.segments.length - 1; // Number of stops is segments.length - 1

        // Check the total stops against the filter
        if (filters.stops.includes("Direct flights only") && totalStops === 0) {
          return true;
        }
        if (filters.stops.includes("1 stop") && totalStops === 1) {
          return true;
        }
        if (filters.stops.includes("2 stops or more") && totalStops >= 2) {
          return true;
        }
        return false; // No match, return false
      });

    // Filter by departure time
    const isDepartureTimeValid =
      filters.departureTime === "any" || // No time filters applied
      flight.itineraries_formated.some((itinerary: any) =>
        itinerary.segments.some((segment: any) => {
          const departureDate = new Date(segment?.departure.at);
          const departureHour = departureDate.getHours();

          // Check for different time slots based on selected filter
          switch (filters.departureTime) {
            case "morning":
              return departureHour >= 6 && departureHour < 12;
            case "afternoon":
              return departureHour >= 12 && departureHour < 18;
            case "evening":
              return departureHour >= 18 && departureHour < 24;
            case "before_morning":
              return departureHour >= 0 && departureHour < 6;
            default:
              return true; // If no match, return true
          }
        })
      );

    // Filter by airlines
    const airlineCode = flight.airline?.[0];
    // Filter by airlines
    const isAirlinesValid =
      filters.airlines.length === 0 || // No airline filters applied
      filters.airlines.some((selectedAirline: string) => {
        // Find the carrier for this flight
        const carrier = carriers.find((c) => c.airLineCode === flight.airline);

        // Check if flight's airline matches selected filter by code or name
        return (
          flight.airline === selectedAirline || // Direct code match
          (carrier &&
            (carrier.airLineCode === selectedAirline ||
              carrier.airLineName === selectedAirline))
        );
      });
    // Return true if all filters are valid
    return (
      isPriceValid && isStopsValid && isDepartureTimeValid && isAirlinesValid
    );
  });

  const getCheapestFlight = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;
    return flights.reduce((min, flight) =>
      flight.basePrice < min.basePrice ? flight : min
    );
  };

  // helper function to convert "1h 50m" into minutes
  const parseDurationToMinutes = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return hours * 60 + minutes;
  };

  const getShortestFlight = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;

    return flights.reduce((min, flight) => {
      const minDuration = parseDurationToMinutes(min.itineraries[0].duration);
      const currentDuration = parseDurationToMinutes(flight.itineraries[0].duration);

      return currentDuration < minDuration ? flight : min;
    });
  };

  const getEarliestTakeoff = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;

    return flights.reduce((earliest, flight) => {
      // assuming first segment is the takeoff
      const earliestDeparture = new Date(earliest.itineraries[0].segments[0].departure.at).getTime();
      const currentDeparture = new Date(flight.itineraries[0].segments[0].departure.at).getTime();

      return currentDeparture < earliestDeparture ? flight : earliest;
    });
  };

  const getEarliestArrival = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;

    return flights.reduce((earliest, flight) => {
      const earliestSegments = earliest.itineraries[0].segments;
      const currentSegments = flight.itineraries[0].segments;
      // last segment arrival = arrival of destination
      const earliestArrival = new Date(
        earliestSegments[earliestSegments.length - 1].arrival.at
      ).getTime();

      const currentArrival = new Date(
        currentSegments[currentSegments.length - 1].arrival.at
      ).getTime();

      return currentArrival < earliestArrival ? flight : earliest;
    });
  };



  const cheapestFlight = getCheapestFlight(filteredFlights),
    shortestFlight = getShortestFlight(filteredFlights),
    earlistFlight = getEarliestTakeoff(filteredFlights),
    earlistArrival = getEarliestArrival(filteredFlights);


  console.log(earlistArrival, "earlistArrival earlistArrival")



  // const formatDuration = (minutes: number) => {
  //   const h = Math.floor(minutes / 60);
  //   const m = minutes % 60;
  //   return `${h}h ${m}m`;
  // };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };



  useEffect(() => {
    if (!hasHydrated) return;

    const persistedData = getPersistedFlightData();
    if (persistedData?.searchParamsData) {
      dispatch(setSearchData({
        ...persistedData.searchParamsData,
        departure: new Date(persistedData.searchParamsData.departure).toISOString(),
      }));
    }
  }, [dispatch, hasHydrated]);


  useEffect(() => {
    return () => {
      dispatch(clearFlightData()); // ✅ Dispatch cleanup during unmount
    };
  }, []);

  useEffect(() => {
    const isOneWayOrRoundTrip = searchParamsData?.origin && searchParamsData?.destination;
    const isMultiCity = Array.isArray(searchParamsData?.segments) && searchParamsData.segments.length > 0;

    if (isOneWayOrRoundTrip || isMultiCity) {
      getFlights();
    }
  }, [searchParamsData]);




  // Handle different sorting options
  const handleSortChange = (sortType: string) => {
    let updatedSorts = [...selectedSorts];
    const index = updatedSorts.indexOf(sortType);

    // If sort type is already selected, remove it; otherwise, add it
    if (index === -1) {
      updatedSorts.push(sortType);
    } else {
      updatedSorts.splice(index, 1);
    }

    setSelectedSorts(updatedSorts); // Update selected sorts

    // Apply sorting only if any sorting options are selected
    let sortedList = [...filteredFlights];

    if (updatedSorts.length > 0) {
      updatedSorts.forEach((type) => {
        switch (type) {
          case "cheapest":
            sortedList = sortedList.sort(
              (a, b) => a.basePrice - b.basePrice
            );
            break;
          case "shortest":
            sortedList = sortedList.sort((a, b) => {
              const getDurationInMinutes = (flight: any) => {
                return flight.itineraries.reduce((total: number, itinerary: any) => {
                  const firstSegment = itinerary.segments[0];
                  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                  const departure = new Date(firstSegment.departure.at).getTime();
                  const arrival = new Date(lastSegment.arrival.at).getTime();
                  const diffMinutes = (arrival - departure) / (1000 * 60);
                  return total + diffMinutes; // add per itinerary
                }, 0);
              };

              const durationA = getDurationInMinutes(a);
              const durationB = getDurationInMinutes(b);

              return durationA - durationB;
            });
            break;
          case "earliest-takeoff":
            sortedList = sortedList.sort((a, b) => {
              const departureTimeA = new Date(
                a.itineraries[0].segments[0].departure.at
              ).getTime();
              const departureTimeB = new Date(
                b.itineraries[0].segments[0].departure.at
              ).getTime();
              return departureTimeA - departureTimeB;
            });
            break;
          case "earliest-arrival":
            sortedList = sortedList.sort((a, b) => {
              const arrivalTimeA = new Date(
                a.itineraries[0].segments.slice(-1)[0].arrival.at
              ).getTime();
              const arrivalTimeB = new Date(
                b.itineraries[0].segments.slice(-1)[0].arrival.at
              ).getTime();
              return arrivalTimeA - arrivalTimeB;
            });
            break;
          default:
            break;
        }
      });
    }
    setSortedFlights(sortedList.slice(0, 10)); // Get top 10 flights after sorting
  };

  // Highlight active buttons
  const getButtonClass = (sortType: string) => {
    return selectedSorts.includes(sortType)
      ? "border-emerald-600"
      : "";
  };

  const calculateStops = (flightSegments: any[]) => {
    // If there is more than 1 segment, there are stops
    const numberOfStops =
      flightSegments?.length > 1 ? flightSegments?.length - 1 : 0;
    return numberOfStops;
  };


  // Function to calculate the stop duration between segments
  const calculateStopDuration = (
    arrivalTime: string,
    nextDepartureTime: string
  ) => {
    const arrivalDate = parseISO(arrivalTime);
    const nextDepartureDate = parseISO(nextDepartureTime);
    const stopDurationInMinutes = differenceInMinutes(
      nextDepartureDate,
      arrivalDate
    );

    // Convert minutes to hours and minutes
    const hours = Math.floor(stopDurationInMinutes / 60);
    const minutes = stopDurationInMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const displayFlightDetails = (flightSegments: any[]) => {
    const numberOfStops = calculateStops(flightSegments);
    if (numberOfStops > 0) {
      for (let i = 0; i < flightSegments.length - 1; i++) {
        const currentSegment = flightSegments[i];
        const nextSegment = flightSegments[i + 1];

        const stopAirport = currentSegment.arrival.iataCode;
        const stopDuration = calculateStopDuration(
          currentSegment.arrival.at,
          nextSegment.departure.at
        );
      }
    }
  };

  //@ts-ignore
  displayFlightDetails(flights[0]?.segments);


  return (
    <Section className="">
      <div className="py-5  ">
        {/* Stepper */}
        <div className="hidden md:block">


          <Stepper currentStep={currentStep} stepsType="flightSteps" />
        </div>
        <div className=" p-4">
          <FlightSearchForm />
        </div>
        <div className="flex items-center md:items-start  flex-nowrap flex-col md:flex-row justify-center md:justify-between gap-2 py-10">
          <div className="lg:w-1/4 w-[90%] border   rounded-lg md:sticky md:top-20 md:h-[calc(100vh-5rem)] flex flex-col items-center">
            {/* Header Section - stays fixed inside */}
            <div
              className="flex justify-between flex-wrap px-3 py-2 w-full items-center gap-5 cursor-pointer lg:cursor-default border-b"
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(!isOpen);
              }}
            >
              <h2 className="lg:text-xl font-semibold">{t("heading")}</h2>
              <div className="flex items-center gap-2">
                <h2 className="lg:text-xl font-semibold">
                  ({filteredFlights && filteredFlights.length})
                </h2>
                <span className="lg:hidden">
                  {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                </span>
              </div>
            </div>

            {/* Accordion Body - scrollable area */}
            <div
              className={`transition-all flex justify-center w-full duration-300 lg:block flex-1 overflow-y-auto px-3 scrollbar-hide ${isOpen
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
                }`}
            >
              <FlightFilter
                filterPrice={filters.price}
                filterStops={filters.stops}
                airlines={Object.values(carriers)}
                filterDepartureTime={filters.departureTime}
                onPriceChange={(newPrice: any) =>
                  setFilters({ ...filters, price: newPrice })
                }
                onStopsChange={(newStops: any) =>
                  setFilters({ ...filters, stops: newStops })
                }
                onDepartureTimeChange={(newTime: any) =>
                  setFilters({ ...filters, departureTime: newTime })
                }
                onAirlinesChange={(newAirlines: any) =>
                  setFilters({ ...filters, airlines: newAirlines })
                }
                filterAirlines={filters.airlines}
                filterBaggage={[]}
                onBaggageChange={(baggage: string[]) => {
                  console.log("Baggage updated:", baggage);
                }}
              />
            </div>
          </div>


          <div className={`lg:w-[72%] w-full space-y-6`}>
            <div className="flex items-center whitespace-nowrap flex-wrap sm:flex-nowrap justify-center md:justify-between gap-2 w-full">
              <button
                className={`rounded-lg p-2 w-[40%] md:w-full  h-20 border-2 ${getButtonClass("cheapest")}`}
                onClick={() => handleSortChange("cheapest")}
              >
                <div className="flex flex-col items-center">
                  <span>{t("cheapest")}</span>
                  {cheapestFlight && (
                    <span className={`text-sm flex items-center text-gray-600 ${getButtonClass("cheapest")}`}>
                      {cheapestFlight.basePrice} {cheapestFlight?.currency == "SAR" ? <Image
                        src={logo}
                        alt="sar"
                        width={18}
                        height={18}
                        unoptimized
                        className="m-1 object-contain"
                      /> : cheapestFlight?.currency}  -- {cheapestFlight.itineraries[0].duration}
                    </span>
                  )}
                </div>
              </button>

              <button
                className={`rounded-lg p-2 w-[40%] md:w-full  h-20 border-2  ${getButtonClass("shortest")}`}
                onClick={() => handleSortChange("shortest")}
              >
                <div className="flex flex-col items-center">
                  <span>{t("shortest")}</span>
                  {shortestFlight && (
                    <span className={`text-sm flex items-center text-gray-600 ${getButtonClass("cheapest")}`}>
                      {shortestFlight.basePrice} {shortestFlight?.currency == "SAR" ? <Image
                        src={logo}
                        alt="sar"
                        width={18}
                        height={18}
                        unoptimized
                        className="m-1 object-contain"
                      /> : shortestFlight?.currency}  -- {shortestFlight.itineraries[0].duration}
                    </span>
                  )}
                </div>
              </button>

              <button
                className={`rounded-lg p-2 w-[40%] md:w-full  h-20 border-2 ${getButtonClass("earliest-takeoff")}`}
                onClick={() => handleSortChange("earliest-takeoff")}
              >
                <span>
                  {t("earliesttakeoff")}
                </span>
                {earlistFlight && (
                  <span className={`text-sm flex items-center justify-center text-gray-600 ${getButtonClass("earlistFlight")}`}>
                    {earlistFlight.basePrice} {earlistFlight?.currency == "SAR" ? <Image
                      src={logo}
                      alt="sar"
                      width={18}
                      height={18}
                      unoptimized
                      className="m-1 object-contain"
                    /> : earlistFlight?.currency}  -- {earlistFlight.itineraries[0].segments[0].departure_time}
                  </span>
                )}
              </button>

              <button
                className={`rounded-lg p-2 w-[40%] md:w-full  h-20 border-2  ${getButtonClass("earliest-arrival")}`}
                onClick={() => handleSortChange("earliest-arrival")}
              >
                <span>
                  {t("earliestarrival")}
                </span>
                {earlistArrival && (
                  <span className={`text-sm flex items-center justify-center text-gray-600 ${getButtonClass("cheapest")}`}>
                    {earlistArrival.basePrice} {earlistArrival?.currency == "SAR" ? <Image
                      src={logo}
                      alt="sar"
                      width={18}
                      height={18}
                      unoptimized
                      className="m-1 object-contain"
                    /> : earlistArrival?.currency}  --  {
                      earlistArrival.itineraries[0].segments[
                        earlistArrival.itineraries[0].segments.length - 1
                      ].arrival_time
                    }
                  </span>
                )}
              </button>
            </div>

            {loading && (
              <>
                <CustomProgressBar />
                <FlightTicketSkeletonGrid />
              </>
            )}
            {selectedSorts.length > 0 ? (
              <div className="w-full space-y-6">
                {sortedFlights?.length === 0 && !loading && (
                  <div className="min-h-screen w-full flex-col flex justify-center items-center">
                    <Heading>No Flight Found</Heading>
                    <Image
                      src={"/no-flight.svg"}
                      width={400}
                      height={400}
                      alt=""
                    />
                  </div>
                )}
                {!loading && sortedFlights?.map((flight) => (
                  <FlightCard
                    from="card"
                    key={flight.id}
                    flight={flight}
                    airlineName={carriers[flight.airLineName]}
                    isFlightSelected={isFlightSelected}
                    setIsFlightSelected={setIsFlightSelected}
                    setIsSideMenuOpen={setIsSideMenuOpen}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full space-y-6">
                {filteredFlights?.length === 0 && !loading && (
                  <div className="min-h-screen w-full flex-col flex justify-center items-center">
                    <Heading>No Flight Found</Heading>
                    <Image
                      src={"/no-flight.svg"}
                      width={400}
                      height={400}
                      alt=""
                      className=""
                    />
                  </div>
                )}
                {!loading && filteredFlights?.map((flight) => (
                  <FlightCard
                    from={"card"}
                    key={flight.id}
                    isFlightSelected={isFlightSelected}
                    setIsFlightSelected={setIsFlightSelected}
                    // SetReturnFlight={SetReturnFlight}
                    // returnFlights={returnFlights}
                    flight={flight}
                    setIsSideMenuOpen={setIsSideMenuOpen}
                    airlineName={carriers[flight.airline]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isSideMenuOpen &&
        slectedData.map((selectedFlight: Flight, index: number) => (
          <div key={index} className="fixed inset-0 flex items-center justify-start top-0 z-[99] bg-[#00000099] h-full">
            <div
              className={`flex flex-col p-5 justify-between h-full w-full md:w-[50%] bg-white shadow-lg transform ${isSideMenuOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
              <div className="flex justify-between items-center border-b border-b-slate-300 pb-2">
                <h2 className="text-xl text-primary font-semibold">
                  Flight details
                </h2>
                <button
                  onClick={() => {
                    if (returnFlights.length === 0) {
                      dispatch(clearFlightData());
                    } else {
                      dispatch(removeFlightData(1));
                    }
                    setIsSideMenuOpen(false);
                  }}
                >
                  <AiOutlineClose className="text-xl text-gray-700" />
                </button>
              </div>
              <div className=" overflow-y-auto flex flex-col items-center gap-5 my-5">
                {flightDataSlice?.map((flight: Flight) => (
                  <FlightCard
                    from={"selection"}
                    key={flight.id}
                    isFlightSelected={isFlightSelected}
                    setIsFlightSelected={setIsFlightSelected}
                    // SetReturnFlight={SetReturnFlight}
                    flight={flight}
                    setIsSideMenuOpen={setIsSideMenuOpen}
                    airlineName={flight?.airLineName}
                  />
                ))
                }
              </div>

              <div className="flex justify-between items-center border-t border-t-slate-300 pt-5 mt-5">
                <div>
                  <h2 className="text-xl text-primary font-semibold">
                    Flight details
                  </h2>
                  <h1 className="flex items-center gap-2">
                    <span>Totla Price:</span>
                    <span className="font-semibold text-lg">
                      {selectedFlight?.price.currency}
                    </span>
                    <span className="font-semibold text-lg">
                      {selectedFlight?.price.total}
                    </span>
                  </h1>
                </div>
                <button
                  onClick={() => {
                    router.push(`/${locale}/book-now`);
                  }}
                  className=" text-white rounded-md py-2 px-3 cursor-pointer bg-emerald-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        ))
      }
    </Section>
  );
};

export default Page;
