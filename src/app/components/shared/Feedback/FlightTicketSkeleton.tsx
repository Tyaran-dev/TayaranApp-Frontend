import React from 'react';

const FlightTicketSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border !border-stone-200 p-6 shadow-sm">
      {/* Header with price and airline logo */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3">
          <div className="h-7 bg-stone-200 rounded-md w-28 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-10 w-10 bg-stone-200 rounded-2xl animate-pulse"></div>
      </div>

      {/* Flight details section */}
      <div className="flex items-center justify-between mb-6">
        {/* Departure info */}
        <div className="flex flex-col items-start space-y-3">
          <div className="h-6 bg-stone-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-28 animate-pulse"></div>
          <div className="h-3 bg-stone-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Flight path visualization */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-4 bg-stone-200 rounded w-20 animate-pulse"></div>
          <div className="flex items-center space-x-3">
            <div className="h-3 bg-stone-200 rounded-2xl w-24 animate-pulse"></div>
            <div className="h-4 w-4 bg-stone-200 rounded-2xl animate-pulse"></div>
            <div className="h-3 bg-stone-200 rounded-2xl w-24 animate-pulse"></div>
          </div>
          <div className="h-4 bg-stone-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Arrival info */}
        <div className="flex flex-col items-end space-y-3">
          <div className="h-6 bg-stone-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-stone-200 rounded w-28 animate-pulse"></div>
          <div className="h-3 bg-stone-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>

      {/* Action button and remaining seats */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-10 bg-stone-200 rounded-lg w-28 animate-pulse"></div>
        <div className="h-4 bg-stone-200 rounded w-36 animate-pulse"></div>
      </div>

      {/* Flight amenities icons */}
      <div className="flex justify-start items-center space-x-6 pt-4 border-t border-stone-100">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-7 w-7 bg-stone-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default FlightTicketSkeleton;