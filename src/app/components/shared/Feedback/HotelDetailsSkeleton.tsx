"use client";

export default function HotelDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>

            {/* Navigation items */}
            <div className="flex items-center space-x-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded w-16 animate-pulse"
                ></div>
              ))}
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              {i < 3 && (
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hotel Title Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4 h-80">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Smaller images */}
            <div className="bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Show All button */}
          <div className="flex justify-center mt-4">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Room Choices Section */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>

          {/* Filter tabs */}
          <div className="flex space-x-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-full w-32 animate-pulse"
              ></div>
            ))}
          </div>

          {/* Room table header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-900 text-white p-4 rounded-t-lg">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-white/20 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Room rows */}
          <div className="bg-white border border-gray-200 rounded-b-lg">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0"
              >
                {/* Book Now button */}
                <div className="flex items-center">
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>

                {/* Price */}
                <div className="flex flex-col">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>

                {/* Per night */}
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>

                {/* Room details */}
                <div className="flex flex-col space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Second room type header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-900 text-white p-4 rounded-t-lg mt-8">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Second room type rows */}
          <div className="bg-white border border-gray-200 rounded-b-lg">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed left-4 bottom-4 space-y-4">
        <div className="w-12 h-12 bg-red-200 rounded-full animate-pulse"></div>
        <div className="w-12 h-12 bg-red-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
