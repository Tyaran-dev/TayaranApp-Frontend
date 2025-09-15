"use client"; // Required for client-side rendering in Next.js 14

import { useState } from "react";

export default function MyFatoorahIframe({amount}) {
  const [iframeURL, setIframeURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/initializePayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount, 
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerMobile: "12345678",
        }),
      });

      const data = await response.json();

      console.log("da",data)
      if (data.iframeURL) {
        setIframeURL(data.iframeURL);
      } else {
        console.error("Failed to get MyFatoorah iframe URL");
      }
    } catch (error) {
      console.error("Error loading iframe:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      {!iframeURL ? (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="px-4 py-1.5 mt-5 text-sm bg-greenGradient text-white rounded-full  w-full"
        >
          {loading ? "Loading..." : "Pay with MyFatoorah"}
        </button>
      ) : (
        <iframe
          src={iframeURL}
          width="100%"
          height="600px"
          style={{ border: "none" }}
          title="MyFatoorah Payment"
        ></iframe>
      )}
    </div>
  );
}
