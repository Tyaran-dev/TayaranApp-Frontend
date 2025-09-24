"use client";

import React, { useState } from "react";
import { CiStar, CiCalendar } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { IoBedOutline } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { useAppSelector } from "@/redux/hooks";

type Props = {
  hotel: any;
  room: any;
};

interface CancellationPolicy {
  policy: string;
  deadline: string;
  charge: string;
  type: string;
  rawDate?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const parts = dateString.split(/[-/]/);
    const date =
      parts.length === 3
        ? new Date(
          parts[0].length === 4
            ? `${parts[0]}-${parts[1]}-${parts[2]}`
            : `${parts[2]}-${parts[1]}-${parts[0]}`
        )
        : new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateString);
  }
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    const date = new Date(`${year}-${month}-${day}T${timePart}`);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(dateString);
  }
};

const calculateNights = (checkIn?: string, checkOut?: string) => {
  if (!checkIn || !checkOut) return 0;
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  } catch {
    return 0;
  }
};

const HotelBookingSummary = ({ hotel, room }: Props) => {
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const { searchParamsData } = useAppSelector((state) => state.hotelData);

  // Extract hotel data
  const hotelData = hotel?.data?.hotel?.[0] || hotel;
  const hotelName = hotelData?.HotelName || "Hotel";
  const hotelRating = hotelData?.HotelRating || 0;
  const address = hotelData?.Address || "";
  const images = hotelData?.Images || [];
  const checkInTime = hotelData?.CheckInTime || "3:00 PM";
  const checkOutTime = hotelData?.CheckOutTime || "12:00 PM";

  // Extract room data
  const selectedRoom = room?.Rooms?.[0] || room;
  const roomName = selectedRoom?.Name?.[0] || selectedRoom?.Name || "Room";
  const mealType = selectedRoom?.MealType?.replace(/_/g, " ") || "Meal Info";
  const totalPrice = selectedRoom?.TotalFare?.toFixed(2) || "0.00";
  const netPrice = Number(selectedRoom?.TotalFare || 0);
  const rspPrice = (netPrice * 1.05).toFixed(2);
  const isRefundable = selectedRoom?.IsRefundable;
  const inclusion = selectedRoom?.Inclusion;
  const cancelPolicies = selectedRoom?.CancelPolicies || [];
  const amenities = selectedRoom?.Amenities || [];
  const supplements = selectedRoom?.Supplements || [];
  const roomCount = searchParamsData?.PaxRooms.length;

  // Guests
  const calculateGuests = () => {
    if (!searchParamsData?.PaxRooms || searchParamsData.PaxRooms.length === 0) {
      return { adults: 2, children: 0 };
    }

    return searchParamsData.PaxRooms.reduce(
      (
        acc: { adults: number; children: number },
        room: { Adults?: number; Children?: number }
      ) => ({
        adults: acc.adults + (room.Adults || 0),
        children: acc.children + (room.Children || 0),
      }),
      { adults: 0, children: 0 }
    );
  };

  const { adults, children } = calculateGuests();

  const checkInDate = formatDate(searchParamsData?.CheckIn) || "04 Aug 2025";
  const checkOutDate = formatDate(searchParamsData?.CheckOut) || "05 Aug 2025";
  const nights =
    calculateNights(searchParamsData?.CheckIn, searchParamsData?.CheckOut) || 1;

  // Cancellation policies
  const getCancellationPolicy = () => {
    if (!cancelPolicies || cancelPolicies.length === 0) {
      return isRefundable
        ? [
          {
            policy: "Free cancellation available",
            deadline: "Anytime before check-in",
            charge: "SAR 0",
            type: "free",
          },
        ]
        : [
          {
            policy: "Non-refundable",
            deadline: "N/A",
            charge: "Full amount will be charged",
            type: "non-refundable",
          },
        ];
    }

    return cancelPolicies
      .map((policy: any) => {
        const charge = policy.CancellationCharge || 0;
        const chargeType = (policy.ChargeType || "").toLowerCase();

        // Build charge string depending on type
        let chargeDisplay = "";
        let type = "";

        if (charge === 0) {
          chargeDisplay = "No charge";
          type = "free";
        } else if (chargeType === "percentage") {
          chargeDisplay = `${charge}% of booking amount`;
          type = "percentage";
        } else if (chargeType === "fixed") {
          chargeDisplay = `SAR ${charge.toFixed(2)}`;
          type = "fixed";
        } else {
          chargeDisplay = `SAR ${charge.toFixed(2)}`;
          type = "penalty";
        }

        return {
          policy:
            charge === 0
              ? "Free cancellation"
              : `Cancellation fee applies (${policy.ChargeType})`,
          deadline: `Before ${formatDateTime(policy.FromDate)}`,
          charge: chargeDisplay,
          type,
          rawDate: policy.FromDate ? String(policy.FromDate) : "",
        };
      })
      .sort((a: CancellationPolicy, b: CancellationPolicy) => {
        try {
          return (
            new Date(a.rawDate || "").getTime() -
            new Date(b.rawDate || "").getTime()
          );
        } catch {
          return 0;
        }
      });
  };


  const cancellationPolicies = getCancellationPolicy();
  const hasCancellationPolicy = cancellationPolicies.length > 0;

  return (
    <div className="lg:col-span-1">
      {showCancellationPolicy && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCancellationPolicy(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-xl text-gray-800">Cancellation Policy</h3>
              <button
                onClick={() => setShowCancellationPolicy(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Hotel & Room info */}
            <div className="px-6 pt-4">
              <h4 className="text-lg font-semibold text-gray-800">{hotelName}</h4>
              <p className="text-sm text-gray-500">{roomName}</p>
            </div>

            {/* Policies Table */}
            <div className="p-6">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-3 text-left">From Date</th>
                    <th className="py-2 px-3 text-left">Type</th>
                    <th className="py-2 px-3 text-left">Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {cancellationPolicies.map((policy: any, index: number) => (
                    <tr
                      key={index}
                      className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-2 px-3">
                        {formatDateTime(policy.rawDate || policy.FromDate)}
                      </td>
                      <td className="py-2 px-3 capitalize">
                        {policy.type === "percentage"
                          ? "Percentage"
                          : policy.type === "fixed"
                            ? "Fixed"
                            : "Free"}
                      </td>
                      <td className="py-2 px-3 font-medium text-gray-800">
                        {policy.charge}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-xs text-gray-500 leading-relaxed">
                <p>
                  The property's cancellation policy applies to this reservation.
                </p>
                <p>
                  For modifications or assistance, please contact the property
                  directly.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowCancellationPolicy(false)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Booking Summary Card */}
      <div className="sticky top-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Booking Summary
          </h2>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Hotel Image and Basic Info */}
          <div className="space-y-3">
            <img
              src={
                images?.[0]?.trim() ||
                "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
              alt={hotelName}
              className="w-full h-24 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400";
              }}
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">{hotelName}</p>
              <h3 className="font-semibold text-sm text-gray-900 leading-tight">
                {roomName}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(Math.min(5, hotelRating))].map((_, idx) => (
                    <CiStar
                      key={idx}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {[...Array(Math.max(0, 5 - hotelRating))].map((_, idx) => (
                    <CiStar
                      key={`empty-${idx}`}
                      className="w-3 h-3 text-gray-300"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  Rating: {hotelRating}/5
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Booking Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <LuUsers className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {adults} Adult{adults !== 1 ? "s" : ""}
                {children > 0
                  ? `, ${children} Child${children !== 1 ? "ren" : ""}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CiCalendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {checkInDate} - {checkOutDate}, {nights}{" "}
                {nights !== 1 ? "nights" : "night"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IoBedOutline className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{roomName}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {mealType && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {mealType}
                </span>
              )}
              {!isRefundable ? (
                <span className="text-xs text-orange-600 border border-orange-200 bg-orange-50 px-2 py-1 rounded">
                  Non-refundable
                </span>
              ) : (
                <span className="text-xs text-green-700 border border-green-200 bg-green-50 px-2 py-1 rounded">
                  Refundable
                </span>
              )}
              {inclusion && (
                <span className="text-xs text-gray-600 border  border-gray-200 bg-gray-50 px-2 py-1 rounded">
                  {inclusion}
                </span>
              )}
            </div>

            {/* Cancellation Policy Button */}
            {hasCancellationPolicy && (
              <div className="mt-3">
                <button
                  onClick={() => setShowCancellationPolicy(true)}
                  className="text-xs text-blue-600 hover:underline flex items-center"
                >
                  View cancellation policy
                  <span className="ml-1 text-blue-400">
                    ({cancellationPolicies.length} condition
                    {cancellationPolicies.length !== 1 ? "s" : ""})
                  </span>
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900">
              Price breakdown
            </h4>

            {/* Base Price */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Base price ({roomCount} room x {nights} night
                {nights !== 1 ? "s" : ""})
              </span>
              <span className="text-gray-900">
                SAR {parseFloat(totalPrice).toFixed(2)}
              </span>
            </div>

            {/* Commission */}
            <div className="flex justify-between text-sm text-green-700">
              <span className="text-gray-600">Administration Fees </span>
              <span className="text-green-700">
                SAR {(parseFloat(totalPrice) * 0.05).toFixed(2)}
              </span>
            </div>

            <hr className="border-gray-200" />

            {/* RSP Price (Total) */}
            <div className="flex justify-between font-semibold text-sm">
              <span className="text-gray-900">Total (incl. VAT)</span>
              <span className="text-gray-900">SAR {rspPrice}</span>
            </div>
          </div>

          {/* Supplement Details */}
          {selectedRoom?.Supplements && selectedRoom.Supplements.length > 0 && (
            <div className="mt-4 border rounded-lg bg-white border-gray-200 p-3">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                Supplement Details for Room
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Supplements to be paid directly to the hotel on reaching:
              </p>
              <ul className="space-y-1">
                {selectedRoom.Supplements.flat().map(
                  (supp: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-800"
                    >
                      <span className="text-green-600 mr-2">✔</span>
                      {supp.Description}
                      <span className="ml-1 text-gray-500">
                        ({supp.Currency} {supp.Price})
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Check-in/out times */}
          <div className="text-xs text-gray-500 mt-2">
            <p>Check-in: {checkInTime}</p>
            <p>Check-out: {checkOutTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingSummary;
