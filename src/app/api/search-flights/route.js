import axios from 'axios';
import { getAmadeusToken } from '../../../utils/amadeus-token';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate");
    const travelers = searchParams.get("travelers") || "1";
    const adult = searchParams.get("adult") || "2";
    const child = searchParams.get("child") || "0";
    const lapinfant = searchParams.get("lapinfant") || "0";
    const flightClass = searchParams.get("flightClass") || "Economy";
    const page = searchParams.get("page") || "1"; // Default to page 1
    const pageSize = searchParams.get("pageSize") || "10"; // Default page size
    const tripType = searchParams.get("tripType") || "oneway"; // Default to one-way trip
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    console.log(request.body, "body")

    const flightFormData = {
        "destinations": [
            {
                "id": "1",
                "from": origin,
                "to": destination,
                "date": formatDate(departureDate)
            }
        ],
        "adults": adult,
        "children": child,
        "infants": lapinfant,
        "acbinClass": flightClass,
        "directFlight": false,
        "calendarSearch": false
    };

    // Add return flight if tripType is roundtrip
    if (tripType === "roundtrip" && returnDate) {
        flightFormData.destinations.push({
            "id": "2",
            "from": destination,
            "to": origin,
            "date": formatDate(returnDate)
        });
    }



    try {
        // const accessToken = await getAmadeusToken();
        const apiUrl = 'https://testflight.eficta.com/api/flights-services/v1/public/amadeus/search?mapped=true';

        // Calculate offset based on page and pageSize
        const offset = (parseInt(page) - 1) * parseInt(pageSize);

        const params = {
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: formatDate(departureDate),
            adults: travelers,
            currencyCode: 'SAR',
            max: pageSize, // Number of results per page
            // offset: offset // Starting point for results
        };

        // Add returnDate if roundtrip
        if (returnDate) {
            params.returnDate = formatDate(returnDate);
        }

        // Add travel class if specified
        if (flightClass) {
            params.travelClass = flightClass.toUpperCase();
        }


        // Make the API call
        const response = await axios.post(apiUrl, flightFormData, {
            headers: {
                // Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const flightData = response.data.flights;
        const carriers = response.data.filters?.airlines || "test";
        const meta = response.data.meta || {};

        // Calculate pagination info
        const totalResults = meta.count || flightData.length;
        const totalPages = Math.ceil(totalResults / parseInt(pageSize));

        // Combine flight data with carriers and pagination info
        const result = {
            flights: flightData,
            carriers: carriers,
            pagination: {
                currentPage: parseInt(page),
                pageSize: parseInt(pageSize),
                totalResults,
                totalPages,
                hasNextPage: parseInt(page) < totalPages,
                hasPreviousPage: parseInt(page) > 1
            }
        };
        console.log(flightData, "fligth data from server")
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('Error fetching flights:', error);

        const statusCode = error.response?.status || 500;
        const message = error.response?.data || { error: error.message };

        return new Response(JSON.stringify(message), { status: statusCode });
    }
}


