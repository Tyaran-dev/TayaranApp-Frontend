"use client";

import {
  CreditCard,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

interface PaymentFailedProps {
  transactionId?: string;
  errorMessage?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  bookingDetails?: {
    flightNumber: string;
    route: string;
    date: string;
  };
  onRetryPayment?: () => void;
  onChangePaymentMethod?: () => void;
  onGoBack?: () => void;
}

export default function PaymentFailedComponent({
  transactionId = "TXN-FAIL-000001",
  errorMessage = "Payment was declined by your bank",
  amount = 0,
  currency = "USD",
  paymentMethod = "**** **** **** 0000",
  bookingDetails,
  onRetryPayment,
  onChangePaymentMethod,
  onGoBack,
}: PaymentFailedProps) {
  // Custom Card Component
  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
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
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>{children}</div>
  );

  // Custom Badge Component
  const Badge = ({ children, variant = "default", className = "" }) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      secondary: "bg-blue-100 text-blue-800",
      outline: "border border-gray-300 text-gray-700 bg-white",
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

  // Custom Button Component
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

  // Custom Separator Component
  const Separator = ({ className = "" }) => (
    <div className={`w-full h-px bg-gray-200 my-4 ${className}`} />
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Error Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 animate-bounce">
          <CreditCard className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          We couldn't process your payment
        </p>
        <Badge variant="destructive" className="px-4 py-1">
          Transaction: {transactionId}
        </Badge>
      </div>

      {/* Payment Error Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Payment Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-medium mb-2">{errorMessage}</p>
            <p className="text-sm text-red-700">
              No charges have been applied to your account. You can safely try
              again.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>
            {amount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">
                  ${amount.toFixed(2)} {currency}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details (if provided) */}
      {bookingDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight</span>
                <span className="font-semibold">
                  {bookingDetails.flightNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="font-semibold">{bookingDetails.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">{bookingDetails.date}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-3">
          <Button
            onClick={onChangePaymentMethod}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200"
            size="lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Try Different Payment Method
          </Button>
          <Button
            onClick={onRetryPayment}
            variant="outline"
            className="w-full hover:bg-gray-50 transition-colors duration-200"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Payment
          </Button>
          <Button
            onClick={onGoBack}
            variant="outline"
            className="w-full hover:bg-gray-50 transition-colors duration-200"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Button>
        </CardContent>
      </Card>

      {/* Security Assurance */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">
                Your Information is Secure
              </h4>
            </div>
            <p className="text-sm text-green-800">
              All payment information is encrypted and protected. Since the
              payment failed, no charges were processed and your financial
              information remains secure.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Support Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start hover:bg-blue-50 transition-colors duration-200"
            >
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              Call Support
            </Button>
            <Button
              variant="outline"
              className="justify-start hover:bg-green-50 transition-colors duration-200"
            >
              <Mail className="w-4 h-4 mr-2 text-green-600" />
              Email Help
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Average response time: Under 5 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
