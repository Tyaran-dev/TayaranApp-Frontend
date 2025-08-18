import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import CustomSelect from "../../shared/customSelect";
import { AiroplanIcon, ArrowCircleIcon, BedIcon } from "@/app/svg";
import { LuSearch } from "react-icons/lu";
import Section from "../../shared/section";
import AirportSearchField from "../../shared/airport-search-field";

import fromImg from "/public/assets/from.png";
import toImg from "/public/assets/to.png";
import Travelers from "../../shared/traveller-field";
import CustomDatePicker from "../../shared/custom-date-picker";
import { LoaderPinwheel, Search } from "lucide-react";
import { changeTripType, clearFlightData } from "@/redux/flights/flightSlice";
import { useDispatch, useSelector } from "react-redux";
import { TripType } from "@/redux/flights/flightSlice";
import { tripTypes } from "../flight-search/search-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import HotelSearch from "../hotel-search/HotelSearch";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { setSearchData } from "@/redux/flights/flightSlice";

export interface FlightSegment {
  id: string;
  origin: string;
  destination: string;
  date: Date;
}

interface FlightFormData {
  origin: string;
  destination: string;
  departure: Date;
  returnDate: Date;
  travelers: { adults: number; children: number; infants: number; };
  flightClass: string;
  flightType: string;
  segments?: FlightSegment[];
}

interface Room {
  id: number;
  adults: number;
  children: number;
}

