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

  // Filter Flights Function
  const filteredFlights = flights?.filter((flight) => {
    // Safeguard: Ensure flight and necessary properties exist
    if (!flight?.price || !flight?.itineraries) return false;

    // Filter by price
    const price = parseFloat(flight.price);
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
              (a, b) => a.price - b.price
            );
            break;
          case "shortest":
            sortedList = sortedList.sort((a, b) => {
              const durationA = a.itineraries.reduce(
                (total: any, itinerary: any) =>
                  total +
                  parseInt(
                    calculateTotalDurationShortNew(itinerary.segments).replace(
                      /[^0-9]/g,
                      ""
                    ),
                    10
                  ),
                0
              );
              const durationB = b.itineraries.reduce(
                (total: any, itinerary: any) =>
                  total +
                  parseInt(
                    calculateTotalDurationShortNew(itinerary.segments).replace(
                      /[^0-9]/g,
                      ""
                    ),
                    10
                  ),
                0
              );
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
      ? "bg-greenGradient text-white"
      : "border border-borderColor";
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
      <div className="py-5">
        {/* Stepper */}
        <Stepper currentStep={currentStep} stepsType="flight"/>
        <FlightSearchForm />
        <div className="flex flex-wrap justify-between gap-5 py-10">
          <div className="lg:w-1/4 w-full ">
            <div className="flex justify-between flex-wrap px-3 items-center gap-5 ">
              <h2 className="lg:text-xl font-semibold">{t("heading")}</h2>
              <h2 className="lg:text-xl font-semibold">
                ({filteredFlights && filteredFlights.length})
              </h2>
            </div>
            <FlightFilter
              filterPrice={filters.price}
              filterStops={filters.stops}
              airlines={Object.values(carriers)} // here is airlines
              filterDepartureTime={filters.departureTime}
              onPriceChange={(newPrice) =>
                setFilters({ ...filters, price: newPrice })
              }
              onStopsChange={(newStops) =>
                setFilters({ ...filters, stops: newStops })
              }
              onDepartureTimeChange={(newTime) =>
                setFilters({ ...filters, departureTime: newTime })
              }
              onAirlinesChange={(newAirlines) =>
                setFilters({ ...filters, airlines: newAirlines })
              }
              filterAirlines={filters.airlines}
              filterBaggage={[]} // Add baggage filter functionality if needed
              onBaggageChange={(baggage: string[]) => {
                console.log("Baggage updated:", baggage);
              }}
            />
          </div>

          <div className={`lg:w-[72%] w-full space-y-6`}>
            <div className="flex items-center whitespace-nowrap flex-wrap sm:flex-nowrap justify-between gap-2 w-full">
              <button
                className={`rounded-2xl p-2 w-full ${getButtonClass(
                  "cheapest"
                )}`}
                onClick={() => handleSortChange("cheapest")}
              >
                {t("cheapest")}
              </button>
              <button
                className={`rounded-2xl p-2 w-full ${getButtonClass(
                  "shortest"
                )}`}
                onClick={() => handleSortChange("shortest")}
              >
                {t("shortest")}
              </button>
              <button
                className={`rounded-2xl p-2 w-full ${getButtonClass(
                  "earliest-takeoff"
                )}`}
                onClick={() => handleSortChange("earliest-takeoff")}
              >
                {t("earliesttakeoff")}
              </button>
              <button
                className={`rounded-2xl p-2 w-full ${getButtonClass(
                  "earliest-arrival"
                )}`}
                onClick={() => handleSortChange("earliest-arrival")}
              >
                {t("earliestarrival")}
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
          <div key={index} className="fixed inset-0 flex items-center justify-end top-0 z-[99] bg-[#00000099] h-full">
            <div
              className={`flex flex-col p-5 justify-between h-full w-[50%] bg-white shadow-lg transform ${isSideMenuOpen ? "translate-x-0" : "translate-x-full"
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
