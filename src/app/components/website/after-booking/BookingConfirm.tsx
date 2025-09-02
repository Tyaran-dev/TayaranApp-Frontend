"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Download,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Plane,
  Users,
  CreditCard,
  Phone,
  Globe,
} from "lucide-react";

type Variant = "default" | "secondary" | "outline" | "success";
type Size = "default" | "sm" | "lg";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  size?: Size;
};

type FlightOrder = {
  message: string;
  order: {
    type: string;
    id: string;
    data: {
      associatedRecords: any[];
      contacts: any[];
      flightOffers: any[];
      travelers: any[];
    };
    dictionaries: Record<string, any>;
  };
};

type FlightBookingThankYouProps = {
  order: FlightOrder;
};

export default function FlightBookingThankYou({
  order,
}: FlightBookingThankYouProps) {
  const [isVisible, setIsVisible] = useState(false);

  console.log(order, "order from confirimtion page");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Extract from order
  const record = order?.order?.data?.associatedRecords?.[0];
  const flightOffer = order?.order?.data?.flightOffers?.[0];
  const itinerary = flightOffer?.itineraries?.[0];
  const segment = itinerary?.segments?.[0];
  const traveler = order?.order?.data?.travelers?.[0];
  const price = flightOffer?.price;

  const bookingData = {
    confirmationNumber: record?.reference || "N/A",
    bookingDate: new Date(record?.creationDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    passenger: {
      name: `${traveler?.name?.firstName || ""} ${traveler?.name?.lastName || ""}`,
      email: traveler?.contact?.emailAddress || "N/A",
      phone: traveler?.contact?.phones?.[0]?.number || "N/A",
    },
    flight: {
      airline: flightOffer?.validatingAirlineCodes?.[0] || "Unknown",
      flightNumber: segment?.carrierCode + " " + segment?.number,
      departure: {
        city:
          order?.order?.dictionaries?.locations?.[segment?.departure?.iataCode]
            ?.cityCode || "",
        airport: segment?.departure?.iataCode,
        code: segment?.departure?.iataCode,
        time: new Date(segment?.departure?.at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(segment?.departure?.at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        terminal: segment?.departure?.terminal || "-",
      },
      arrival: {
        city:
          order?.order?.dictionaries?.locations?.[segment?.arrival?.iataCode]
            ?.cityCode || "",
        airport: segment?.arrival?.iataCode,
        code: segment?.arrival?.iataCode,
        time: new Date(segment?.arrival?.at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(segment?.arrival?.at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        terminal: segment?.arrival?.terminal || "-",
      },
      duration: segment?.duration || "",
      aircraft: segment?.aircraft?.code || "",
      seat: traveler?.documents?.[0]?.number || "N/A", // fallback since real seat isn’t in Amadeus
      class: flightOffer?.pricingOptions?.fareType?.[0] || "Economy",
    },
    pricing: {
      basePrice: parseFloat(price?.base || "0"),
      taxes:
        (price?.fees as { amount: string }[] | undefined)?.reduce(
          (acc: number, fee: { amount: string }) =>
            acc + parseFloat(fee.amount),
          0
        ) ?? 0,
      fees: 0, // you can separate service fee if you have it
      total: parseFloat(price?.grandTotal || "0"),
    },
  };

  // Custom Card Component
  const Card: React.FC<CardProps> = ({
    children,
    className = "",
    delay = 0,
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-700 ${className} ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`border-b border-gray-100 px-6 py-4 ${className}`}>
      {children}
    </div>
  );

  const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );

  const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>{children}</div>
  );

  const Badge: React.FC<CardProps> = ({
    children,
    variant = "default",
    className = "",
  }) => {
    // Custom Badge Component
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 !text-emerald-600 text-sm font-medium";

    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      secondary: "bg-blue-100 text-blue-800",
      outline: "border border-gray-300 text-gray-700 bg-white",
      success: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </span>
    );
  };

  // Custom Button Component

  const Button: React.FC<CardProps> = ({
    children,
    variant = "default",
    size = "default",
    className = "",
    ...props
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";

    const variantClasses: Record<Variant, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      secondary: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-md",
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  // Custom Separator Component
  const Separator = ({ className = "" }) => (
    <div className={`w-full h-px bg-gray-200 my-4 ${className}`} />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Confirmation */}
        <div
          className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Your flight has been successfully booked
          </p>
          <Badge
            variant="secondary"
            className="text-lg px-6 py-2 bg-blue-100 text-blue-800 font-semibold"
          >
            Confirmation: {bookingData.confirmationNumber}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Information Card */}
            <Card delay={200}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Plane className="w-6 h-6 text-emerald-600" />
                    Flight Details
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {bookingData.flight.class}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{bookingData.flight.airline}</span>
                  <span>Flight {bookingData.flight.flightNumber}</span>
                  <span>{bookingData.flight.aircraft}</span>
                </div>

                {/* Route Display */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {bookingData.flight.departure.code}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {bookingData.flight.departure.city}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bookingData.flight.departure.airport}
                      </div>
                    </div>

                    <div className="flex-1 relative px-4">
                      <div className="h-px bottom-2 relative bg-gray-300">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-600  rounded-full p-2">
                          <Plane className="w-4 h-4 text-white transform rotate-90" />
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-500 mt-2">
                        {bookingData.flight.duration}
                      </div>
                    </div>

                    <div className="text-center flex-1">
                      <div className="text-3xl font-bold text-gray-900">
                        {bookingData.flight.arrival.code}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {bookingData.flight.arrival.city}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bookingData.flight.arrival.airport}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Departure and Arrival Times */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Departure
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-semibold">
                          {bookingData.flight.departure.time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {bookingData.flight.departure.date}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bookingData.flight.departure.terminal}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Arrival
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-semibold">
                          {bookingData.flight.arrival.time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {bookingData.flight.arrival.date}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bookingData.flight.arrival.terminal}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Information */}
            <Card delay={300}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Passenger Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passenger.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passenger.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passenger.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Booking Date</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.bookingDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <Card delay={400}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-semibold">
                      ${bookingData.pricing.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">
                      ${bookingData.pricing.taxes.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold">
                      ${bookingData.pricing.fees.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid</span>
                    <span className="text-green-600">
                      ${bookingData.pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Travel Tips */}
            <Card delay={800} className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Travel Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-semibold text-blue-900 mb-2">
                      Before You Travel
                    </h5>
                    <ul className="space-y-1 text-blue-800">
                      <li>• Check passport expiration date</li>
                      <li>• Review airline baggage policies</li>
                      <li>• Download the airline mobile app</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">
                      At the Airport
                    </h5>
                    <ul className="space-y-1 text-green-800">
                      <li>• Use mobile boarding pass</li>
                      <li>• Check security wait times</li>
                      <li>• Locate your departure gate</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Action Buttons */}
            {/* <Card delay={500}>
              <CardContent className="pt-6 space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:bg-gray-50 transition-colors duration-200"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Confirmation
                </Button>
              </CardContent>
            </Card> */}

            {/* Next Steps */}
            {/* <Card delay={600}>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium flex justify-start text-gray-900">
                        Check-in online
                        Available 24 hours before departure
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Arrive at airport
                      </div>
                      <div className="text-gray-600">
                        2 hours early for domestic flights
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Valid ID required
                      </div>
                      <div className="text-gray-600">
                        Government-issued photo ID
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Important Information */}
        <Card delay={700} className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Flexible Changes
                </h4>
                <p className="text-sm text-gray-600">
                  Change your flight up to 2 hours before departure with no
                  additional fees
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  24/7 Support
                </h4>
                <p className="text-sm text-gray-600">
                  Our customer service team is available around the clock for
                  assistance
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Travel Updates
                </h4>
                <p className="text-sm text-gray-600">
                  Receive real-time notifications about your flight status via
                  email and SMS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
