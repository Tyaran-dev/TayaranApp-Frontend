"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Script from "next/script";
import { TravelerFormData } from "@/app/[locale]/(root)/book-now/page";
import { useTranslations } from "next-intl";

interface FlightPrice {
  total: number;
  base?: number;
  taxes?: number;
}

interface FlightData {
  id: string;
  price: FlightPrice;
  airline?: string;
  departureTime?: string;
  arrivalTime?: string;
}

declare global {
  interface Window {
    myfatoorah: {
      init: (config: {
        sessionId: string;
        countryCode: string;
        currencyCode: string;
        amount: number;
        containerId: string;
        paymentOptions: string[];
        callback: (resp: { isSuccess: boolean }) => void;
      }) => void;
    };
  }
}

interface PaymentPageProps {
  flightData: FlightData;
  travelers: TravelerFormData[];
  setLoading: (loading: boolean) => void;
  finalPrice: number;
}

export default function PaymentPage({
  flightData,
  travelers,
  setLoading,
  finalPrice,
}: PaymentPageProps) {
  const t = useTranslations("bookNow");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [session, setSession] = useState<{
    SessionId: string;
    CountryCode: string;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const initDone = useRef(false);

  // Step 1 — Start MyFatoorah session
  useEffect(() => {
    (async () => {
      const r = await axios.post(`${baseUrl}/payment/initiateSession`);
      setSession(r.data.data.Data); // { SessionId, CountryCode }
    })();
  }, []);

  // Step 2 — Init widget
  useEffect(() => {
    if (!ready || !session || !window.myfatoorah || initDone.current) return;
    window.myfatoorah.init({
      sessionId: session.SessionId,
      countryCode: session.CountryCode,
      currencyCode: "SAR",
      amount: finalPrice,
      containerId: "embedded-payment",
      paymentOptions: ["ApplePay", "Card"],
      callback: async (resp) => {
        if (!resp.isSuccess) {
          alert("Card data rejected");
          return;
        }

        // Call backend to execute payment & store booking data
        const res = await axios.post(`${baseUrl}/payment/execute-payment`, {
          sessionId: session.SessionId,
          invoiceValue: finalPrice,
          flightData,
          travelers, // send booking data to backend to store with invoiceId
        });

        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
          // alert("Please complete the payment in the opened window.");
        } else {
          alert("Could not start payment.");
        }
      },
    });

    initDone.current = true;
  }, [ready, session]);

  return (
    <>
      <Script
        src="https://sa.myfatoorah.com/payment/v1/session.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <h2 className="text-xl mb-4">MyFatoorah Payment</h2>
      <div id="embedded-payment" style={{ minHeight: 300 }} />
    </>
  );
}
