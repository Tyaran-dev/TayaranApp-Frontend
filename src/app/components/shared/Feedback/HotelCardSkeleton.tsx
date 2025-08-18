"use client";

export default function HotelCardSkeleton() {
  const skeletonCount = 4;

  return (
    <div className="flex gap-8">
      <div className="w-[25%]">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Filters title */}
          <div className="h-6 bg-gray-200 rounded w-16 mb-6 animate-pulse"></div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full animate-pulse">
                <div className="h-2 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Property Name */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full animate-pulse"></div>
          </div>

          {/* Available hotels */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-28 mb-3 animate-pulse"></div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 ml-2 animate-pulse"></div>
            </div>
          </div>

          {/* Star rating */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 ml-2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest rating */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-22 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 ml-2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[75%]">
        {[...Array(skeletonCount)].map((_, indx) => (
          <div
            key={indx}
            className="bg-white rounded-lg border mt-8 shadow-xl border-gray-200 overflow-hidden animate-pulse"
          >
            {/* Main content container */}
            <div className="p-6">
              {/* Top section with price and night info */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>

                {/* Hotel image placeholder */}
                <div className="w-32 h-20 bg-gray-200 rounded-lg ml-4"></div>
              </div>

              {/* Hotel name placeholder */}
              <div className="h-5 bg-gray-200 rounded w-48 mb-3"></div>

              {/* Location placeholder */}
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

              {/* Amenities placeholder */}
              <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>

              {/* Rating section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Place button placeholder */}
              <div className="h-10 bg-gray-200 rounded-md w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
