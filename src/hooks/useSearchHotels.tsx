"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Room = {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
};

export const useHotelSearchForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // ✅ State
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(tomorrow);
  const [rooms, setRooms] = useState<Room[]>([
    { Adults: 2, Children: 0, ChildrenAges: [] },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // ✅ Fetch countries once
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${baseUrl}/hotels/CountryList`);
        setCountries(response.data.data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [baseUrl]);

  // ✅ Fetch cities based on selected country
  useEffect(() => {
    if (!selectedCountry) return;
    const fetchCities = async () => {
      try {
        const response = await axios.post(`${baseUrl}/hotels/CityList`, {
          CountryCode: selectedCountry,
        });
        setCities(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedCountry, baseUrl]);

  // ✅ Room management
  const addRoom = () => {
    if (rooms.length < 6) {
      setRooms([...rooms, { Adults: 2, Children: 0, ChildrenAges: [] }]);
    }
  };

  const removeRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdultChange = (roomIndex: number, delta: number) => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === roomIndex
          ? { ...room, Adults: Math.min(6, Math.max(1, room.Adults + delta)) }
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

  // ✅ Total summary
  const totalSummary = `${rooms.length} Room${
    rooms.length > 1 ? "s" : ""
  }, ${rooms.reduce((sum, r) => sum + r.Adults, 0)} Adults, ${rooms.reduce(
    (sum, r) => sum + r.Children,
    0
  )} Child${rooms.reduce((sum, r) => sum + r.Children, 0) !== 1 ? "ren" : ""}`;

  return {
    countries,
    cities,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    selectedNationality,
    setSelectedNationality,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    rooms,
    setRooms,
    addRoom,
    removeRoom,
    handleAdultChange,
    handleChildChange,
    handleAgeChange,
    totalSummary,
    loading,
    setLoading,
    open,
    setOpen,
    today
  };
};