const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const e = useTranslations("errors");
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchedAirports, setSearchedAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [fromError, setFromError] = useState<string | null>(null);
  const [toError, setToError] = useState<string | null>(null);
  const [isHotel, setIsHotel] = useState(false);
  const [searchTermFrom, setSearchTermFrom] = useState("");
  const [searchTermTo, setSearchTermTo] = useState("");
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, adults: 1, children: 0 }]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [flightFormData, setFlightFormData] = useState<FlightFormData>({
    origin: "",
    destination: "",
    departure: today,
    returnDate: tomorrow,
    travelers: {
      adults,
      children,
      infants
    },
    flightClass: "",
    flightType: "oneway", // Explicit type assertion
    segments: [{ id: "", origin: "", destination: "", date: new Date() }]
  });
  const [hotelFormData, setHotelFormData] = useState({
    address: "",
    checkIn: "",
    checkOut: "",
    travelers: "",
  });

  const flightClassOptions = [
    { label: "Economy", value: "ECONOMY" },
    { label: "Premium Economy", value: "PREMIUM_ECONOMY" },
    { label: "Business", value: "BUSINESS" },
    { label: "First Class", value: "FIRST" },
  ];

  const travelerOptions = [
    { label: "1 Traveler", value: "1" },
    { label: "2 Travelers", value: "2" },
    { label: "3 Travelers", value: "3" },
  ];

  const GetAirpports = async (keyword: string) => {
    try {
      setLoading(true);
      const data = await axios.get(`/api/airports?keyword=${keyword}`);
      setSearchedAirports(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlightChange = (name: string, value: any) => {
    setFlightFormData(prev => ({ ...prev, [name]: value }));
    if (name === "origin") setFromError(null);
    if (name === "destination") setToError(null);
  };

  const handleSegmentChange = (index: number, field: keyof FlightSegment, value: any) => {
    setFlightFormData(prev => {
      const newSegments = [...prev.segments!];
      newSegments[index] = { ...newSegments[index], [field]: value };
      return { ...prev, segments: newSegments };
    });
  };

  const addFlightSegment = () => {
    setFlightFormData(prev => ({
      ...prev,
      segments: [...prev.segments!, { id: uuidv4(), origin: "", destination: "", date: new Date() }]
    }));
  };

  useEffect(() => {
  }, [flightFormData.segments]);

  const removeFlightSegment = (index: number) => {
    // Don't allow removing the last segment
    if (flightFormData.segments!.length <= 1) return;


    setFlightFormData(prev => ({
      ...prev,
      segments: prev.segments!.filter((_, i) => i !== index)
    }));
  };

  const handleFlightTypeChange = (type: TripType) => {
    dispatch(changeTripType(type));
    handleFlightChange("flightType", type);
    if (type !== "multiCities") {
      setFlightFormData(prev => ({
        ...prev,
        segments: [{ id: "", origin: "", destination: "", date: new Date() }]
      }));
    }
  };

  const handleFlightSubmit = () => {
    setLoading(true);

    // Validation
    if (flightFormData.flightType === "multiCities") {
      const hasEmptyFields = flightFormData.segments?.some(
        segment => !segment.origin || !segment.destination || !segment.date
      );
      if (hasEmptyFields) {
        setFromError(e("fromError"));
        setToError(e("toError"));
        setLoading(false);
        return;
      }
    } else {
      if (!flightFormData.origin || !flightFormData.destination) {
        if (!flightFormData.origin) setFromError(e("fromError"));
        if (!flightFormData.destination) setToError(e("toError"));
        setLoading(false);
        return;
      }
    }

    dispatch(setSearchData(flightFormData))
    router.push(`/${locale}/flight-search`);
    setLoading(false);
  };

  const toggleHotlFlight = () => setIsHotel(!isHotel);

  useEffect(() => {
    if (searchTermFrom) GetAirpports(searchTermFrom);
    if (searchTermTo) GetAirpports(searchTermTo);
  }, [searchTermFrom, searchTermTo]);

  return (
    <div className={`w-full ${isHotel ? "bg-heroHotelsBanner" : "bg-heroFligthsBanner"} min-h-screen 2xl:min-h-auto py-20 lg:py-32 flex items-center bg-bottom bg-no-repeat bg-cover`}>
      <Section className="">
        <div className="  gap-8 flex flex-col lg:flex-row justify-center items-center ">
          <div className="w-full text-white flex flex-col text-center gap-6">
            <h1 className="font-cairo font-bold lg:text-7xl text-5xl">
              {t("heroSection.mainHeading")}
            </h1>
            <p className="font-montserrat font-bold text-lg">
              {t("heroSection.subHeading")}
            </p>
          </div>

          <div className=" relative bg-white rounded-2xl py-6  bg-top-right lg:h-full px-5 h-auto bg-no-repeat bg-contain min-w-[50%]">
            {/* form header */}
            <div className={` flex justify-between gap-4 w-full py-2 ${isHotel ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  {isHotel ? <BedIcon color={"#000"} /> : <AiroplanIcon color={"#121212"} />}
                  <h1 className="text-xl font-[400]">
                    {isHotel ? t("heroSection.searchForm.formTypeHotels") : t("heroSection.searchForm.formTypeFlights")}
                  </h1>
                </div>
                <div className="cursor-pointer" onClick={toggleHotlFlight}>
                  <ArrowCircleIcon />
                </div>
              </div>

              <button
                className="w-64 py-4 px-4 md:text-lg text-base font-semibold rounded-2xl text-white bg-greenGradient justify-center flex gap-1 items-center hover:scale-105 duration-300 transition-all"
                onClick={toggleHotlFlight}
              >
                {isHotel ? <AiroplanIcon color={"#fff"} /> : <BedIcon color={"#fff"} />}
                {isHotel ? t("heroSection.searchForm.formTypeFlights") : t("heroSection.searchForm.formTypeHotels")}
              </button>
            </div>

            {!isHotel ? (
              <div className="pb-5">
                <div className="flex items-center flex-wrap lg:gap-7 gap-4 py-3 lg:py-3 px-6">
                  {tripTypes?.map((type) => (
                    <div className="flex items-center gap-2 text-sm md:text-md" key={type}>
                      <input
                        type="radio"
                        name="flightType"
                        value={type}
                        className="h-[13px] md:h-[17px] w-[13px] md:w-[17px] custom-input-color"
                        defaultChecked={flightFormData.flightType === type}
                        onClick={() => handleFlightTypeChange(type)}
                      />
                      <p>{type.replace("-", " ")}</p>
                    </div>
                  ))}
                </div>

                {flightFormData.flightType === "multiCities" ? (
                  // ✅ Your existing multiCities layout (unchanged)
                  <div className="space-y-4">
                    {flightFormData.segments?.map((segment, index) => (
                      <div key={segment.id} className="border rounded-xl border-bordered gap-4 py-4 !mt-6 px-4">
                        <div className="flex justify-between gap-4 mb-2">
                          <div className="w-full lg:w-1/2">
                            <AirportSearchField
                              error={index === 0 ? fromError : undefined}
                              label={t("heroSection.searchForm.fromFieldLabel")}
                              placeholder={t("heroSection.searchForm.fromFieldLabel")}
                              className="border w-full py-2 !border-borderColor rounded-xl text-sm"
                              onSelect={(value) => handleSegmentChange(index, "origin", value)}
                              icon={fromImg}
                            />
                          </div>

                          <div className="w-full lg:w-1/2">
                            <AirportSearchField
                              error={index === 0 ? toError : undefined}
                              label={t("heroSection.searchForm.toFieldLabel")}
                              placeholder={t("heroSection.searchForm.toFieldLabel")}
                              className="border w-full py-2 !border-borderColor rounded-xl text-sm"
                              onSelect={(value) => handleSegmentChange(index, "destination", value)}
                              icon={toImg}
                            />
                          </div>
                        </div>

                        <div className="mb-2">
                          <CustomDatePicker
                            label={t("heroSection.searchForm.DatePicker")}
                            placeholder={t("heroSection.searchForm.DatePicker")}
                            value={segment.date}
                            className="border py-2 !border-borderColor rounded-xl text-xs"
                            minDate={
                              index > 0
                                ? flightFormData.segments![index - 1].date || undefined
                                : new Date()
                            }
                            onChange={(date) => handleSegmentChange(index, "date", date)}
                          />
                        </div>

                        <div className="flex items-center mx-4 self-end">
                          {flightFormData.segments!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFlightSegment(index)}
                              className="bg-red-500 py-2 px-2 rounded-lg text-md flex justify-between items-center gap-2 mt-2"
                            >
                              <MdDelete color={"#fff"} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addFlightSegment}
                      className="flex items-center bg-emerald-900 rounded-lg justify-between p-4 gap-2 capitalize"
                    >
                      <IoMdAdd color={"#fff"} />
                    </button>
                  </div>
                ) : (
                  // ✅ Updated layout for oneway/roundtrip to match multiCities
                  <div className=" rounded-xl border-bordered gap-4 py-4 !mt-6 px-4 space-y-4">
                    <div className="flex justify-between gap-4 mb-2">
                      <div className="w-full lg:w-1/2">
                        <AirportSearchField
                          error={fromError}
                          label={t("heroSection.searchForm.fromFieldLabel")}
                          placeholder={t("heroSection.searchForm.fromFieldLabel")}
                          className="border w-full py-2 !border-borderColor rounded-xl text-sm"
                          onSelect={(value) => handleFlightChange("origin", value)}
                          icon={fromImg}
                        />
                      </div>

                      <div className="w-full lg:w-1/2">
                        <AirportSearchField
                          error={toError}
                          label={t("heroSection.searchForm.toFieldLabel")}
                          placeholder={t("heroSection.searchForm.toFieldLabel")}
                          className="border w-full py-2 !border-borderColor rounded-xl text-sm"
                          onSelect={(value) => handleFlightChange("destination", value)}
                          icon={toImg}
                        />
                      </div>
                    </div>

                    <div className="mb-2 flex gap-4">
                      <CustomDatePicker
                        label={t("heroSection.searchForm.DatePicker")}
                        placeholder={t("heroSection.searchForm.DatePicker")}
                        value={flightFormData.departure}
                        className="border py-2 !border-borderColor rounded-xl text-xs"
                        minDate={new Date()}
                        onChange={(date) => handleFlightChange("departure", date)}
                      />

                      {flightFormData.flightType === "roundtrip" && (
                        <CustomDatePicker
                          label={t("heroSection.searchForm.returnDate")}
                          placeholder={t("heroSection.searchForm.returnDate")}
                          value={flightFormData.returnDate}
                          className="border py-2 !border-borderColor rounded-xl text-xs"
                          minDate={flightFormData.departure}
                          onChange={(date) => handleFlightChange("returnDate", date)}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className=" border-bordered gap-12 py-4 mt-2 grid lg:grid-cols-4 px-4">
                  <Travelers
                    label={t("heroSection.searchForm.travelersLabel")}
                    adults={flightFormData.travelers.adults}
                    children={flightFormData.travelers.children}
                    infants={flightFormData.travelers.infants}
                    setFlightFormData={setFlightFormData}
                  />

                  <CustomSelect
                    options={flightClassOptions}
                    placeholder={t("heroSection.searchForm.classLabel")}
                    label={t("heroSection.searchForm.classLabel")}
                    name="flightClass"
                    value={flightFormData.flightClass}
                    onChange={(value) => handleFlightChange("flightClass", value)}
                  />
                  <button
                    disabled={loading}
                    onClick={handleFlightSubmit}
                    className="py-3 px-4 w-full md:text-xl mt-2 justify-center text-base rounded-3xl text-white bg-greenGradient flex gap-2 items-center hover:scale-105 duration-300 transition-all col-span-2"
                  >
                    {loading ? (
                      <>
                        <LoaderPinwheel />
                        {t("heroSection.searchForm.searchButtonLoading")}
                      </>
                    ) : (
                      <>
                        <LuSearch /> {t("heroSection.searchForm.searchButton")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div >
                <HotelSearch />
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HeroSection;
