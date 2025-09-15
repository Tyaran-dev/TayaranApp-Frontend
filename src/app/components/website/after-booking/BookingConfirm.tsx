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
import { useTranslations, useLocale } from "next-intl"; // Assuming you're using next-intl

type Variant = "default" | "secondary" | "outline" | "success";
type Size = "default" | "sm" | "lg";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  size?: Size;
};

type Airline = {
  id: string;
  code: string;
  name: { en: string; ar: string };
  image: string;
};

type Airport = {
  id: string;
  code: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
};

type FlightOrder = {
  airlines: Record<string, Airline>;
  airports: Record<string, Airport>;
  data: {
    type: string;
    id: string;
    associatedRecords: any[];
    contacts: any[];
    flightOffers: any[];
    travelers: any[];
    ticketingAgreement: { option: string };
  };
  dictionaries: {
    locations: Record<string, any>;
  };
};

type FlightBookingThankYouProps = {
  order: FlightOrder;
  lng?: "en" | "ar";
};

export default function FlightBookingThankYou({
  order,
  lng = "en",
}: FlightBookingThankYouProps) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("FlightBooking"); // Hook to access translations
  const locale = useLocale();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isRTL = lng === "ar";

  const record = order?.data?.associatedRecords?.[0];
  const flightOffer = order?.data?.flightOffers?.[0];
  const itinerary = flightOffer?.itineraries?.[0];
  const segment = itinerary?.segments?.[0];
  const traveler = order?.data?.travelers?.[0];
  const price = flightOffer?.price;

  // --- Airline & Airport lookup helpers ---
  const airline =
    order?.airlines?.[flightOffer?.validatingAirlineCodes?.[0] || ""] || null;
  const depAirport = order?.airports?.[segment?.departure?.iataCode || ""];
  const arrAirport = order?.airports?.[segment?.arrival?.iataCode || ""];

  const bookingData = {
    confirmationNumber: record?.reference || "N/A",
    bookingDate: record?.creationDate
      ? new Date(record.creationDate).toLocaleDateString(
          lng === "ar" ? "ar-EG" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : "N/A",
    passenger: {
      name: `${traveler?.name?.firstName || ""} ${traveler?.name?.lastName || ""}`,
      email: traveler?.contact?.emailAddress || "N/A",
      phone: traveler?.contact?.phones?.[0]?.number || "N/A",
    },
    flight: {
      airlineName: airline ? airline.name[lng] : t("unknown"),
      airlineLogo: airline?.image,
      flightNumber: segment
        ? `${segment?.carrierCode} ${segment?.number}`
        : "N/A",
      departure: {
        airportName: depAirport?.name?.[lng] || segment?.departure?.iataCode,
        city: depAirport?.city?.[lng] || "",
        code: depAirport?.code,
        time: segment?.departure?.at
          ? new Date(segment?.departure?.at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        date: segment?.departure?.at
          ? new Date(segment?.departure?.at).toLocaleDateString(
              lng === "ar" ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : "N/A",
        terminal: segment?.departure?.terminal || "-",
      },
      arrival: {
        airportName: arrAirport?.name?.[lng] || segment?.arrival?.iataCode,
        city: arrAirport?.city?.[lng] || "",
        code: arrAirport?.code,
        time: segment?.arrival?.at
          ? new Date(segment?.arrival?.at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        date: segment?.arrival?.at
          ? new Date(segment?.arrival?.at).toLocaleDateString(
              lng === "ar" ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : "N/A",
        terminal: segment?.arrival?.terminal || "-",
      },
      duration: segment?.duration || "",
      aircraft: segment?.aircraft?.code || "",
      seat: traveler?.documents?.[0]?.number || t("notAvailable"),
      class: flightOffer?.pricingOptions?.fareType?.[0] || t("economy"),
    },
    pricing: {
      basePrice: parseFloat(price?.base || "0"),
      taxes:
        (price?.fees as { amount: string }[] | undefined)?.reduce(
          (acc: number, fee: { amount: string }) =>
            acc + parseFloat(fee.amount),
          0
        ) ?? 0,
      fees: 0,
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
      style={{
        transitionDelay: `${delay}ms`,
      }}
      dir={locale === "ar" ? "rtl" : "ltr"}
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
    <h3 className={`text-lg  font-semibold text-gray-900 ${className}`}>
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

  const Separator = ({ className = "" }) => (
    <div className={`w-full h-px bg-gray-200 my-4 ${className}`} />
  );

  return (
    <div
      className={`min-h-screen  bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Confirmation */}
        <div
          className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t("bookingConfirmed")}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {t("flightSuccessfullyBooked")}
          </p>
          <Badge
            variant="secondary"
            className="text-lg px-6 py-2 bg-blue-100 text-blue-800 font-semibold"
          >
            {t("confirmation")}: {bookingData.confirmationNumber}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Information Card */}
            <Card delay={200}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {bookingData.flight.airlineLogo && (
                      <img
                        src={bookingData.flight.airlineLogo}
                        alt={bookingData.flight.airlineName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("flightDetails")}
                    </CardTitle>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {bookingData.flight.class}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{bookingData.flight.airlineName}</span>
                  <span>
                    {t("flight")} {bookingData.flight.flightNumber}
                  </span>
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
                        {bookingData.flight.departure.airportName}
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
                        {bookingData.flight.arrival.airportName}
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
                      {t("departure")}
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
                        {t("terminal")}: {bookingData.flight.departure.terminal}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {t("arrival")}
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
                        {t("terminal")}: {bookingData.flight.arrival.terminal}
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
                  {t("passengerInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">{t("fullName")}</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passenger.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t("email")}</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passenger.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t("phone")}</div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passenger.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {t("bookingDate")}
                    </div>
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
                  {t("bookingSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("basePrice")}</span>
                    <span className="font-semibold">
                      ${bookingData.pricing.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("taxesAndFees")}</span>
                    <span className="font-semibold">
                      ${bookingData.pricing.taxes.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("serviceFee")}</span>
                    <span className="font-semibold">
                      ${bookingData.pricing.fees.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("totalPaid")}</span>
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
                  {t("travelTips")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-semibold text-blue-900 mb-2">
                      {t("beforeYouTravel")}
                    </h5>
                    <ul className="space-y-1 text-blue-800">
                      <li>• {t("checkPassportExpiry")}</li>
                      <li>• {t("reviewBaggagePolicies")}</li>
                      <li>• {t("downloadAirlineApp")}</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">
                      {t("atTheAirport")}
                    </h5>
                    <ul className="space-y-1 text-green-800">
                      <li>• {t("useMobileBoardingPass")}</li>
                      <li>• {t("checkSecurityWaitTimes")}</li>
                      <li>• {t("locateDepartureGate")}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Information */}
        <Card delay={700} className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              {t("importantInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("flexibleChanges")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("flexibleChangesDescription")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("support24/7")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("support24/7Description")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("travelUpdates")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("travelUpdatesDescription")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
