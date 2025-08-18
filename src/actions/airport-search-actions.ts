"use server";
import { getAmadeusToken } from "@/utils/amadeus-token";
import axios from "axios";

export async function getAirports(query: string = "saudi arabia") {
  let lng = "ar";
  const detectLang = (text: string): "ar" | "en" => {
    if (!text) return "en"; // Default to English if empty

    // Regex to detect Arabic characters (Unicode range for Arabic script)
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text) ? "ar" : "en";
  };

  lng = detectLang(query);

  try {
    // const amadeusApiUrl = 'https://test.api.amadeus.com/v1/reference-data/locations';
    // const accessToken = await getAmadeusToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const airportsApiUrl = `${baseUrl}/airports/getairport?keyword=${query}&page=1`;

    const response = await axios.get(airportsApiUrl, {
      params: { q: query },
      headers: {
        // Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        lng: detectLang(query),
      },
    });
    return response.data.data; // Return the fetched airport data
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Previous request canceled:", error.message);
    } else {
      console.error(
        "Error fetching airports:",
        error.response?.data || error.message
      );
    }
    return null;
  }
}

// "use server";
// import { getAmadeusToken } from "@/utils/amadeus-token";
// import axios from "axios";

// export async function getAirports(query: string = "Saudi Arabia") {
//   try {
//     const amadeusApiUrl = "https://test.api.amadeus.com/v1/reference-data/locations";
//     const accessToken = await getAmadeusToken();

//     if (!accessToken) {
//       throw new Error("Failed to retrieve Amadeus access token");
//     }

//     const response = await axios.get(amadeusApiUrl, {
//       params: {
//         subType: "AIRPORT,CITY", // Search for both airports & cities
//         keyword: query, // Use query for search
//         page: { limit: 10 }, // Limit results (optional)
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Accept-Language": "ar", // Get results in Arabic
//       },
//     });

//     return response // Ensure an array is returned
//   } catch (error: any) {
//     console.error("Error fetching airports:", error.response?.data || error.message);
//     return null;
//   }
// }

// export async function getAirports(query: string = "") {
//     try {
//         const amadeusApiUrl = 'https://test.api.amadeus.com/v1/reference-data/locations';
//         const accessToken = await getAmadeusToken();

//         // Make the request to the API
//         const response = await axios.get(amadeusApiUrl, {
//             params: {
//                 subType: 'AIRPORT',
//                 keyword: "مومباي",
//                 'page[limit]': 10,
//                 'page[offset]': 0,
//                 sort: 'analytics.travelers.score',
//                 view: 'FULL',
//             },
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json',
//             },
//         });
// console.log(response.data.data)
//         // Return successful response
//         return new Response(JSON.stringify(response.data.data), { status: 200 }); // Return the fetched airport data

//     } catch (error: any) {
//         // Catch errors from the API request or token retrieval
//         if (axios.isCancel(error)) {
//             console.log("Previous request canceled:", error.message);
//         } else {
//             console.error("Error fetching airports:", error.response?.data || error.message);
//         }

//         // Return error response
//         return new Response(JSON.stringify({ error: 'Failed to fetch airports data.' }), { status: 500 });
//     }
// }
