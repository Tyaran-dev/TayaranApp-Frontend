"use client";

import { getCountries, getCities, searchHotels, getHotelCode } from "@/actions/hotel-actions";
import CustomDatePicker from "@/app/components/shared/custom-date-picker";
import DropdownWithSearch from "@/app/components/shared/custom-hotel-dropdown";
import RoomSelection from "@/app/components/shared/room-selection";
import { LoaderPinwheel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import {useTranslations} from 'next-intl';


const HotelSearch = ({ className }: { className?: string }) => {
    const t = useTranslations('HomePage');
    const e = useTranslations('errors');

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[]>([{id:1, Adults: 1, Children: 0, ChildrenAges: [] }]);
    const [hotelcodes, setHotelCodes] = useState<any[]>([]);
  const router = useRouter()

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getCountries();
                setCountries(data.CountryList || []);
            } catch (error) {
                console.error(e("hotelErrorFetchingCountries"), error);
            }
        };
        fetchCountries();
    }, []);
    useEffect(() => {
        const fetchHotelCode = async () => {
            try {
                const data = await getHotelCode();
                // console.log(data)
                setHotelCodes(data || []);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchHotelCode();
    }, []);
    // console.log(hotelcodes.slice(0, 99).join(","))
    useEffect(() => {
        const fetchCities = async () => {
            if (!selectedCountry) return;
            try {
                const data = await getCities(selectedCountry);
                setCities(data?.CityList || []);
            } catch (error) {
                console.error(e("hotelErrorFetchingcities"), error);
            }
        };
        fetchCities();
    }, [selectedCountry]);

    const handleSearch = async () => {
        if (!selectedCity || !checkIn || !checkOut) {
            alert(e("hotelSearchAlert"));
            return;
        }

        setLoading(true);
        router.push(
            `/hotel-search?CheckIn=${encodeURIComponent(checkIn.toISOString().split('T')[0])}&CheckOut=${encodeURIComponent(checkOut.toISOString().split('T')[0])}&CityCode=${encodeURIComponent(selectedCity)}&GuestNationality=${encodeURIComponent(selectedCountry)}
            `
    //         & PaxRooms=${
    //             encodeURIComponent(
    //                 JSON.stringify(rooms.map(room => ({
    //                     Adults: room.Adults,
    //                     Children: room.Children,
    //                     ChildrenAges: room.ChildrenAges
    //                 })))
    //         )
    // }
        );

        // try {
            // const searchParams = {
            //     CheckIn: checkIn.toISOString().split('T')[0],
            //     CheckOut: checkOut.toISOString().split('T')[0],
            //     CityCode: selectedCity,
            //     GuestNationality: selectedCountry,
            //     PaxRooms: rooms,
            //     HotelCodes: hotelcodes.slice(0, 99).join(","), 
            //     PreferredCurrencyCode: "AED",
            //     IsDetailResponse: true,
            //     ResponseTime: 23,
            //     Filters: { MealType: "All", Refundable: "true", NoOfRooms: 0 },
            // };
            // const data = await searchHotels(searchParams);
            // setHotels(data?.HotelSearchResults || []);
        // } catch (error) {
        //     console.error("Error searching hotels:", error);
        // }
        setLoading(false);
    };
    // console.log("hotels", hotels)
    return (
        <div className="p-4">
            <div className={`grid grid-cols-2 gap-4 ${className}`}>
                <DropdownWithSearch
                    label={t('heroSection.searchForm.hotelCountryLabel')}
                    options={countries}
                    selectedOption={selectedCountry}
                    setSelectedOption={setSelectedCountry}
                    placeholder={t('heroSection.searchForm.hotelCountryLabel')}
                />

                {selectedCountry && (
                    <DropdownWithSearch
                        label={t('heroSection.searchForm.hotelCityLabel')}
                        options={cities}
                        selectedOption={selectedCity}
                        setSelectedOption={setSelectedCity}
                        placeholder={t('heroSection.searchForm.hotelCityLabel')}
                    />
                )}

                <CustomDatePicker
                    label={t('heroSection.searchForm.hotelCheckInDate')}
                    placeholder={t('heroSection.searchForm.hotelCheckInDate')}
                    value={checkIn}
                    minDate={new Date()}
                    onChange={(date: Date | null) => setCheckIn(date)}
                />

                <CustomDatePicker
                    label={t('heroSection.searchForm.hotelCheckOutDate')}
                    placeholder={t('heroSection.searchForm.hotelCheckOutDate')}
                    value={checkOut}
                    minDate={checkIn ? new Date(checkIn) : undefined}
                    onChange={(date: Date | null) => setCheckOut(date)}
                />

                <RoomSelection rooms={rooms} setRooms={setRooms} />

                <button onClick={handleSearch}
                    className="py-3 w-48 md:text-xl mt-2 justify-center text-base rounded-2xl text-white bg-greenGradient flex gap-2 items-center hover:scale-105 duration-300 transition-all"
                >
                    {loading ? (
                        <>
                            <LoaderPinwheel /> {t('heroSection.searchForm.searchButtonLoading')}
                        </>
                    ) : (
                        <>
                            <LuSearch /> {t('heroSection.searchForm.searchButton')}
                        </>
                    )}
                </button>
            </div>

            {loading && <p>{t('heroSection.searchForm.loadingText')}</p>}
        </div>
    );
};

export default HotelSearch;
