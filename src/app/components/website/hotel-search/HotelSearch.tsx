"use client";
import { useState, useRef, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import CustomDatePicker from "../../shared/custom-date-picker";
import axios from "axios";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // or next/router if you're using pages router
import { setHotelSearchData } from "@/redux/hotels/hotelsSlice";
import Stepper from "../../shared/Feedback/Stepper";

type Room = {
  Adults: number;
  Children: number;
  ChildrenAges: number[]; // array of ages 0–11
};

const HotelSearch = () => {
  const today = new Date();
  const locale = useLocale();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dispatch = useDispatch();
  const router = useRouter();

  const [countries, setCountries] = useState<any[]>([]);
  const [hotelcodes, setHotelCodes] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(tomorrow);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([
    { Adults: 2, Children: 0, ChildrenAges: [] },
  ]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const reponse = await axios.get(`${baseUrl}/hotels/CountryList`);
        setCountries(reponse.data.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    const fetchCities = async () => {
      try {
        const reponse = await axios.post(`${baseUrl}/hotels/CityList`, {
          CountryCode: selectedCountry,
        });

        console.log(reponse, "cities");
        setCities(reponse.data.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  const addRoom = () => {
    if (rooms.length < 6) {
      setRooms([...rooms, { Adults: 2, Children: 0, ChildrenAges: [] }]);
    }
  };

  const removeRoom = (index: number) => {
    const updated = rooms.filter((_, i) => i !== index);
    setRooms(updated);
  };

  const updateRoom = (
    index: number,
    field: "Adults" | "Children",
    value: number
  ) => {
    const updated = [...rooms];
    updated[index][field] = value;
    if (field === "Children") {
      updated[index].ChildrenAges = Array(value).fill(0);
    }
    setRooms(updated);
  };

  const handleSearch = () => {
    if (!selectedCity || !checkIn || !checkOut) {
      alert("Please select city, check-in, and check-out dates.");
      return;
    }

    const searchParams = {
      CheckIn: checkIn,
      CheckOut: checkOut,
      CityCode: selectedCity,
      Language: locale,
      GuestNationality: selectedNationality || selectedCountry,
      PreferredCurrencyCode: "SAR",
      PaxRooms: rooms,
      IsDetailResponse: true,
      ResponseTime: 23,
      Filters: {
        MealType: "All",
        Refundable: "true",
        NoOfRooms: rooms.length,
      },
    };

    dispatch(setHotelSearchData(searchParams)); // ✅ store it
    router.push(`/${locale}/hotel-search`); // ✅ navigate to search result page
  };

  const [open, setOpen] = useState(false);

  const handleAdultChange = (roomIndex: number, delta: number) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? {
              ...room,
              Adults: Math.min(6, Math.max(1, room.Adults + delta)),
            }
          : room
      )
    );
  };

  const handleChildChange = (roomIndex: number, delta: number) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? {
              ...room,
              Children: Math.min(4, Math.max(0, room.Children + delta)),
              ChildrenAges:
                delta > 0
                  ? [...room.ChildrenAges, 0].slice(0, 4)
                  : room.ChildrenAges.slice(0, room.ChildrenAges.length - 1),
            }
          : room
      )
    );
  };

  const handleAgeChange = (
    roomIndex: number,
    childIndex: number,
    value: number
  ) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? {
              ...room,
              ChildrenAges: room.ChildrenAges.map((age, j) =>
                j === childIndex ? value : age
              ),
            }
          : room
      )
    );
  };

  const totalSummary = `${rooms.length} Room${
    rooms.length > 1 ? "s" : ""
  }, ${rooms.reduce((sum, r) => sum + r.Adults, 0)} Adults, ${rooms.reduce(
    (sum, r) => sum + r.Children,
    0
  )} Child${rooms.reduce((sum, r) => sum + r.Children, 0) !== 1 ? "ren" : ""}`;

  return (
    <div className="p-4 max-w-3xl mx-auto ">
      {/* <h2 className="text-lg font-semibold mb-4">Search Hotels</h2> */}
      {/* Country & City */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="mb-2 md:w-1/2">
          <label className="hidden md:block mb-2 text-sm text-[#12121299]">
            Select Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border p-3 w-full rounded-lg"
          >
            <option disabled value="">
              Select a country
            </option>
            {countries.map((country, indx) => (
              <option key={country.Code + indx} value={country.Code}>
                {country.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 md:w-1/2">
          <label className="hidden md:block mb-2 text-[#12121299] text-sm">
            Select City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border p-3 w-full rounded-lg"
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.Code} value={city.Code}>
                {city.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <div className=" md:w-1/2">
          <CustomDatePicker
            label="Check-In Date"
            placeholder="Check-In Date"
            value={checkIn}
            className="border py-2 !border-borderColor rounded-xl text-xs"
            minDate={today}
            onChange={(date: Date | null) => setCheckIn(date)}
          />
        </div>

        <div className="mb-1 md:w-1/2">
          <CustomDatePicker
            label="Check-Out Date"
            placeholder="Check-Out Date"
            value={checkOut}
            className="border py-2 !border-borderColor rounded-xl text-xs"
            minDate={checkIn || undefined} // ✅ Fixes the type error
            onChange={(date: Date | null) => setCheckOut(date)}
          />
        </div>
      </div>

      {/* Rooms Section */}
      <div className="relative w-full mb-4 flex">
        <button
          onClick={() => setOpen(!open)}
          className="border px-4 py-2 rounded-md w-full text-left"
        >
          👤 {totalSummary}
        </button>
        {open && (
          <div className="absolute mt-2 z-50 bg-white shadow-xl rounded-lg w-[300px] p-4 space-y-4">
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Room {roomIndex + 1}</span>
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(roomIndex)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-2 space-y-3">
                  {/* Adults */}
                  <div className="flex justify-between items-center">
                    <span>Adults</span>
                    <div className="flex items-center justify-between  gap-2">
                      <button
                        onClick={() => handleAdultChange(roomIndex, -1)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span>{room.Adults}</span>
                      <button
                        onClick={() => handleAdultChange(roomIndex, 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between items-center">
                    <span>Children</span>
                    <div className="flex items-center justify-between  gap-2">
                      <button
                        onClick={() => handleChildChange(roomIndex, -1)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span className="">{room.Children}</span>
                      <button
                        onClick={() => handleChildChange(roomIndex, 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children Ages */}
                  {room.ChildrenAges.length > 0 && (
                    <div className="space-y-2">
                      {room.ChildrenAges.map((age, childIndex) => (
                        <div
                          key={childIndex}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">
                            Child {childIndex + 1} Age
                          </span>
                          <select
                            className="border rounded p-2 text-sm text-[#12121299]"
                            value={age}
                            onChange={(e) =>
                              handleAgeChange(
                                roomIndex,
                                childIndex,
                                parseInt(e.target.value)
                              )
                            }
                          >
                            {Array.from({ length: 18 }).map((_, i) => (
                              <option key={i} value={i}>
                                {i + 1} yrs
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Room */}
            {rooms.length < 6 && (
              <button
                onClick={addRoom}
                className="w-full mt-2 border border-dashed border-emerald-600 text-emerald-600 rounded py-2 text-sm hover:bg-blue-50"
              >
                + Add Room
              </button>
            )}

            {/* Done */}
            <button
              onClick={() => setOpen(false)}
              className="w-full mt-4 bg-greenGradient text-white rounded py-2"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className=" w-full flex items-center justify-between gap-4">
        <div className="w-[50%]">
          <button
            onClick={handleSearch}
            className="bg-greenGradient text-white px-2 py-3 rounded-lg w-full"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Hotels"}
          </button>
        </div>
        <div className="w-[50%]">
          <div className=" w-full">
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="border p-3 w-full rounded-lg"
            >
              <option disabled value="">
                Select your nationality
              </option>
              {countries.map((country, indx) => (
                <option key={country.Code + indx} value={country.Code}>
                  {country.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
