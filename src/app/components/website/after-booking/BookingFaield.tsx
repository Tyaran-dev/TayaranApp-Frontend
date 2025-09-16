"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  CreditCard,
  Wifi,
  Server,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Variant = "default" | "outline" | "success" | "destructive";
type Size = "default" | "sm" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  asChild?: boolean;
}

type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  size?: Size;
};

export default function BookingFailed() {
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();
  const t = useTranslations("BookingFailed");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const errorData = {
    errorCode: "BK-ERR-4521",
    timestamp: new Date().toLocaleString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    attemptedFlight: {
      route: t("attemptedFlight.route"),
      date: t("attemptedFlight.date"),
      flightNumber: t("attemptedFlight.flightNumber"),
      passengers: 1,
    },
  };

  const commonIssues = [
    {
      icon: CreditCard,
      title: t("commonIssues.0.title"),
      description: t("commonIssues.0.description"),
      color: "text-red-600 bg-red-100",
    },
    {
      icon: Clock,
      title: t("commonIssues.1.title"),
      description: t("commonIssues.1.description"),
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Wifi,
      title: t("commonIssues.2.title"),
      description: t("commonIssues.2.description"),
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Server,
      title: t("commonIssues.3.title"),
      description: t("commonIssues.3.description"),
      color: "text-purple-600 bg-purple-100",
    },
  ];

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

  const CardHeader: React.FC<CardProps> = ({
    children,
    className = "",
    delay = 0,
  }) => (
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

  // Custom Badge Component
  const Badge: React.FC<CardProps> = ({
    children,
    variant = "default",
    className = "",
  }) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      outline: "border border-gray-300 text-gray-700 bg-white",
      destructive: "bg-red-100 text-red-800",
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
  const Button: React.FC<ButtonProps> = ({
    children,
    variant = "default",
    size = "default",
    className = "",
    asChild = false,
    ...props
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      ghost: "hover:bg-gray-100 text-gray-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-green-600 text-white hover:bg-green-700",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-md",
    };

    if (asChild) {
      return (
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("backButton")}
        </Link>
      );
    }

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Error Message */}
        <div
          className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{t("subtitle")}</p>
          <Badge
            variant="destructive"
            className="text-lg px-6 py-2 font-semibold"
          >
            {t("errorCodeLabel")}: {errorData.errorCode}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Error Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Summary Card */}
            <Card delay={200}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  {t("whatHappenedTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">
                    {t("errorSummary.title")}
                  </h3>
                  <p className="text-red-800 text-sm mb-3">
                    {t("errorSummary.description")}
                  </p>
                  <div className="text-xs text-red-700">
                    <div>
                      {t("errorSummary.timestampLabel")}: {errorData.timestamp}
                    </div>
                    <div>
                      {t("errorSummary.referenceIdLabel")}:{" "}
                      {errorData.errorCode}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Attempted Booking Details */}
                {/* <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {t("attemptedBookingTitle")}
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("routeLabel")}</span>
                      <span className="font-semibold text-gray-900">
                        {errorData.attemptedFlight.route}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("flightLabel")}</span>
                      <span className="font-semibold text-gray-900">
                        {errorData.attemptedFlight.flightNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("dateLabel")}</span>
                      <span className="font-semibold text-gray-900">
                        {errorData.attemptedFlight.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("passengersLabel")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {errorData.attemptedFlight.passengers}
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Common Issues */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {t("commonCausesTitle")}
                  </h4>
                  <div className="grid gap-3">
                    {commonIssues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-50`}
                        >
                          <issue.icon className="w-4 h-4 text-emerald-600 " />
                        </div>
                        <div >
                          <div className="font-medium text-gray-900">
                            {issue.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {issue.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card delay={400}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {t("quickActionsTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full text-sm  bg-emerald-600 transition-colors duration-200"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mx-2" />
                  {t("tryAgainButton")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex bg-greenGradient text-slate-200 hover:bg-gray-50 transition-colors duration-200"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 m-2" />
                  <Link href={`/${locale}/flight-search`}>
                    {t("backToSearchButton")}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Support Options */}
            <Card delay={500}>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  {t("needHelpTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm justify-between items-center w-full duration-200">
                    <Phone className="w-5 h-5 text-green-600" />
                    {t("callSupportLabel")}: 1-800-SKY-LINE
                  </div>

                  <div className="flex gap-2 text-sm justify-between items-center w-full duration-200">
                    <Mail className="w-5 h-5 text-green-600" />
                    support@skylineairways.com
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {t("responseTimeLabel")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`text-center mt-8 transition-all duration-700 delay-800 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <p className="text-gray-600 mb-4">{t("apologyMessage")}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <button className="hover:text-blue-600 transition-colors duration-200">
              {t("systemStatusLink")}
            </button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors duration-200">
              {t("helpCenterLink")}
            </button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors duration-200">
              {t("contactSupportLink")}
            </button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors duration-200">
              {t("reportIssueLink")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
