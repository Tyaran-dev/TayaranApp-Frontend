import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Image, { StaticImageData } from "next/image";
import { getAirports } from "@/actions/airport-search-actions";
import Loading from "../loading";


interface Airport {
    name: string;
    name_ar: string;
    city: string;
    country: string;
    iata_code: string;
    _geoloc: {
        lat: number;
        lng: number;
    };
    links_count: number;
    id: string;
}


type HighlightTextProps = {
    text: string;
    query: string;
};

const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
    if (!query) return <>{text}</>;

    const regex = new RegExp(`(${query})`, "gi");
    return (
        <>
            {text?.split(regex).map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={index} className="bg-yellow-200">{part}</span>
                ) : (
                    part
                )
            )}
        </>
    );
};

type Props = {
    label?: string;
    placeholder?: string;
    className?: string;
    filterItem?: string;
    defaultValue?: string;
    icon?: StaticImageData;
    onSelect: (selectedIataCode: string) => void;
    error?: any;
};

const AirportSearchField: React.FC<Props> = ({
    label,
    placeholder = "Search airports...",
    className = "",
    onSelect,
    icon,
    defaultValue,
    filterItem,
    error
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Airport | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const selectRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Fetch default airports when the component loads
        const loadDefaultAirports = async () => {
            try {
                const fetchedAirports = await getAirports(); // Fetch all airports


                if (!Array.isArray(fetchedAirports)) {
                    console.error("Invalid API response: expected an array", fetchedAirports);
                    return;
                }

                // ✅ Ensure filtering logic is correct
                // const filteredAirports = existingAirports.filter((airport: { iata_code: any; }) =>
                //     fetchedAirports.some((fetched) => fetched.id === airport.iata_code)
                // );
                setAirports(fetchedAirports);
            } catch (error) {
                console.error("Error fetching default airports:", error);
            }
        };

        loadDefaultAirports();
    }, []); // Empty dependency array ensures it runs only once when the component mounts

    useEffect(() => {
        const fetchData = async () => {
            if (!searchTerm.trim()) return;
            setLoading(true);
            // Fetch airports from Amadeus API
            const fetchedAirports = await getAirports(searchTerm);
            console.log("🔹 Fetched Airports:", fetchedAirports);



            setLoading(false);
            setAirports(fetchedAirports)
            return fetchedAirports;
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 500); // Debounce to prevent excessive API calls

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);



    const handleSelect = (item: Airport) => {
        onSelect(item.id);
        setSelectedItem(item);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    return (
        <div>
            <div ref={selectRef} className="flex flex-col w-full">
                {label && <label className=" block text-[#12121299] mb-2">{label}</label>}
                <div className="relative">
                    <div className={`cursor-pointer text-grey1 text-md bg-transparent border outline-none w-full  px-2 flex justify-between items-center ${className} ${isOpen ? "border-green" : ""}`}>
                        <input
                            // lang="en"
                            placeholder={placeholder}
                            type="text"
                            ref={inputRef}
                            value={selectedItem && !searchTerm ? ` ${selectedItem.name}` : searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value === "") setSelectedItem(null);
                            }}
                            // placeholder={defaultValue ? defaultValue : placeholder}
                            className="w-full outline-none placeholder:text-[#12121299] notranslate"
                            onFocus={handleFocus}
                        />
                        {icon ? (
                            loading ? (
                                <Loading />
                            ) : (
                                <Image src={icon} alt="icon" width={25} height={25} />
                            )
                        ) : (
                            <IoIosArrowDown className="text-lg" />
                        )}
                    </div>

                    {isOpen && (
                        <div className="absolute z-10 w-full max-h-[500px] customScrollbar p-2 overflow-auto bg-white border border-bordered shadow-lg rounded-lg mt-0.5">
                            {airports?.length > 0 ? (
                                airports.map((option, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelect(option)}
                                        className={`cursor-pointer px-2 py-1 ${i === 0 ? "rounded-t-lg" : ""} ${i === airports.length - 1 ? "rounded-b-lg" : ""} hover:bg-greenGradient hover:text-white transition-colors`}
                                    >
                                        <div className="flex justify-between group">
                                            <div className="text-[12px] leading-4">
                                                <HighlightText text={option?.name} query={searchTerm} />
                                                <p className="text-gray2 group-hover:text-white text-[10px]">{option?.name} ,{option?.city} ,{option?.country}</p>
                                            </div>
                                            <p className="bg-slate-200 group-hover:text-black text-[8px] rounded-sm font-semibold p-1 h-5">
                                                {option.iata_code}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-2">No results found</div>
                            )}
                        </div>
                    )}
                    {error && <span className="text-sm text-red-500">{error}</span>}
                </div>
            </div>
        </div>
    );
};

export default AirportSearchField;

















