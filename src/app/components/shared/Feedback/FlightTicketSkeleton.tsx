import React from 'react';

const FlightTicketSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border !border-stone-200 p-4 sm:p-6 shadow-sm w-full">
      {/* Header with price and airline logo */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="space-y-3">
          <div className="h-7 bg-stone-200 rounded-md w-28 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-10 w-10 bg-stone-200 rounded-2xl animate-pulse self-end sm:self-auto"></div>
      </div>

      {/* Flight details section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
        {/* Departure info */}
        <div className="flex flex-col items-start space-y-3 flex-1">
          <div className="h-6 bg-stone-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-28 animate-pulse"></div>
          <div className="h-3 bg-stone-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Flight path visualization */}
        <div className="flex flex-col items-center space-y-3 flex-1">
          <div className="h-4 bg-stone-200 rounded w-20 animate-pulse"></div>
          <div className="flex items-center space-x-3">
            <div className="h-3 bg-stone-200 rounded-2xl w-16 sm:w-24 animate-pulse"></div>
            <div className="h-4 w-4 bg-stone-200 rounded-2xl animate-pulse"></div>
            <div className="h-3 bg-stone-200 rounded-2xl w-16 sm:w-24 animate-pulse"></div>
          </div>
          <div className="h-4 bg-stone-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Arrival info */}
        <div className="flex flex-col items-end space-y-3 flex-1">
          <div className="h-6 bg-stone-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-28 animate-pulse"></div>
          <div className="h-3 bg-stone-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>

      {/* Action button and remaining seats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="h-10 bg-stone-200 rounded-lg w-28 animate-pulse"></div>
        <div className="h-4 bg-stone-200 rounded w-36 animate-pulse"></div>
      </div>

      {/* Flight amenities icons */}
      <div className="flex flex-wrap justify-start items-center gap-4 pt-4 border-t border-stone-100">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-7 w-7 bg-stone-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FlightTicketSkeleton;
