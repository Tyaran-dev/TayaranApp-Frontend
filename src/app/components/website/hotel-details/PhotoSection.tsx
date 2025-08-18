import React, { useState } from 'react';
import Image from 'next/image';

const PhotosSection = ({ images }: { images: string[] }) => {
    const [showAll, setShowAll] = useState(false);

    const displayedImages = showAll ? images : images?.slice(0, 5);

    return (
        <div id='photos' className='grid my-10 sm:grid-cols-2 grid-cols-1 gap-3'>
            {!showAll ? (
                <>
                    {/* First Image Large */}
                    <div className="rounded-lg shadow-sm h-full">
                        <Image
                            src={images[0]}
                            alt='Photo'
                            width={500}
                            height={600}
                            className="object-cover h-full rounded-lg w-full"
                        />
                    </div>

                    {/* Remaining 4 Images in Grid */}
                    <div className="[column-fill:_balance] sm:columns-2 sm:gap-3">
                        {displayedImages.slice(1).map((item, i) => (
                            <div key={i} className="mb-3 sm:break-inside-avoid">
                                <Image
                                    src={item}
                                    alt={`Image ${i + 2}`}
                                    width={500}
                                    height={600}
                                    className="object-cover rounded-lg w-full"
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                // Show all images in equal size
                <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 col-span-full">
                    {images.map((img, i) => (
                        <Image
                            key={i}
                            src={img}
                            alt={`Image ${i + 1}`}
                            width={500}
                            height={600}
                            className="object-cover rounded-lg w-full max-h-[300px]"
                        />
                    ))}
                </div>
            )}

            {/* Show All / Show Less Button */}
            {images.length > 5 && (
                <div className="col-span-full flex justify-center mt-4">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-4 py-2 bg-greenGradient text-white rounded-md hover:bg-greenGradient"
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhotosSection;
