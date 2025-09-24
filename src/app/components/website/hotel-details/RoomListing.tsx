import React, { useEffect, useState } from 'react';
import { Bed, ChevronDown, ChevronUp, Users } from 'lucide-react';
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
  presentageCommission?: number
}

const RoomListing = ({
  data,
  showCancellationBadge = false,
  showMealTypeBadge = false,
  presentageCommission
}: RoomListingProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const router = useRouter();

  // Helper function to safely handle RoomPromotion
  const getRoomPromotions = (room: Room): string[] => {
    if (!room.RoomPromotion) return [];
    if (Array.isArray(room.RoomPromotion)) {
      return room.RoomPromotion.filter(promo =>
        promo && typeof promo === 'string' && promo.trim().length > 0
      );
    }
    return [];
  };

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
    <div className="w-full flex flex-col gap-6">
      {Object.entries(groupedRooms).map(([roomName, roomOptions], i) => {
        const isExpanded = expandedSections[roomName];

        return (
          <div key={i} className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Room Header - Accordion Toggle */}
            <div
              className={`p-4 sticky top-0 z-10 border-b cursor-pointer transition-colors duration-200 ${isExpanded
                ? ' bg-greenGradient text-white'  // Emerald background when expanded
                : 'bg-white text-gray-900'     // White background when collapsed
                }`}
              onClick={() => toggleSection(roomName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bed className={`w-5 h-5 ${isExpanded ? 'text-white' : 'text-orange-500'
                    }`} />
                  <div>
                    <h2 className={`text-lg font-semibold ${isExpanded ? 'text-white' : 'text-gray-900'
                      }`}>
                      {roomName}
                    </h2>
                    <p className={`text-sm ${isExpanded ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                      {roomOptions.length} option(s) available
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className={`w-5 h-5 ${isExpanded ? 'text-white' : 'text-gray-500'
                    }`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isExpanded ? 'text-white' : 'text-gray-500'
                    }`} />
                )}
              </div>
            </div>

            {/* Room Options - Collapsible Content */}
            {isExpanded && (
              <div className="bg-gray-50">
                {/* Table Header (desktop only) */}
                <div className="hidden md:grid md:grid-cols-12  text-sm font-semibold py-3 px-6">
                  <div className="col-span-6 ">Room Details & Features</div>
                  <div className="col-span-2 text-center">Guests</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>

                {/* Room Options */}
                <div className="divide-y divide-gray-200">
                  {roomOptions.map((room, idx) => {
                    const promotions = getRoomPromotions(room);

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 hover:bg-gray-50 transition-colors"
                      >
                        {/* Room Details - Left Column */}
                        <div className="md:col-span-6 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Inclusion Badge */}
                            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                              {room.Inclusion || "Room Only"}
                            </span>

                            {/* Meal Type Badge */}
                            {room.MealType && (
                              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                                {room.MealType.replace(/_/g, " ")}
                              </span>
                            )}

                            {/* Cancellation Badge */}
                            {room.IsRefundable && (
                              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                                FREE Cancellation
                              </span>
                            )}
                          </div>

                          {/* Promotions */}
                          {room.RoomPromotion?.length > 0 && (
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                              Special Offers Available
                            </p>
                          )}
                          {promotions.length > 0 && (
                            <div className="space-y-2 items-center">
                              <div className="flex gap-2">
                                <span className="bg-emerald-100 text-xs font-medium px-3 py-1.5 rounded-lg">
                                  Special Promotions:
                                </span>
                                {promotions.map((promo, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="bg-emerald-100 text-xs font-medium px-3 py-1.5 rounded-lg"
                                  >
                                    {promo}  🎁
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Room Features */}
                          <div className="space-y-1 text-sm text-gray-600">
                            {room.WithTransfers && (
                              <p className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Includes Transfers
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Guests - Center Column */}
                        <div className="md:col-span-2 flex md:flex-col md:items-center md:justify-center">
                          <div className="text-center">
                            <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <span className="text-sm text-gray-600">2 Guests</span>
                          </div>
                        </div>

                        {/* Price - Center Column */}
                        <div className="md:col-span-2 flex md:flex-col md:items-center md:justify-center">
                          <div className="text-center">
                            {/* Calculate commission-adjusted price */}
                            {(() => {
                              const totalWithCommission =
                                room.TotalFare + (room.TotalFare * presentageCommission) / 100;

                              return (
                                <div className="text-xl font-bold text-gray-900">
                                  ${totalWithCommission.toFixed(2)}
                                </div>
                              );
                            })()}
                            <div className="text-xs text-gray-500 mt-1">incl. taxes & fees</div>
                            {room.IsRefundable && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                Free cancellation
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action - Right Column */}
                        <div className="md:col-span-2 flex md:items-center md:justify-center">
                          <Button
                            onClick={() => handleSelectRoom(room)}
                            label="Book Now"
                            style="bg-greenGradient hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium w-full md:w-auto transition-colors"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoomListing;