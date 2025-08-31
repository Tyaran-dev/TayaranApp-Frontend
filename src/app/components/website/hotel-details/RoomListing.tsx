import React, { useEffect, useState } from 'react';
import { Heart, Share2, Bed, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSelectedRoom } from '@/redux/hotels/hotelsSlice';

interface Room {
  BookingCode: string;
  IsRefundable: boolean;
  MealType?: string;
  Name?: string[];
  Inclusion?: string;
  RoomPromotion: string[];
  TotalFare: number;
  TotalTax: number;
  WithTransfers: boolean;
  CancelPolicies?: Array<{
    FromDate: string;
    ChargeType: string;
    CancellationCharge: number;
  }>;
  DayRates?: Array<any>;
}

interface RoomListingProps {
  data: Room[];
  showCancellationBadge?: boolean;
  showMealTypeBadge?: boolean;
}

const RoomListing = ({
  data,
  showCancellationBadge = false,
  showMealTypeBadge = false
}: RoomListingProps) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const router = useRouter();



  const groupRoomsByName = (rooms: Room[]) => {
    const grouped: { [key: string]: Room[] } = {};
    rooms.forEach(room => {
      const name = room.Name?.[0]?.split(',')[0] || 'Unnamed Room';
      if (!grouped[name]) grouped[name] = [];
      grouped[name].push(room);
    });
    return grouped;
  };

  const groupedRooms = groupRoomsByName(data);

  const handleSelectRoom = (room: Room) => {
    dispatch(setSelectedRoom(room));
    router.push('/book-hotel');
  };

  const toggleSection = (roomName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [roomName]: !prev[roomName]
    }));
  };
  // ✅ Open all sections by default
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    Object.keys(groupedRooms).forEach(roomName => {
      initialExpanded[roomName] = true;
    });
    setExpandedSections(initialExpanded);
  }, [data]);


  return (
    <div className="w-full flex flex-col gap-4">
      {Object.entries(groupedRooms).map(([roomName, roomOptions], i) => (
        <div key={i} className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Room Header - Accordion Toggle */}
          <div
            className="p-4 bg-white sticky top-0 z-10 border-b cursor-pointer"
            onClick={() => toggleSection(roomName)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <Bed className="text-orange-500 w-5 h-5" />
                <h2 className="text-base md:text-lg font-bold text-emerald-600">{roomName}</h2>
                <span className="text-sm text-gray-500 ml-2">({roomOptions.length} options)</span>
              </div>
              {expandedSections[roomName] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* Room Options - Collapsible Content */}
          {expandedSections[roomName] && (
            <>
              {/* Table Header (desktop only) */}
              <div className="hidden md:block bg-greenGradient text-white">
                <div className="grid grid-cols-12 text-sm font-semibold py-3 px-6">
                  <div className="col-span-6">Select an option</div>
                  <div className="col-span-2 text-center">Guests</div>
                  <div className="col-span-2 text-center">Total for 1 room</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>
              </div>

              {/* Room Options */}
              <div className="divide-y divide-gray-200">
                {roomOptions.map((room, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:grid md:grid-cols-12 p-4 gap-4"
                  >
                    {/* Left: Room Info */}
                    <div className="flex-1 md:col-span-6">
                      <div className="flex items-center gap-2 mb-2 ">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {room.Inclusion || "Room Only"}
                        </h4>
                        {room.RoomPromotion?.length > 0 && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {room.RoomPromotion[0]}
                          </span>
                        )}
                      </div>

                      {/* Only show extras on desktop */}
                      <div className="hidden md:block space-y-1 text-sm text-gray-600 mb-2">
                        {showCancellationBadge && room.IsRefundable && (
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-600">✓</span>
                            <span>FREE cancellation</span>
                          </div>
                        )}
                        {showMealTypeBadge && room.MealType && (
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-600">✓</span>
                            <span>{room.MealType.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price + Book */}
                    <div className="flex flex-col md:col-span-6 md:flex-row md:items-center md:justify-end gap-3">
                      <div className="text-center md:text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${room.TotalFare?.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Incl. VAT</div>
                      </div>

                      <Button
                        onClick={() => handleSelectRoom(room)}
                        label="Book Now"
                        style={
                          "bg-greenGradient hover:scale-105 text-white px-6 py-2 rounded-md font-medium"
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomListing;