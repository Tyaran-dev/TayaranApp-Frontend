"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("paymentId"); // ✅ use paymentId
    const [status, setStatus] = useState("LOADING");
    const [order, setOrder] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL



    console.log(paymentId, "paymentId")

    useEffect(() => {
        if (!paymentId) return;

        const checkStatus = async () => {
            try {
                const { data } = await axios.post(`${apiUrl}/payment/bookingStatus`, {
                    paymentId
                });

                setStatus(data.status);
                if (data.order) setOrder(data.order);
            } catch {
                setStatus("FAILED");
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, [paymentId]);

    if (status === "LOADING" || status === "PENDING") {
        return <p>⌛ We are confirming your booking. Please wait...</p>;
    }
    if (status === "CONFIRMED") {
        return (
            <div>
                <h1>✅ Thank you! Your booking is confirmed.</h1>
                {order && <pre>{JSON.stringify(order, null, 2)}</pre>}
            </div>
        );
    }
    return <p>❌ Sorry, your booking failed.</p>;
}
