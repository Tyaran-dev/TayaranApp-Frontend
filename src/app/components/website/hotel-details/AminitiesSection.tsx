'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Wifi,
  Bed,
  Bath,
  Tv,
  Utensils,
  Wind,
  Dumbbell,
  ParkingCircle,
  Sparkles,
} from 'lucide-react';

type Props = {
  aminities: string[];
  count?: number;
};

const iconMap: Record<string, JSX.Element> = {
  wifi: <Wifi className="w-5 h-5 text-blue-500" />,
  bed: <Bed className="w-5 h-5 text-green-600" />,
  bath: <Bath className="w-5 h-5 text-teal-500" />,
  tv: <Tv className="w-5 h-5 text-purple-500" />,
  restaurant: <Utensils className="w-5 h-5 text-orange-500" />,
  ac: <Wind className="w-5 h-5 text-cyan-500" />,
  gym: <Dumbbell className="w-5 h-5 text-red-500" />,
  parking: <ParkingCircle className="w-5 h-5 text-gray-600" />,
};

const AminitiesSection = ({ aminities, count = 8 }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const locale = useLocale();

  const visibleAminities = showMore ? aminities : aminities.slice(0, count);

  const getIcon = (name: string) => {
    const key = name.toLowerCase();
    return (
      Object.entries(iconMap).find(([k]) => key.includes(k))?.[1] ?? (
        <Sparkles className="w-5 h-5 text-yellow-500" />
      )
    );
  };

  return (
    <section className="my-12 px-4">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
        Amenities
      </h2>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {visibleAminities.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50">
              {getIcon(item)}
            </div>
            <p className="text-sm font-medium text-gray-700 text-center">
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      {aminities.length > count && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-6 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
          >
            {showMore ? 'Show Less' : `+${aminities.length - count} More`}
          </button>
        </div>
      )}
    </section>
  );
};

export default AminitiesSection;
