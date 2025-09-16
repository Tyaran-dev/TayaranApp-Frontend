"use client";

import {
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Shield,
  Phone,
  Mail,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface PaymentFailedProps {
  transactionId?: string;
  errorMessage?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardIssuer?: string;
  cardExpiry?: string;
  onRetryPayment?: () => void;
  onChangePaymentMethod?: () => void;
  onGoBack?: () => void;
  lng?: "en" | "ar";
}

export default function PaymentFailedComponent({
  transactionId = "TXN-FAIL-000001",
  errorMessage = "Payment was declined by your bank",
  amount = 0,
  currency = "USD",
  paymentMethod = "**** **** **** 0000",
  cardBrand,
  cardLast4,
  cardIssuer,
  cardExpiry,
  onRetryPayment,
  onChangePaymentMethod,
  onGoBack,
  lng = "en",
}: PaymentFailedProps) {
  const t = useTranslations("PaymentFailed");
  const isRTL = lng === "ar";

  // RTL utilities
  const flexDirection = isRTL ? "flex-row-reverse" : "flex-row";
  const textAlign = isRTL ? "text-right" : "text-left";
  const marginDirection = isRTL ? "ml" : "mr";

  // === UI Helpers ===
  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );

  const CardHeader = ({ children, className = "" }) => (
    <div className={`border-b border-gray-100 px-6 py-4 ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = "" }) => (
    <h3
      className={`text-lg font-semibold text-gray-900 ${className} ${textAlign}`}
    >
      {children}
    </h3>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>{children}</div>
  );

  const Badge = ({ children, variant = "default", className = "" }) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      destructive: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </span>
    );
  };

  const Button = ({
    children,
    variant = "default",
    size = "default",
    className = "",
    onClick,
    ...props
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      ghost: "hover:bg-gray-100 text-gray-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-md",
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Error Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 animate-bounce">
          <CreditCard className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t("paymentFailed")}
        </h2>
        <p className="text-lg text-gray-600 mb-4">{t("paymentNotProcessed")}</p>
        <Badge variant="destructive" className="px-4 py-1">
          {t("transaction")}: {transactionId}
        </Badge>
      </div>

      {/* Payment Error Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            {t("paymentError")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-medium mb-2">{errorMessage}</p>
            <p className="text-sm text-red-700">{t("noChargesApplied")}</p>
          </div>

          <div className="space-y-3">
            <div className={`flex justify-between ${flexDirection}`}>
              <span className="text-gray-600">{t("paymentMethod")}</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>
            {cardBrand && (
              <div className={`flex justify-between ${flexDirection}`}>
                <span className="text-gray-600">{t("cardBrand")}</span>
                <span className="font-semibold">{cardBrand}</span>
              </div>
            )}
            {cardLast4 && (
              <div className={`flex justify-between ${flexDirection}`}>
                <span className="text-gray-600">{t("cardNumber")}</span>
                <span className="font-semibold">•••• {cardLast4}</span>
              </div>
            )}
            {cardExpiry && (
              <div className={`flex justify-between ${flexDirection}`}>
                <span className="text-gray-600">{t("expiry")}</span>
                <span className="font-semibold">{cardExpiry}</span>
              </div>
            )}
            {cardIssuer && (
              <div className={`flex justify-between ${flexDirection}`}>
                <span className="text-gray-600">{t("issuer")}</span>
                <span className="font-semibold">{cardIssuer}</span>
              </div>
            )}
            {amount > 0 && (
              <div className={`flex justify-between ${flexDirection}`}>
                <span className="text-gray-600">{t("amount")}</span>
                <span className="font-semibold">
                  {amount.toFixed(2)} {currency}
                </span>
              </div>
            )}
            <div className={`flex justify-between ${flexDirection}`}>
              <span className="text-gray-600">{t("transactionId")}</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-3">
          {/* <Button
            onClick={onChangePaymentMethod}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200"
            size="lg"
          >
            <CreditCard className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t("tryDifferentPayment")}
          </Button> */}
          <Button
            onClick={onGoBack}
            variant="outline"
            className="w-full !bg-emerald-600 text-slate-200 hover:bg-gray-50 transition-colors duration-200"
            size="lg"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t("backToBooking")}
          </Button>
        </CardContent>
      </Card>

      {/* Security Assurance */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div
              className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">
                {t("informationSecure")}
              </h4>
            </div>
            <p className="text-sm text-green-800">{t("securityDescription")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Support Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t("needHelp")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className={`justify-start hover:bg-blue-50 transition-colors duration-200 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Phone
                className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"} text-blue-600`}
              />
              {t("callSupport")}
            </Button>
            <Button
              variant="outline"
              className={`justify-start hover:bg-green-50 transition-colors duration-200 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Mail
                className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"} text-green-600`}
              />
              {t("emailHelp")}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {t("responseTime")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
