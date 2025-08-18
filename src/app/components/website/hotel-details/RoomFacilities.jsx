'use client'
import React, { useState } from 'react'
import {HoteSizeIcon } from '@/app/svg'

const RoomFacilities = ({ facilities }) => {

  const [showMore, setShowMore] = useState(false);

  // Show up to 2 facilities if not expanded
  const visibleFacilities = showMore ? facilities : facilities.slice(0, 2);

  return (
    <div>
      {/* Display only visible facilities */}
      {visibleFacilities.map((item, index) => (
        <div key={index} className='flex items-center mb-4 gap-2'>
          <HoteSizeIcon />
          <p className='sm:text-base text-sm'>{item}</p>
        </div>
      ))}

      {/* Show More button, shown when there are more than 2 items */}
      {facilities.length > 2 && !showMore && (
        <button
          className='text-blue-500 mt-2 font-bold text-start underline w-full ml-2'
          onClick={() => setShowMore(true)}
        >
          More room info
        </button>
      )}

      {/* Show Less button when all items are shown */}
      {showMore && (
        <button
          className='text-blue-500 mt-2 font-bold text-start underline w-full ml-2'
          onClick={() => setShowMore(false)}
        >
          Show Less
        </button>
      )}
    </div>
  )
}

export default RoomFacilities
