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
  TicketIcon,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type Variant = "default" | "secondary" | "outline" | "success" | "emerald";
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

type Ticket = {
  documentType: string;
  documentNumber: string;
  documentStatus: string;
  travelerId: string;
  segmentIds?: string[];
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
    tickets?: Ticket[];
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
  const t = useTranslations("FlightBooking");
  const locale = useLocale();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isRTL = lng === "ar";

  // Get the correct associated record with creationDate
  const record = order?.data?.associatedRecords?.find(
    (record) => record.creationDate
  ) || order?.data?.associatedRecords?.[0];

  const flightOffer = order?.data?.flightOffers?.[0];
  const itinerary = flightOffer?.itineraries?.[0];
  const segments = itinerary?.segments || [];
  const traveler = order?.data?.travelers?.[0];
  const price = flightOffer?.price;
  const tickets = order?.data?.tickets || [];

  // Airline lookup helper - using database data
  const airline = order?.airlines?.[flightOffer?.validatingAirlineCodes?.[0] || ""] || {
    name: { en: "Unknown Airline", ar: "شركة طيران غير معروفة" },
    image: "/default-airline.png",
    code: "UA"
  };

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
    pricing: {
      basePrice: parseFloat(price?.base || "0"),
      taxes: 0,
      fees: 0,
      total: parseFloat(price?.total || "0"),
      currency: price?.currency || "SAR",
    },
  };

  // Calculate taxes from traveler pricing
  if (flightOffer?.travelerPricings?.[0]?.price?.taxes) {
    bookingData.pricing.taxes = flightOffer.travelerPricings[0].price.taxes.reduce(
      (sum: number, tax: { amount: string }) => sum + parseFloat(tax.amount),
      0
    );
  }

  // Custom Card Component
  const Card: React.FC<CardProps> = ({
    children,
    className = "",
    delay = 0,
  }) => (
    <div
      className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] ${className} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );

  const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`border-b border-gradient-to-r from-purple-200 to-blue-200  px-6 py-5 bg-greenGradient ${className}`}>
      {children}
    </div>
  );

  const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => (
    <h3 className={`text-base font-semibold text-white ${className}`}>
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
    const variantClasses = {
      default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-md",
      secondary: "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg",
      outline: "border-2 border-purple-300 text-purple-700 bg-white/80 backdrop-blur-sm shadow-md",
      success: "bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg",
      emerald: "bg-emerald-600"
    };

    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </span>
    );
  };

  const Separator = ({ className = "" }) => (
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent my-6 ${className}`} />
  );

  // Ticket Card Component
  const TicketCard = ({ ticket, traveler }: { ticket: Ticket; traveler: any }) => (
    <Card delay={250}>
      <CardHeader>
        <CardTitle className=" font-bold flex items-center gap-2">
          <TicketIcon className="w-5 h-5 text-white" />
          {t("eTicket")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600">{t("ticketNumber")}</div>
              <div className="text-lg font-bold text-gray-900 font-mono">
                {ticket.documentNumber}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{t("status")}</div>
              <Badge variant="emerald" className="mt-1 rounded-lg text-slate-200 bg-emerald-700">
                <Check className="w-3 h-3 mr-1" />
                {t("issued")}
              </Badge>
            </div>
          </div>

          <div className="border-t border-emerald-200 pt-3 mt-3">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">{t("passenger")}:</span>
                <span className="ml-2 font-semibold">{traveler?.name?.firstName} {traveler?.name?.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">{t("mobileBoardingPass")}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Flight Segment Component
  const FlightSegment = ({ segment, index, isLast }: { segment: any; index: number; isLast: boolean }) => {
    // Get airport data from database
    const depAirport = order?.airports?.[segment?.departure?.iataCode || ""] || {
      name: { en: segment?.departure?.iataCode || "Unknown", ar: segment?.departure?.iataCode || "غير معروف" },
      city: { en: "Unknown", ar: "غير معروف" }
    };

    const arrAirport = order?.airports?.[segment?.arrival?.iataCode || ""] || {
      name: { en: segment?.arrival?.iataCode || "Unknown", ar: segment?.arrival?.iataCode || "غير معروف" },
      city: { en: "Unknown", ar: "غير معروف" }
    };

    // Get airline data from database
    const segmentAirline = order?.airlines?.[segment?.carrierCode || ""] || {
      name: { en: "Unknown Airline", ar: "شركة طيران غير معروفة" },
      image: "/default-airline.png"
    };

    const departureTime = segment?.departure?.at
      ? new Date(segment.departure.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "N/A";

    const arrivalTime = segment?.arrival?.at
      ? new Date(segment.arrival.at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "N/A";

    const departureDate = segment?.departure?.at
      ? new Date(segment.departure.at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "N/A";

    const arrivalDate = segment?.arrival?.at
      ? new Date(segment.arrival.at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "N/A";

    // Calculate layover time if not last segment
    let layoverDuration = "";
    if (!isLast && segments[index + 1]) {
      const currentArrival = new Date(segment.arrival.at);
      const nextDeparture = new Date(segments[index + 1].departure.at);
      const diff = nextDeparture.getTime() - currentArrival.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      layoverDuration = `${hours}h ${minutes}m`;
    }

    return (
      <div key={segment.id}>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="text-xl font-bold text-gray-900">
                {segment?.departure?.iataCode}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {depAirport.name[lng]}

              </div>
            </div>

            <div className="flex-1 relative px-4">
              <div className="h-px relative bg-gray-300">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full p-2">
                  <Plane className="w-4 h-4 text-white transform rotate-90" />
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                {segment?.duration}
              </div>
              <div className="text-center text-xs text-gray-400 mt-1">
                {segmentAirline.name[lng]} {segment?.number}
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="text-xl font-bold text-gray-900">
                {segment?.arrival?.iataCode}

              </div>
              <div className="text-sm text-gray-600 mt-1">
                {arrAirport.name[lng]}

              </div>
            </div>
          </div>

          {/* Departure and Arrival Times */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {t("departure")}
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-lg font-semibold">{departureTime}</span>
                </div>
                <div className="text-sm text-gray-600">{departureDate}</div>
                <div className="text-sm text-gray-500">
                  {t("terminal")}: {segment?.departure?.terminal || "-"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {t("arrival")}
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-lg font-semibold">{arrivalTime}</span>
                </div>
                <div className="text-sm text-gray-600">{arrivalDate}</div>
                <div className="text-sm text-gray-500">
                  {t("terminal")}: {segment?.arrival?.terminal || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layover Information */}
        {!isLast && (
          <div className="mt-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">
                  {t("layover")} in {arrAirport.city[lng]}: {layoverDuration}
                </span>
              </div>
            </div>
            {index < segments.length - 1 && <Separator className="mt-6" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen  relative overflow-hidden ${isRTL ? "rtl" : "ltr"}`} >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Confirmation */}
        <div
          className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-greenGradient rounded-full mb-6 animate-bounce shadow-2xl shadow-emerald-500/50">
            <Check className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-5xl font-bold text-emerald-600  mb-4 drop-shadow-lg">
            {t("bookingConfirmed")}
          </h2>
          <p className="text-xl  mb-6 font-medium">
            {t("flightSuccessfullyBooked")}
          </p>
          <Badge
            className="text-lg px-8 py-3 bg-greenGradient text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {t("confirmation")}: {bookingData.confirmationNumber}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* E-Ticket Card */}
            {tickets.length > 0 && (
              <TicketCard ticket={tickets[0]} traveler={traveler} />
            )}

            {/* Flight Information Card */}
            <Card delay={300}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {airline?.image && (
                      <img
                        src={airline.image}
                        alt={airline.name[lng]}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <CardTitle className="text-2xl font-bold">
                      {t("flightDetails")}
                    </CardTitle>
                  </div>
                  <Badge className="bg-green-100 rounded-lg text-green-800 border-green-300">
                    {flightOffer?.pricingOptions?.fareType?.[0] || t("economy")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{airline?.name?.[lng] || t("unknown")}</span>
                  <span className="font-medium">
                    {segments.length > 1 ? `${segments.length} ${t("connecting")} flights` : t("directFlight")}
                  </span>
                </div>

                {/* All Flight Segments */}
                {segments.map((segment: any, index: number) => (
                  <FlightSegment
                    key={segment.id}
                    segment={segment}
                    index={index}
                    isLast={index === segments.length - 1}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Passenger Information */}
            <Card delay={400}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-300 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  {t("passengerInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-emerald-600 ">{t("fullName")}</div>
                    <div className="font-bold text-gray-800 ">
                      {bookingData.passenger.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-600 font-medium">{t("email")}</div>
                    <div className="font-bold text-gray-800 ">
                      {bookingData.passenger.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-600 font-medium">{t("phone")}</div>
                    <div className="font-bold text-gray-800 ">
                      {bookingData.passenger.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-600 font-medium">
                      {t("bookingDate")}
                    </div>
                    <div className="font-bold text-gray-800 ">
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
            <Card delay={500}>
              <CardHeader>
                <CardTitle className="font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  {t("bookingSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("basePrice")}</span>
                    <span className="font-semibold">
                      {bookingData.pricing.basePrice.toFixed(2)} {bookingData.pricing.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("taxesAndFees")}</span>
                    <span className="font-semibold">
                      {bookingData.pricing.taxes.toFixed(2)} {bookingData.pricing.currency}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between  font-bold">
                    <span>{t("totalPaid")}</span>
                    <span className="text-green-600">
                      {bookingData.pricing.total} {bookingData.pricing.currency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card delay={600} className="mt-6">
              <CardHeader>
                <CardTitle className="text-start font-bold text-gray-900">
                  {t("travelTips")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3 text-start">
                    <h5 className="font-semibold text-blue-900 mb-2">
                      {t("beforeYouTravel")}
                    </h5>
                    <ul className="space-y-1 text-blue-800">
                      <li>• {t("checkPassportExpiry")}</li>
                      <li>• {t("reviewBaggagePolicies")}</li>
                      <li>• {t("downloadAirlineApp")}</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-start">
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

            {/* Important Information */}
            <Card delay={700} className="mt-8">
              <CardHeader>
                <CardTitle className="text-start font-bold text-gray-900">
                  {t("importantInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-rows-3 gap-6">
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
      </div>
    </div>
  );
}