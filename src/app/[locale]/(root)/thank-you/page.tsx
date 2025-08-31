"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("paymentId");

    const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "FAILED">("PENDING");
    const [order, setOrder] = useState<any>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!paymentId) return;

        const interval = setInterval(async () => {
            try {
                console.log("check")
                const res = await axios.post(`${baseUrl}/payment/bookingStatus`, {
                    paymentId,
                });

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
        <div className="p-8 text-center h-svh">
            {status === "PENDING" && (
                <div>
                    <h1 className="text-2xl font-bold">Processing your order...</h1>
                    <p>Please wait while we confirm your payment and booking.</p>
                </div>
            )}

            {status === "CONFIRMED" && (
                <div>
                    <h1 className="text-2xl font-bold text-green-600">Order Confirmed 🎉</h1>
                    <p>Thank you! Your booking has been successfully created.</p>
                    {order && (
                        <div className="mt-4">
                            <p><strong>Booking ID:</strong> {order._id}</p>
                            <p><strong>Invoice:</strong> {order.invoiceId}</p>
                            {/* Show more order details */}
                        </div>
                    )}
                </div>
            )}

            {status === "FAILED" && (
                <div>
                    <h1 className="text-2xl font-bold text-red-600">Payment Failed ❌</h1>
                    <p>We could not process your booking. Please try again.</p>
                </div>
            )}
        </div>
    );
}
