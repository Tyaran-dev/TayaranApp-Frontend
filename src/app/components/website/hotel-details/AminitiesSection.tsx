'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { HotelPoolIcon } from '@/app/svg';

const AminitiesSection = ({ aminities, count }: { aminities: string[], count?: number }) => {
    const [showMore, setShowMore] = useState(false);
    const locale = useLocale();

    const isArabic = locale === 'ar';

    const visibleAminities = showMore ? aminities : aminities?.slice(0, count || 5);

    return (
        <div className='flex flex-col items-center my-4'>
            <h2 className="lg:text-5xl md:text-3xl tet-2xl text-center my-4 font-bold">
                Amenities
            </h2>

            <div className={`grid w-[90%]  sm:grid-cols-3 grid-cols-2 gap-4`}>
                {visibleAminities?.map((item, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <HotelPoolIcon />
                        <p className=' text-sm'>{item}</p>
                    </div>
                ))}

                {aminities?.length > (count || 5) && !showMore && (
                    <button
                        className='text-blue-500 text-start font-bold underline ml-2 mt-2'
                        onClick={() => setShowMore(true)}
                    >
                        +{aminities.length} more
                    </button>
                )}

                {showMore && (
                    <button
                        className='text-blue-500 text-start font-bold underline ml-2 mt-2'
                        onClick={() => setShowMore(false)}
                    >
                        Show Less
                    </button>
                )}
            </div>
        </div>
    );
};

export default AminitiesSection;
