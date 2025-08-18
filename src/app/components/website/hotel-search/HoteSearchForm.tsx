'use client';

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import fromImg from "/public/assets/from.png";
import toImg from "/public/assets/to.png";
import { Search } from "lucide-react";
import AirportSearchField from "../../shared/airport-search-field";
import CustomDatePicker from "../../shared/custom-date-picker";
import Travelers from "../../shared/traveller-field";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const HoteSearchForm: React.FC<any> = ({
    setFlights,
    setLoading,
    loading,
    setOrigin,
    setDestination,
    origin,
    destination,
    departureDate,
    setDepartureDate,
    setReturnDate,
    returnDate,
    travelers,
    setTravelers,
    setFlightClass,
    flightClass,
}) => {
    const [tripType, setTripType] = useState(returnDate ? "roundtrip" : "oneway");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        console.log(origin, destination, departureDate)
        if (!origin || !destination || !departureDate) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        setError(null);

        router.push(
            `/flight-search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&departureDate=${encodeURIComponent(departureDate.toISOString())}${returnDate ? `&returnDate=${encodeURIComponent(returnDate.toISOString())}` : ''}&class=${encodeURIComponent(flightClass)}&adult=${travelers.adults}&child=${travelers.children}&lapinfant=${travelers.infants}`
        );

        // try {
        //     const response = await axios.get(`/api/search-flights`, {
        //         params: {
        //             origin: origin,
        //             destination: destination,
        //             departureDate: departureDate.toISOString(),
        //             returnDate: tripType === "roundtrip" ? returnDate.toISOString() : undefined,
        //             travelers: travelers.adults + travelers.children + travelers.infants,
        //             flightClass
        //         }
        //     });
        //     setFlights?.(response.data.data);
        // } catch (err) {
        //     setError("There was an error fetching flight data.");
        // } finally {
        //     setLoading(false);
        // }
    };

    const flightClassOptions = [
        { label: "Economy", value: "ECONOMY" },
        { label: "Premium Economy", value: "PREMIUM_ECONOMY" },
        { label: "Business", value: "BUSINESS" },
        { label: "First Class", value: "FIRST" },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex gap-4 flex-wrap w-full">
                {["roundtrip", "oneway", "multiCities"].map((type) => (
                    <button
                        key={type}
                        type="button"
                        aria-label={type}
                        onClick={() => setTripType(type)}
                        className={`px-4 py-2 font-medium text-base rounded-2xl ${tripType === type
                            ? "bg-greenGradient text-white"
                            : "bg-[#EEEEEE] text-black"
                            }`}
                    >
                        {type === "roundtrip"
                            ? "Back and forth"
                            : type === "oneway"
                                ? "One way only"
                                : "Multiple cities"}
                    </button>
                ))}
            </div>

            {/* Passenger and Class Selection */}
            <div className="flex items-center gap-4 my-4">
                <div className="lg:w-1/5 w-full  border border-borderColor rounded-2xl">
                    <Travelers
                        label=""
                        adults={travelers.adults}
                        setAdults={(value) => setTravelers({ ...travelers, adults: value })}
                        children={travelers.children}
                        setChildren={(value) => setTravelers({ ...travelers, children: value })}
                        infants={travelers.infants}
                        setInfants={(value) => setTravelers({ ...travelers, infants: value })}
                    /></div>
                <select
                    className="px-4 py-3 lg:w-1/5 w-full rounded-2xl border border-borderColor"
                    name="class"
                    aria-label="Class"
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

            {/* From, To, and Dates */}
            <div className="flex gap-7 justify- flex-wrap items-center">
                <div className="relative lg:w-1/5 w-full">
                    <AirportSearchField
                        label=""
                        placeholder="From"
                        defaultValue={origin}

                        className="border rounded-2xl py-3 !border-borderColor"
                        onSelect={(value) => setOrigin(value)}
                        icon={fromImg}
                    />
                </div>

                <button
                    type="button"
                    aria-label="Swap Locations"
                    className="py-3 px-5 bg-green lg:block hidden rounded-md text-white"
                    onClick={() => {
                        const temp = destination;
                        setOrigin(origin);
                        setDestination(temp);
                    }}
                >
                    &#8644;
                </button>

                <div className="relative lg:w-1/5 w-full">
                    <AirportSearchField
                        label=""
                        placeholder="To"
                        className="border rounded-2xl py-3 !border-borderColor"
                        onSelect={(value) => setDestination(value)}
                        defaultValue={destination}
                        icon={toImg}
                        filterItem={destination}
                    />
                </div>

                <div className="relative lg:w-1/5 w-full">
                    <CustomDatePicker
                        label=""
                        placeholder="Departure Date"
                        className="px-4 py-3 w-full rounded-2xl border border-borderColor"
                        value={departureDate}
                        minDate={new Date()}
                        onChange={(e) => setDepartureDate(e)}
                    />
                </div>

                {tripType === "roundtrip" && (
                    <div className="relative lg:w-1/5 w-full">
                        <CustomDatePicker
                            label=""
                            placeholder="Return Date"
                            value={returnDate}
                            minDate={departureDate}
                            onChange={(e) => setReturnDate(e)}
                            className="px-4 py-3 w-full rounded-2xl border border-borderColor"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-600"
                    aria-label="Search Flights"
                >
                    {loading ? "Searching..." : "Search"} <Search />
                </button>
            </div>

            {/* Error Handling */}
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default HoteSearchForm;
