import React, { useState } from 'react';
import { Heart, Share2, Bed, Users } from 'lucide-react';
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
  const [favorites, setFavorites] = useState<Record<string, boolean>>({}),
    dispatch = useDispatch(),
    router = useRouter();

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

  return (
    <div className="w-full flex flex-col gap-10">
      {Object.entries(groupedRooms).map(([roomName, roomOptions], i) => (
        <div key={i} className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Room Header */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bed className="text-orange-500 w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-900">{roomName}</h2>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-greenGradient text-white">
            <div className="grid grid-cols-12 text-sm font-semibold py-3 px-6">
              <div className="col-span-6">Select an option</div>
              <div className="col-span-2 text-center">Guests</div>
              <div className="col-span-4 text-center">Total for 1 room</div>
            </div>
          </div>

          {/* Room Options */}
          <div className="divide-y divide-gray-200">
            {roomOptions.map((room, idx) => (
              <div key={idx} className="grid grid-cols-12 p-6">
                <div className="col-span-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{room.Inclusion || 'Room only'}</h4>
                      {room.RoomPromotion?.length > 0 && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {room.RoomPromotion[0]}
                        </span>
                      )}
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1 text-sm text-gray-600 mb-2">
                      {(showCancellationBadge && room.IsRefundable) && (
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-600">✓</span>
                          <span>FREE cancellation</span>
                        </div>
                      )}
                      {(showMealTypeBadge && room.MealType) && (
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-600">✓</span>
                          <span>{room.MealType.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                    </div>

                    <a href="#" className="text-emerald-600 text-sm hover:underline mb-1">
                      Learn more
                    </a>
                    <p className="text-sm text-gray-500">1 room: 2 Adults</p>
                  </div>
                </div>

                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Fits 2</span>
                  </div>
                </div>

                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">${room.TotalFare?.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Incl. VAT</div>
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center justify-center gap-3">
                  <Button
                    onClick={() => handleSelectRoom(room)}
                    label="Book Now"
                    style={"bg-greenGradient hover:scale-105 text-white px-6 py-2 rounded-md font-medium min-w-[120px]"}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFavorites(prev => ({
                          ...prev,
                          [room.BookingCode]: !prev[room.BookingCode],
                        }))
                      }
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites[room.BookingCode]
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                          }`}
                      />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomListing;