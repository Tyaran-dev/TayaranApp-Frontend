"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useLocale } from "next-intl";
import { getPersistedFlightData } from "@/utils/flightStorage";
import { FlightFormData } from "@/redux/flights/flightSlice";

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
  const reduxSearchParams = useSelector((state: any) => state.flightData.searchParamsData);
  const hasHydrated = useSelector((state: any) => state._persist?.rehydrated);

  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [pendingSearchParams, setPendingSearchParams] = useState<FlightFormData | null>(null);

  // local UI state (keeps existing behaviour for fields)
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0 });
  const [flightType, setFlightType] = useState("oneway");
  const [flightClass, setFlightClass] = useState("ECONOMY");
  const [segments, setSegments] = useState<FlightSegment[]>([]);
  const [carriers, setCarriers] = useState<AirlineCarrier[]>([]);

  // keep local UI state in sync with Redux (this is fine — but we will use passed params when triggering search)
  useEffect(() => {
    if (reduxSearchParams) {
      setOrigin(reduxSearchParams.origin || "");
      setDestination(reduxSearchParams.destination || "");
      setDeparture(reduxSearchParams.departure ? new Date(reduxSearchParams.departure) : null);
      setReturnDate(reduxSearchParams.returnDate ? new Date(reduxSearchParams.returnDate) : null);
      setTravelers(reduxSearchParams.travelers || { adults: 1, children: 0, infants: 0 });
      setFlightType(reduxSearchParams.flightType || "oneway");
      setFlightClass(reduxSearchParams.flightClass || "ECONOMY");
      setSegments(reduxSearchParams.segments || []);
    }
  }, [reduxSearchParams]);

  // hydrate from persisted storage (unchanged)
  useEffect(() => {
    if (!hasHydrated) return;
    const persistedData = getPersistedFlightData();
    if (persistedData?.searchParamsData) {
      // this will update redux and then the effect above will sync local UI state
      dispatch({ type: "flights/setSearchData", payload: persistedData.searchParamsData });
    }
  }, [dispatch, hasHydrated]);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (abortController) abortController.abort();
    };
  }, [abortController]);

  // Build "effective" params: priority -> overrideArg | pendingSearchParams | reduxSearchParams | local UI state
  const buildEffectiveParams = (override?: FlightFormData): FlightFormData | null => {
    if (override) return override;
    if (pendingSearchParams) return pendingSearchParams;
    if (reduxSearchParams) return reduxSearchParams;
    // fallback to local UI state if nothing else (rare)
    if (origin || destination || departure) {
      return {
        origin,
        destination,
        departure,
        returnDate,
        travelers,
        flightType,
        flightClass,
        segments,
      } as FlightFormData;
    }
    return null;
  };

  const convertToISO8601 = (date: Date | string | null): string => {
    if (!date) return "";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return parsedDate.toISOString().split("T")[0];
  };

  const getFlights = useCallback(
    async (overrideParams?: FlightFormData) => {
      if (abortController) {
        abortController.abort();
      }
      const controller = new AbortController();
      setAbortController(controller);
      setError(null);
      setLoading(true);
      setFlights([]);

      try {
        const params = buildEffectiveParams(overrideParams);
        console.log("Searching flights with params:", params, { overrideParams, pendingSearchParams, reduxSearchParams });

        if (!params) {
          setError("Missing search parameters.");
          setLoading(false);
          setSearchTriggered(false);
          return;
        }

        const { origin: pOrigin, destination: pDestination, departure: pDeparture, returnDate: pReturn, travelers: pTrav, flightType: pType, flightClass: pClass, segments: pSegments } = params as any;

        // validation
        if (pType === "oneway" && (!pOrigin || !pDestination || !pDeparture)) {
          setError("Please provide origin, destination, and departure date.");
          setLoading(false);
          setSearchTriggered(false);
          return;
        }
        if (pType === "roundtrip" && (!pOrigin || !pDestination || !pDeparture || !pReturn)) {
          setError("Please provide return date for round-trip.");
          setLoading(false);
          setSearchTriggered(false);
          return;
        }
        if (pType === "multiCities" && (!pSegments || pSegments.length === 0 || pSegments.some((s: any) => !s.origin || !s.destination || !s.date))) {
          setError("Please complete all multi-city segments.");
          setLoading(false);
          setSearchTriggered(false);
          return;
        }

        // build destinations payload
        const destinations =
          pType === "multiCities"
            ? (pSegments || []).map((segment: any, index: number) => ({
              id: (index + 1).toString(),
              from: segment.origin,
              to: segment.destination,
              date: convertToISO8601(segment.date),
            }))
            : pType === "roundtrip"
              ? [
                { id: "1", from: pOrigin, to: pDestination, date: convertToISO8601(pDeparture) },
                { id: "2", from: pDestination, to: pOrigin, date: convertToISO8601(pReturn) },
              ]
              : [{ id: "1", from: pOrigin, to: pDestination, date: convertToISO8601(pDeparture) }];

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.post(
          `${baseUrl}/flights/flight-search`,
          {
            destinations,
            adults: pTrav?.adults ?? 1,
            children: pTrav?.children ?? 0,
            infants: pTrav?.infants ?? 0,
            cabinClass: pClass ?? "ECONOMY",
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
          const mapped = response?.data?.data?.map((flight: any) => ({
            ...flight,
            itineraries: [...(flight?.itineraries_formated || [])],
          })) || [];
          setFlights(mapped);
          setCarriers(response?.data?.filters?.carriers || []);
          console.log("Flights response length:", mapped.length);
        }
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching flights:", err);
          setError(err.message || "Failed to fetch flights");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setPendingSearchParams(null);
          setSearchTriggered(false);
        }
      }
    },
    [reduxSearchParams, locale]

  );

  // when searchTriggered flips, run getFlights (it will prefer override param if set)
  useEffect(() => {
    if (searchTriggered) {
      getFlights(); // will use pendingSearchParams OR reduxSearchParams OR local state
    }
  }, [searchTriggered, getFlights]);

  // Expose triggerSearch that accepts optional params to avoid race conditions
  const triggerSearch = (params?: FlightFormData) => {
    if (params) setPendingSearchParams(params);
    setSearchTriggered(true);
  };

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
    triggerSearch,
    hasHydrated,
  };
};

export default useSearchflights;
