"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Minus } from "lucide-react";
import AirportSearchField from "../../shared/airport-search-field";
import CustomDatePicker from "../../shared/custom-date-picker";
import Travelers from "../../shared/traveller-field";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { changeTripType, setSearchData, clearFlightData } from "@/redux/flights/flightSlice";
import { useDispatch, useSelector } from "react-redux";
import useSearchflights from "@/hooks/useSearchflights";
import { v4 as uuidv4 } from 'uuid';

export const tripTypes = ["roundtrip", "oneway", "multiCities"] as const;

interface FlightSegment {
  id: string;
  origin: string;
  destination: string;
  date: Date | null;
}

const FlightSearchForm = () => {
  const t = useTranslations("searchForm");
  const locale = useLocale();
  const dispatch = useDispatch();
  const tripType = useSelector((state: any) => state.flightData.tripType);
  
  const {
    flights,
    loading,
    error,
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
    setFlightClass,
    setSegments,
    triggerSearch,
    hasHydrated
  } = useSearchflights();

  const [multiCitySegments, setMultiCitySegments] = useState<FlightSegment[]>(() => {
    if (tripType === "multiCities" && segments?.length > 0) {
      return segments.map(s => ({
        id: s.id || uuidv4(),
        origin: s.origin,
        destination: s.destination,
        date: s.date
      }));
    }
    return [
      { id: uuidv4(), origin: "", destination: "", date: null },
      { id: uuidv4(), origin: "", destination: "", date: null }
    ];
  });

  useEffect(() => {
    if (tripType === "multiCities" && segments?.length > 0) {
      setMultiCitySegments(segments);
    }
  }, [tripType, segments]);

  const handleAddSegment = () => {
    setMultiCitySegments([...multiCitySegments, 
      { id: uuidv4(), origin: "", destination: "", date: null }
    ]);
  };

  const handleRemoveSegment = (index: number) => {
    if (multiCitySegments.length > 1) {
      const updated = [...multiCitySegments];
      updated.splice(index, 1);
      setMultiCitySegments(updated);
    }
  };

  const handleSegmentChange = (index: number, field: keyof FlightSegment, value: any) => {
    const updated = [...multiCitySegments];
    updated[index] = { ...updated[index], [field]: value };
    setMultiCitySegments(updated);
  };

  const validateInputs = () => {
    if (tripType === "oneway") {
      if (!origin || !destination || !departure) {
        toast.error(t("errors.missingFields"));
        return false;
      }
    } else if (tripType === "roundtrip") {
      if (!origin || !destination || !departure || !returnDate) {
        toast.error(t("errors.missingFieldsRoundtrip"));
        return false;
      }
    } else if (tripType === "multiCities") {
      if (multiCitySegments.some(s => !s.origin || !s.destination || !s.date)) {
        toast.error(t("errors.missingMultiCityFields"));
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    dispatch(clearFlightData());
    
    const searchData = {
      origin: tripType === "multiCities" ? multiCitySegments[0].origin : origin,
      destination: tripType === "multiCities" 
        ? multiCitySegments[multiCitySegments.length - 1].destination 
        : destination,
      departure: tripType === "multiCities" ? multiCitySegments[0].date : departure,
      returnDate,
      travelers,
      flightType: tripType,
      flightClass,
      segments: tripType === "multiCities" ? multiCitySegments : []
    };

    dispatch(setSearchData(searchData));

    if (tripType === "multiCities") {
      setSegments(multiCitySegments);
    }

    // Trigger the search after state updates
    setTimeout(() => {
      triggerSearch();
    }, 0);
  };

  const flightClassOptions = [
    { label: t("flightClass.economy"), value: "ECONOMY" },
    { label: t("flightClass.premiumEconomy"), value: "PREMIUM_ECONOMY" },
    { label: t("flightClass.business"), value: "BUSINESS" },
    { label: t("flightClass.firstClass"), value: "FIRST" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4  rounded-3xl border shadow-sm py-4 px-6 w-full mx-auto">
      {/* Trip Type Selector */}
      <div className="flex gap-4 flex-wrap w-full">
        {tripTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => dispatch(changeTripType(type))}
            className={`px-4 py-2 font-medium text-base rounded-lg ${
              tripType === type ? "bg-greenGradient text-white" : "bg-[#EEEEEE]"
            }`}
          >
            {type === "roundtrip" ? t("tripTypes.roundtrip") : 
             type === "oneway" ? t("tripTypes.oneway") : t("tripTypes.multiplecities")}
          </button>
        ))}
      </div>

      {/* Passengers and Class */}
      <div className="flex items-center gap-4 my-4">
        <div className="lg:w-1/5 w-full border border-borderColor rounded-lg">
          <Travelers
            adults={travelers.adults}
            children={travelers.children}
            infants={travelers.infants}
            setAdults={(value) => setTravelers({ ...travelers, adults: value })}
            setChildren={(value) => setTravelers({ ...travelers, children: value })}
            setInfants={(value) => setTravelers({ ...travelers, infants: value })}
          />
        </div>
        <div className="lg:w-1/5">
          <select
            className="h-full w-full border border-borderColor rounded-lg px-4 py-2"
            value={flightClass}
            onChange={(e) => setFlightClass(e.target.value)}
          >
            {flightClassOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Fields */}
      {tripType !== "multiCities" ? (
        <div className="flex gap-7 justify-start flex-wrap items-center">
          <div className="relative lg:w-1/5 w-full">
            <AirportSearchField
              placeholder={t("from")}
              defaultValue={origin}
              onSelect={setOrigin}
              className="border rounded-lg py-2 !border-borderColor"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
            className="py-2 px-5 bg-emerald-700 lg:block hidden rounded-lg text-white"
          >
            &#8644;
          </button>

          <div className="relative lg:w-1/5 w-full">
            <AirportSearchField
              placeholder={t("to")}
              defaultValue={destination}
              onSelect={setDestination}
              className="border rounded-lg py-2 !border-borderColor"
            />
          </div>

          <div className="relative lg:w-1/5 w-full">
            <CustomDatePicker
              value={departure}
              minDate={new Date()}
              onChange={setDeparture}
              className="px-4 py-2 w-full rounded-lg border border-borderColor"
            />
          </div>

          {tripType === "roundtrip" && (
            <div className="relative lg:w-1/5 w-full">
              <CustomDatePicker
                value={returnDate}
                minDate={departure}
                onChange={setReturnDate}
                className="px-4 py-2 w-full rounded-lg border border-borderColor"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {multiCitySegments.map((segment, index) => (
            <div key={segment.id} className="flex gap-4 items-center flex-wrap">
              <div className="relative lg:w-[30%] w-full">
                <AirportSearchField
                  placeholder={t("from")}
                  defaultValue={segment.origin}
                  onSelect={(value) => handleSegmentChange(index, "origin", value)}
                  className="border rounded-lg py-2 !border-borderColor"
                />
              </div>

              <div className="relative lg:w-[30%] w-full">
                <AirportSearchField
                  placeholder={t("to")}
                  defaultValue={segment.destination}
                  onSelect={(value) => handleSegmentChange(index, "destination", value)}
                  className="border rounded-lg py-2 !border-borderColor text-sm"
                />
              </div>

              <div className="relative lg:w-[30%] w-full">
                <CustomDatePicker
                  value={segment.date}
                  minDate={index > 0 ? multiCitySegments[index - 1].date || undefined : new Date()}
                  onChange={(date) => handleSegmentChange(index, "date", date)}
                  className="px-4 py-2 w-full rounded-lg text-sm border border-borderColor"
                />
              </div>

              {multiCitySegments.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSegment(index)}
                  className="bg-red-500 text-white py-4 px-3 rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSegment}
            className="flex items-center bg-emerald-700 text-white rounded-lg p-4 gap-2"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Button */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-700 text-white disabled:bg-emerald-600/50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">↻</span>
              {t("loadingButton")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t("searchButton")} <Search className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default FlightSearchForm;