"use client";
import { useState } from "react";
import RoomListing from "./RoomListing";

export interface Room {
  BookingCode: string;
  IsRefundable: boolean;
  MealType?: string;
  Name?: string[];
  Inclusion?: string;
  RoomPromotion: string[];
  TotalFare: number;
  TotalTax: number;
  WithTransfers: boolean;
  RateConditions?: (string | object | null | undefined)[];
}

const RoomChoices = ({ rooms }: { rooms: Room[] }) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "free-cancellation" | "breakfast-included"
  >("all");

  // Categorize rooms
  const allRooms = rooms;
  const freeCancellationRooms = rooms?.filter((room) => room.IsRefundable);
  const breakfastIncludedRooms = rooms?.filter((room) =>
    room.MealType?.toLowerCase().replace(/_/g, " ").includes("breakfast")
  );

  // Get rooms for current tab
  const getCurrentRooms = () => {
    switch (activeTab) {
      case "free-cancellation":
        return freeCancellationRooms;
      case "breakfast-included":
        return breakfastIncludedRooms;
      default:
        return allRooms;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h2 className="lg:text-5xl md:text-3xl text-2xl font-bold">
        Room Choices
      </h2>

      {/* Tab Buttons */}
      <div className="flex gap-6 my-8 mb-16">
        <button
          className={`px-4 py-2 rounded-2xl font-medium ${
            activeTab === "all"
              ? "bg-orange text-white"
              : "border border-gray2 text-gray2"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Rooms
        </button>
        <button
          className={`px-4 py-2 rounded-2xl font-medium ${
            activeTab === "free-cancellation"
              ? "bg-orange text-white"
              : "border border-gray2 text-gray2"
          }`}
          onClick={() => setActiveTab("free-cancellation")}
        >
          Free Cancellation
        </button>
        <button
          className={`px-4 py-2 rounded-2xl font-medium ${
            activeTab === "breakfast-included"
              ? "bg-orange text-white"
              : "border border-gray2 text-gray2"
          }`}
          onClick={() => setActiveTab("breakfast-included")}
        >
          Breakfast Included
        </button>
      </div>

      {/* Tab Content */}
      <div className="text-center w-full">
        {getCurrentRooms()?.length > 0 ? (
          <RoomListing
            data={getCurrentRooms()}
            showCancellationBadge={activeTab === "all"}
            showMealTypeBadge={activeTab === "all"}
          />
        ) : (
          <p className="text-gray-500">
            {activeTab === "free-cancellation"
              ? "No free cancellation rooms available"
              : "No breakfast included rooms available"}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomChoices;
