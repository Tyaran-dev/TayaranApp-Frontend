"use client";

export default function BookingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>

            {/* Navigation */}
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="h-8 w-24 bg-green-200 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="space-y-6">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>

              {/* Hotel Image and Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-40 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>

                <div className="space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Booking Details */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex space-x-2 space-x-reverse mt-4">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-greenGradient rounded animate-pulse"></div>
                  <div className="h-6 w-18 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="h-4 w-32 bg-greenGradient rounded animate-pulse mt-3"></div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-lg p-6 shadow-sm mt-4">
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-4"></div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="h-12 w-full bg-greenGradient rounded-lg animate-pulse mt-6"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Guest Details */}
          <div className="space-y-6">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Room Selection */}
                <div className="bg-greenGradient text-white p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-20 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Guest 1 Details */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Title Selection */}
                  <div className="flex space-x-2 space-x-reverse mb-4">
                    <div className="h-10 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-12 bg-blue-200 rounded animate-pulse"></div>
                    <div className="h-10 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Guest 2 Details */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Title Selection */}
                  <div className="flex space-x-2 space-x-reverse mb-4">
                    <div className="h-10 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-12 bg-greenGradient rounded animate-pulse"></div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
                    <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
                    <div className="h-4 w-72 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fees and Extras */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>

              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-4"></div>
            </div>

            {/* Check-in Instructions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
