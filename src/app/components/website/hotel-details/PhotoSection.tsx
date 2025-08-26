import React, { useState } from "react";
import Image from "next/image";

const PhotosSection = ({ images }: { images: string[] }) => {
  const [showAll, setShowAll] = useState(false);

  // show 5 collapsed, 10 expanded
  const displayedImages = showAll ? images.slice(0, 10) : images.slice(0, 5);

  return (
    <div id="photos" className="grid my-4 p-2 pb-4 sm:grid-cols-2 grid-cols-1 gap-3 border-b">
      {!showAll ? (
        <>
          {/* First Image Large */}
          <div className="rounded-lg shadow-sm h-full">
            <div className="w-full h-[250px] sm:h-[300px] relative">
              <Image
                src={images[0]}
                alt="Photo"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Remaining 4 Images */}
          <div className="[column-fill:_balance] sm:columns-2 sm:gap-3">
            {displayedImages.slice(1).map((item, i) => (
              <div key={i} className="mb-3 sm:break-inside-avoid">
                <div className="w-full h-[250px] relative">
                  <Image
                    src={item}
                    alt={`Image ${i + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Show up to 10 images in fixed grid
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 p-1 col-span-full">
          {displayedImages.map((img, i) => (
            <div key={i} className="w-full h-[250px] sm:h-[300px] relative">
              <Image
                src={img}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Button */}
      {images.length > 5 && (
        <div className="col-span-full flex justify-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-2 bg-greenGradient text-white rounded-md hover:bg-greenGradient"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotosSection;
