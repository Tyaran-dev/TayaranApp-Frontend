"use client";
import React, { useState } from "react";
import { Plus, Minus, Home, ChevronDown, ChevronUp } from "lucide-react";

// Define Room type
interface Room {
    id: number; // Unique ID for each room
    Adults: number;
    Children: number;
    ChildrenAges: number[];
}

interface RoomSelectionProps {
    rooms: Room[];
    setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ rooms, setRooms }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Handle Increment
    const increment = (index: number, type: "Adults" | "Children") => {
        setRooms((prevRooms) =>
            prevRooms.map((room, i) =>
                i === index
                    ? {
                        ...room,
                        [type]: room[type] + 1,
                        ...(type === "Children" && { ChildrenAges: [...room.ChildrenAges, 1] }),
                    }
                    : room
            )
        );
    };

    // Handle Decrement
    const decrement = (index: number, type: "Adults" | "Children") => {
        setRooms((prevRooms) =>
            prevRooms.map((room, i) =>
                i === index
                    ? {
                        ...room,
                        [type]: Math.max(type === "Adults" ? 1 : 0, room[type] - 1),
                        ...(type === "Children" && { ChildrenAges: room.ChildrenAges.slice(0, -1) }),
                    }
                    : room
            )
        );
    };

    // Handle Child Age Change
    const handleChildAgeChange = (index: number, childIndex: number, age: number) => {
        setRooms((prevRooms) =>
            prevRooms.map((room, i) =>
                i === index
                    ? {
                        ...room,
                        ChildrenAges: room.ChildrenAges.map((childAge, cIndex) =>
                            cIndex === childIndex ? age : childAge
                        ),
                    }
                    : room
            )
        );
    };

    // Add Room
    const addRoom = () => {
        setRooms([...rooms, { id: Date.now(), Adults: 1, Children: 0, ChildrenAges: [] }]);
    };

    // Remove Room
    const removeRoom = (index: number) => {
        setRooms(rooms.filter((_, i) => i !== index));
    };

    return (
        <div className="relative  md:w-80">
            <label>Guests</label>

            <div
                className=" bg-white  cursor-pointer flex justify-between items-center text-grayText"
                onClick={toggleDropdown}
            >
                <span>
                    {rooms.reduce((total, room) => total + room.Adults + room.Children, 0)} Guests &middot; {rooms.length} Room
                </span>
                {isOpen ? <ChevronUp className="text-green" size={16} /> : <ChevronDown className="text-green" size={16} />}
            </div>

            {isOpen && (
                <div className="p-2 mt-2 bg-white max-h-64 overflow-y-auto shadow-md rounded-lg absolute w-full z-10">
                    <div className="mt-4 space-y-4">
                        {rooms.map((room, index) => (
                            <div key={room.id} className="border border-borderColor p-3 rounded-md shadow-sm">
                                <div className="flex items-center gap-2 text-green font-medium">
                                    <Home size={16} />
                                    <span>Room {index + 1}</span>
                                </div>

                                <div className="flex justify-between mt-3">
                                    {/* Adults Section */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm text-grayText">Adult</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                className="p-1 border rounded-md disabled:opacity-50"
                                                onClick={() => decrement(index, "Adults")}
                                                disabled={room.Adults === 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-6 text-center">{room.Adults}</span>
                                            <button className="p-1 border rounded-md" onClick={() => increment(index, "Adults")}>
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children Section */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm text-grayText">Child</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                className="p-1 border rounded-md disabled:opacity-50"
                                                onClick={() => decrement(index, "Children")}
                                                disabled={room.Children === 0}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-6 text-center">{room.Children}</span>
                                            <button className="p-1 border rounded-md" onClick={() => increment(index, "Children")}>
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span className="text-xs text-grayDark">From 1 to 17 years</span>

                                        {/* Child Age Selection */}
                                        {room.Children > 0 && (
                                            <div className="mt-2 space-y-2">
                                                {room.ChildrenAges.map((age, childIndex) => (
                                                    <div key={childIndex} className="flex items-center gap-2">
                                                        <span className="text-xs text-grayText">Age:</span>
                                                        <select
                                                            value={age}
                                                            onChange={(e) => handleChildAgeChange(index, childIndex, Number(e.target.value))}
                                                            className="border p-1 rounded-md text-sm"
                                                        >
                                                            {[...Array(17).keys()].map((num) => (
                                                                <option key={num + 1} value={num + 1}>
                                                                    {num + 1}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Remove Room Button */}
                                {rooms.length > 1 && (
                                    <button
                                        onClick={() => removeRoom(index)}
                                        className="mt-2 text-red-500 text-sm underline"
                                    >
                                        Remove Room
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Room Button */}
                    <button
                        onClick={addRoom}
                        className="w-full mt-3 text-green font-medium flex items-center justify-center gap-1"
                    >
                        <Plus size={16} />
                        Add Room
                    </button>

                    {/* Apply Button */}
                    <button
                        className="w-full mt-4 bg-green text-white py-2 rounded-md hover:bg-orange transition"
                        onClick={() => setIsOpen(false)}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};

export default RoomSelection;
