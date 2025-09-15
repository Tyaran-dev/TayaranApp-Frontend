"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import FlightCard from "@/app/components/website/book-now/DepartureCard";
import FlightBookingThankYou from "@/app/components/website/after-booking/BookingConfirm";
import BookingFailed from "@/app/components/website/after-booking/BookingFaield";
import OrderProgress from "@/app/components/website/after-booking/OrderProgress";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "FAILED">(
    "PENDING"
  );
  const [order, setOrder] = useState<any>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log(order, "order");

  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(`${baseUrl}/payment/bookingStatus`, {
          paymentId,
        });
        console.log(res.data, "check");

        if (res.data.status === "CONFIRMED") {
          setStatus("CONFIRMED");
          setOrder(res.data.order);
          clearInterval(interval); // ✅ stop polling
        } else if (res.data.status === "FAILED") {
          setStatus("FAILED");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching booking status", err);
      }
    }, 8000); // poll every 8 seconds

    return () => clearInterval(interval);
  }, [paymentId]);

  return (
    <div className=" text-center min-h-svh">
      {status === "PENDING" && (
        <div>
          <OrderProgress />
        </div>
      )}

      {status === "CONFIRMED" && (
        <div>
          {order && (
            <div>
              <FlightBookingThankYou order={order} />
              {/* Show more order details */}
            </div>
          )}
        </div>
      )}

      {status === "FAILED" && (
        <div>
          <BookingFailed />
        </div>
      )}
    </div>
  );
}
