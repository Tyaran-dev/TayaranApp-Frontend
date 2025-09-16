"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { LoaderPinwheel } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { setHotelSearchData } from "@/redux/hotels/hotelsSlice";
import { useHotelSearchForm } from "@/hooks/useSearchHotels";

import CustomDatePicker from "@/app/components/shared/custom-date-picker";
import DropdownWithSearch from "@/app/components/shared/custom-hotel-dropdown";

const HotelSearch = ({ className }: { className?: string }) => {
  const t = useTranslations("HomePage");
  const e = useTranslations("errors");
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    countries,
    cities,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    rooms,
    selectedNationality,
    setSelectedNationality,
    addRoom,
    removeRoom,
    handleAdultChange,
    handleChildChange,
    handleAgeChange,
    totalSummary,
    open,
    setOpen,
    today,
  } = useHotelSearchForm();

  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!selectedCity || !checkIn || !checkOut) {
      alert(e("hotelSearchAlert"));
      return;
    }

    const searchParams = {
      CheckIn: checkIn,
      CheckOut: checkOut,
      CityCode: selectedCity,
      GuestNationality: selectedCountry,
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

    setLoading(true);

    try {
      // Save in Redux
      dispatch(setHotelSearchData(searchParams));

      // Navigate (keep locale if needed)
      //   router.push(`/hotels/search`);
    } catch (err) {
      console.error("Hotel search error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 shadow-lg border rounded-lg ">
      <div className="grid gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DropdownWithSearch
            label={t("heroSection.searchForm.hotelCountryLabel")}
            options={countries}
            selectedOption={selectedCountry}
            setSelectedOption={setSelectedCountry}
            placeholder={t("heroSection.searchForm.hotelCountryLabel")}
            className="border rounded-lg"
          />

          <DropdownWithSearch
            label={t("heroSection.searchForm.hotelCityLabel")}
            options={cities}
            selectedOption={selectedCity}
            setSelectedOption={setSelectedCity}
            placeholder={t("heroSection.searchForm.hotelCityLabel")}
            className="border rounded-lg"
          />

          <CustomDatePicker
            label={t("heroSection.searchForm.hotelCheckInDate")}
            placeholder={t("heroSection.searchForm.hotelCheckInDate")}
            value={checkIn}
            minDate={today}
            onChange={(date: Date | null) => setCheckIn(date)}
            className="border rounded-lg"
          />

          <CustomDatePicker
            label={t("heroSection.searchForm.hotelCheckOutDate")}
            placeholder={t("heroSection.searchForm.hotelCheckOutDate")}
            value={checkOut}
            minDate={checkIn || undefined}
            onChange={(date: Date | null) => setCheckOut(date)}
            className="border rounded-lg"
          />
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center flex-col md:flex-row  gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:gap-36">
            {/* Rooms Section */}
            <div className="relative  flex">
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
                        <span className="font-semibold">
                          Room {roomIndex + 1}
                        </span>
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
            <div className="">
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

          {/* Search Button */}
          <div className="flex w-full">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="py-3 w-full md:w-48 md:text-xl text-base rounded-2xl text-white bg-greenGradient flex gap-2 items-center justify-center hover:scale-105 duration-300 transition-all"
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
      </div>
    </div>
  );
};

export default HotelSearch;
