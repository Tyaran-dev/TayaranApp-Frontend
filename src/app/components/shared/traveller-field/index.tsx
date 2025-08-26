"use client";
import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineMinusCircle } from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { useTranslations } from 'next-intl';

interface TravelersProps {
  label?: string;
  adults: number;
  children: number;
  infants: number;
  // Option 1: Direct state update
  setFlightFormData?: React.Dispatch<
    React.SetStateAction<{
      origin: string;
      destination: string;
      departure: Date;
      returnDate: Date;
      travelers: {
        adults: number;
        children: number;
        infants: number;
      };
      flightClass: string;
      flightType: string;
      segments?: {
        id: string;
        origin: string;
        destination: string;
        date: Date;
      }[];
    }>
  >;
  // Option 2: Individual setters (used in SearchForm)
  setAdults?: (value: number) => void;
  setChildren?: (value: number) => void;
  setInfants?: (value: number) => void;
}

const Travelers: React.FC<TravelersProps> = ({
  adults,
  children,
  infants,
  setFlightFormData,
  setAdults,
  setChildren,
  setInfants,
  label,
}) => {
  const t = useTranslations('searchForm');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleCountChange = (
    type: 'adults' | 'children' | 'infants',
    change: number
  ) => {
    const newValue = Math.max(0, (type === 'adults' ? adults : type === 'children' ? children : infants) + change);

    if (setFlightFormData) {
      setFlightFormData(prev => ({
        ...prev,
        travelers: {
          ...prev.travelers,
          [type]: newValue
        }
      }));
    } else {
      if (type === 'adults' && setAdults) setAdults(newValue);
      if (type === 'children' && setChildren) setChildren(newValue);
      if (type === 'infants' && setInfants) setInfants(newValue);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {label && <label className="block text-[#12121299] text-sm">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="py-2.5 border-1 px-2 w-full flex items-center justify-between border-borderColor  rounded-lg border-green"
      >
        <span className='text-sm'>{adults + children + infants} {t("travlers.buttonLabel")}</span>
        <IoIosArrowDown className="text-sm" />
      </button>

      {isOpen && (
        <div className="absolute md:min-w-64 bg-white p-4 left-0 rounded-2xl shadow-2xl z-10 mt-2">
          <h2 className="text-xs font-semibold mb-4">{t("travlers.travlers")}</h2>

          {([
            { type: 'adults', label: t('travlers.adults.label'), note: t('travlers.adults.note'), value: adults },
            { type: 'children', label: t('travlers.children.label'), note: t('travlers.children.note'), value: children },
            { type: 'infants', label: t('travlers.infants.label'), note: t('travlers.infants.note'), value: infants }
          ] as const).map(({ type, label, note, value }) => (
            <div key={type} className="flex justify-between items-center mb-2">
              <div className="mr-2 text-black">
                {label} <span className="text-grayText text-xs">({note})</span>
              </div>
              <div className="flex gap-1 items-center">
                <button
                  type="button"
                  onClick={() => handleCountChange(type, -1)}
                  className="text-green text-2xl font-bold py-2"
                >
                  <AiOutlineMinusCircle />
                </button>
                <span className="px-2">{value}</span>
                <button
                  type="button"
                  onClick={() => handleCountChange(type, 1)}
                  className="text-green text-2xl font-bold py-2"
                >
                  <FiPlusCircle />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Travelers;
