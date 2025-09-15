"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentFailedComponent from "@/app/components/website/after-booking/PaymentFaield";
import axios from "axios";
import { useLocale } from "next-intl";
import { LoadingSpinner } from "@/app/components/shared/Feedback/loading-spinner"; // make sure path is correct

interface ApiResponse {
  IsSuccess: boolean;
  Data: {
    InvoiceId: number;
    InvoiceStatus: string;
    InvoiceValue: number;
    InvoiceDisplayValue: string;
    InvoiceTransactions: {
      TransactionId: string;
      PaymentId: string;
      TransactionStatus: string;
      TransationValue: string;
      Currency: string;
      Error: string;
      ErrorCode: string;
      CardNumber: string;
      Card: {
        NameOnCard: string;
        Number: string;
        ExpiryMonth: string;
        ExpiryYear: string;
        Brand: string;
        Issuer: string;
      };
    }[];
  };
}

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const locale = useLocale();

  useEffect(() => {
    if (!paymentId) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.post<ApiResponse>(
          `${baseUrl}/payment/paymentStatus`,
          {
            key: paymentId,
            keyType: "PaymentId",
          }
        );

        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [paymentId, baseUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.IsSuccess) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load payment details: {error || "Unknown error"}
      </div>
    );
  }

  const txn = data.Data.InvoiceTransactions[0];

  return (
    <PaymentFailedComponent
      transactionId={txn.TransactionId}
      errorMessage={`${txn.Error} (Code: ${txn.ErrorCode})`}
      amount={Number(txn.TransationValue)}
      currency={txn.Currency}
      paymentMethod={`${txn.Card.Brand} •••• ${txn.Card.Number.slice(-4)}`}
      onGoBack={() => (window.location.href = `/${locale}/book-now`)}
    />
  );
}
