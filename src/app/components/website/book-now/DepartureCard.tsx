'use client';

import React from 'react';
import Image from 'next/image';
import { BaggageIcon } from '@/app/svg';
import { calculateDurationSimple, calculateTotalDurationShortNew, getAirportByIATA } from '@/utils/airports-helper';
import { useTranslations } from 'next-intl';

const FlightCard = ({ flightData }: any) => {
    const t = useTranslations('FlightCard');

    function getNumberOfStops(itinerary: any) {
        const stopCount = itinerary.segments.reduce((totalStops: number, segment: any) => {
            return totalStops + segment.numberOfStops;
        }, 0);

        if (stopCount === 0) {
            return t('direct');
        } else {
            return t('stopCount', { count: stopCount });
        }
    }

    function getStopDetails(itinerary: any) {
        const stops = itinerary.segments.flatMap((segment: any) => segment.stops || []);

        if (stops.length === 0) {
            return <div className="p-2 whitespace-nowrap"><p>{t('noStops')}</p></div>;
        }

        return stops.map((stop: any, index: number) => (
            <div key={index} className="p-2 whitespace-nowrap">
                <p><strong>{t('stop')} {index + 1}</strong></p>
                <p>{t('arrival')}: {new Date(stop.arrivalAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                <p>{t('airport')}: {getAirportByIATA(stop.iataCode)}</p>
                <p>{t('duration')}: {calculateDurationSimple(stop?.duration)}</p>
                <p>{t('departure')}: {new Date(stop.departureAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            </div>
        ));
    }

    return (
        <>
            {flightData?.itineraries?.map((itinerary: any, itineraryIndex: number) => (
                itinerary?.segments?.map((segment: any, segmentIndex: number) => (
                    <div key={`${itineraryIndex}-${segmentIndex}`} className="bg-white p-4 border rounded-xl shadow-md border-bordered">
                        <div className="flex justify-between gap-2 w-full flex-wrap items-center">
                            <h2 className="text-xl font-semibold">{t('departureTitle')}</h2>
                            <p className="text-grayDark text-sm">{(segment.departure.at)?.split('T')[0]}</p>
                            <p>{t('flightDetails')}</p>
                        </div>

                        <div className="mt-4 gap-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Image
                                    src={`https://assets.wego.com/image/upload/h_240,c_fill,f_auto,fl_lossy,q_auto:best,g_auto/v20240602/flights/airlines_square/${segment.carrierCode}.png`}
                                    alt={segment.carrierCode}
                                    width={25}
                                    height={25}
                                />
                            </div>

                            <div className="flex flex-col gap-2 items-start w-full">
                                <div className="flex pb-1 items-center w-full justify-between border-b-2 border-dashed border-grayDark">
                                    <p className="text-sm font-semibold">
                                        {new Date(segment.departure.at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </p>
                                    <div className="group relative">
                                        <p>{getNumberOfStops(itinerary)}</p>
                                        {getStopDetails(itinerary) && (
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 p-2 bg-[#333030] text-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                                {getStopDetails(itinerary)}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {new Date(segment.arrival.at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center w-full text-grayDark justify-between">
                                    <p className="text-xs">{segment.departure.iataCode}</p>
                                    <p className="text-xs">{calculateTotalDurationShortNew([segment])}</p>
                                    <p className="text-xs">{segment.arrival.iataCode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-greenGradient text-white mt-6 p-2 rounded-lg flex justify-between items-center">
                            <p className="text-sm">{getAirportByIATA(segment.arrival.iataCode)}</p>
                            <div className="flex items-center space-x-2">
                                <BaggageIcon />
                                <p className="text-sm">{t('baggageIncluded')}</p>
                            </div>
                        </div>
                    </div>
                ))
            ))}
        </>
    );
};

export default FlightCard;
