import React from 'react'
import { BlueTickIcon } from '@/app/svg'
import { useState } from 'react';

const RoomOffers = ({ offers }) => {
    const [showMore, setShowMore] = useState(false);

    // Show up to 3 offers if not expanded
    const visibleOffers = showMore ? offers : offers.slice(0, 3);
    return (
        <div className='flex flex-col gap-2 mt-3'>
            {visibleOffers.map((entry, index) => (
                <div key={index} className='flex items-center gap-2'>
                    <BlueTickIcon />
                    <p className='sm:text-base text-sm'>{entry}</p>
                </div>
            ))}

            {offers.length > 3 && !showMore && (
                <button
                    className='text-blue-500 mt-2 text-start font-semibold underline ml-2 w-full'
                    onClick={() => setShowMore(true)}
                >
                    Learn more
                </button>
            )}

            {showMore && (
                <button
                    className='text-blue-500 mt-2 text-start font-semibold underline ml-2 w-full'
                    onClick={() => setShowMore(false)}
                >
                    Show Less
                </button>
            )}
        </div>
    )
}

export default RoomOffers
