import axios from "axios";

export async function POST(req) {
  try {
    const { amount, customerName, customerEmail, customerMobile } = await req.json();

    const API_KEY = process.env.MYFATOORAH_API_KEY;
    const INITIATE_SESSION_URL = "https://apitest.myfatoorah.com/v2/InitiateSession";
    const EXECUTE_PAYMENT_URL = "https://apitest.myfatoorah.com/v2/ExecutePayment";

    const sessionResponse = await axios.post(
      INITIATE_SESSION_URL,
      { CountryCode: "KWT" },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Session Response:", sessionResponse.data);

    if (!sessionResponse.data.IsSuccess) {
      throw new Error("Failed to initiate session: " + sessionResponse.data.Message);
    }

    const paymentResponse = await axios.post(
      EXECUTE_PAYMENT_URL,
      {
        CountryCode: "KWT", 
        InvoiceValue: amount,
        PaymentMethodId:2,
        CustomerName: customerName,
        CustomerEmail: customerEmail,
        MobileCountryCode: "+965",
        CustomerMobile: customerMobile,
        DisplayCurrencyIso: "KWD",
        Language: "en",
        PaymentGateway: "MyFatoorahPayment", 
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Payment Response:", paymentResponse.data);

    if (paymentResponse.data.IsSuccess) {
      return new Response(JSON.stringify({ iframeURL: paymentResponse.data.Data.PaymentURL }), {
        status: 200,
      });
    } else {
      throw new Error("Failed to retrieve payment iframe URL.");
    }
  } catch (error) {
    console.error("❌ ERROR:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: error.response?.data || error.message }), {
      status: 500,
    });
  }
}
