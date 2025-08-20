"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useLocale } from "next-intl";
import { getPersistedFlightData } from "@/utils/flightStorage";
import { setSearchData } from "@/redux/flights/flightSlice";

interface FlightSegment {
  id: string;
  origin: string;
  destination: string;
  date: Date | null;
}

export interface AirlineCarrier {
  airLineCode: string;
  airLineName: string;
  airlineNameAr: string;
  image: string;
}

const useSearchflights = () => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const searchParamsData = useSelector(
    (state: any) => state.flightData.searchParamsData
  );
  const hasHydrated = useSelector((state: any) => state._persist?.rehydrated);

  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [flightType, setFlightType] = useState("oneway");
  const [flightClass, setFlightClass] = useState("ECONOMY");
  const [segments, setSegments] = useState<FlightSegment[]>([]);
  const [carriers, setCarriers] = useState<AirlineCarrier[]>([]);

  // populate local state from redux
  useEffect(() => {
    if (searchParamsData) {
      console.log("Redux searchParamsData:", searchParamsData);
      setOrigin(searchParamsData.origin || "");
      setDestination(searchParamsData.destination || "");
      setDeparture(
        searchParamsData.departure ? new Date(searchParamsData.departure) : null
      );
      setReturnDate(
        searchParamsData.returnDate
          ? new Date(searchParamsData.returnDate)
          : null
      );
      setTravelers(
        searchParamsData.travelers || { adults: 1, children: 0, infants: 0 }
      );
      setFlightType(searchParamsData.flightType || "oneway");
      setFlightClass(searchParamsData.flightClass || "ECONOMY");
      setSegments(searchParamsData.segments || []);
    }
  }, [searchParamsData]);

  // hydrate from persisted storage
  useEffect(() => {
    if (!hasHydrated) return;
    const persistedData = getPersistedFlightData();
    console.log("Persisted flight data:", persistedData);
    if (persistedData?.searchParamsData) {
      dispatch(setSearchData(persistedData.searchParamsData));
    }
  }, [dispatch, hasHydrated]);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const convertToISO8601 = (date: Date | string | null): string => {
    if (!date) return "";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return parsedDate.toISOString().split("T")[0];
  };

  const getFlights = useCallback(async () => {
    if (abortController) {
      abortController.abort();
    }

    const controller = new AbortController();
    setAbortController(controller);
    setError(null);
    setLoading(true);
    setFlights([]);
    setSearchTriggered(false); // reset

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("Base URL:", baseUrl);

      // validation
      if (flightType === "oneway" && (!origin || !destination || !departure)) {
        console.warn("One-way missing params:", { origin, destination, departure });
        setError("Please provide origin, destination, and departure date.");
        setLoading(false);
        return;
      }
      if (
        flightType === "roundtrip" &&
        (!origin || !destination || !departure || !returnDate)
      ) {
        console.warn("Round-trip missing params:", {
          origin,
          destination,
          departure,
          returnDate,
        });
        setError("Please provide all required fields for round-trip.");
        setLoading(false);
        return;
      }
      if (
        flightType === "multiCities" &&
        segments.some((s) => !s.origin || !s.destination || !s.date)
      ) {
        console.warn("Multi-city missing params:", { segments });
        setError("Please complete all segments for multi-city search.");
        setLoading(false);
        return;
      }

      // build destinations payload
      const destinations =
        flightType === "multiCities"
          ? segments.map((segment, index) => ({
              id: (index + 1).toString(),
              from: segment.origin,
              to: segment.destination,
              date: convertToISO8601(segment.date),
            }))
          : flightType === "roundtrip"
          ? [
              {
                id: "1",
                from: origin,
                to: destination,
                date: convertToISO8601(departure),
              },
              {
                id: "2",
                from: destination,
                to: origin,
                date: convertToISO8601(returnDate),
              },
            ]
          : [
              {
                id: "1",
                from: origin,
                to: destination,
                date: convertToISO8601(departure),
              },
            ];

      // API call
      const response = await axios.post(
        `${baseUrl}/flights/flight-search`,
        {
          destinations,
          adults: travelers.adults,
          children: travelers.children,
          infants: travelers.infants,
          cabinClass: flightClass,
          directFlight: false,
          calendarSearch: false,
        },
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            lng: locale,
          },
        }
      );

      if (!controller.signal.aborted) {
        setFlights(
          response?.data?.data?.map((flight: any) => ({
            ...flight,
            itineraries: [...(flight?.itineraries_formated || [])],
          })) || []
        );
        setCarriers(response?.data?.filters?.carriers || []);
      }
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching flights:", error);
        setError(error.message || "Failed to fetch flights");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [
    origin,
    destination,
    departure,
    returnDate,
    travelers,
    flightType,
    flightClass,
    segments,
    locale,
    abortController,
  ]);

  // auto-trigger only if params are valid
  useEffect(() => {
    if (searchTriggered) {
      if (
        (flightType === "oneway" && origin && destination && departure) ||
        (flightType === "roundtrip" &&
          origin &&
          destination &&
          departure &&
          returnDate) ||
        (flightType === "multiCities" &&
          segments.length > 0 &&
          segments.every((s) => s.origin && s.destination && s.date))
      ) {
        getFlights();
      } else {
        console.warn("Search triggered but missing required params");
        setError("Missing required search parameters.");
        setLoading(false);
        setSearchTriggered(false);
      }
    }
  }, [searchTriggered, getFlights, origin, destination, departure, returnDate, segments, flightType]);

  return {
    flights,
    getFlights,
    loading,
    error,
    carriers,
    origin,
    destination,
    departure,
    returnDate,
    travelers,
    flightType,
    flightClass,
    segments,
    setOrigin,
    setDestination,
    setDeparture,
    setReturnDate,
    setTravelers,
    setFlightType,
    setFlightClass,
    setSegments,
    triggerSearch: () => setSearchTriggered(true),
    hasHydrated,
  };
};

export default useSearchflights;
