import React from 'react';
import FlightTicketSkeleton from './FlightTicketSkeleton';

const FlightTicketSkeletonGrid: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <FlightTicketSkeleton key={index} />
      ))}
    </div>
  );
};

export default FlightTicketSkeletonGrid;