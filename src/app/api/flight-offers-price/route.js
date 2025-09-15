import axios from 'axios';
import { getAmadeusToken } from '../../../utils/amadeus-token';

export async function POST(request) {
    try {
        const requestBody = await request.json();
        const { flightOffers } = requestBody;

        if (!flightOffers || !Array.isArray(flightOffers)) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid request body. "flightOffers" must be an array.',
                }),
                { status: 400 }
            );
        }

        // const accessToken = await getAmadeusToken();

        const apiUrl = `https://test.api.amadeus.com/v1/shopping/flight-offers/pricing`;

        // Make the API call
        const response = await axios.post(
            apiUrl,
            {
                data: {
                    type: 'flight-offers-pricing',
                    flightOffers: flightOffers,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const pricingData = response.data;

        return new Response(JSON.stringify(pricingData), { status: 200 });
    } catch (error) {
        console.error('Error fetching flight pricing:', error);

        const statusCode = error.response?.status || 500;
        const message = error.response?.data || { error: error.message };

        return new Response(JSON.stringify(message), { status: statusCode });
    }
}







// {
//     "mapping":"CAI-RUH|2025-05-29|MS-649",
//     "contact_info":{
//         "name":"Omar Abulkhair",
//         "email":"omarabulkhair@icloud.com",
//         "phone":"01007100255",
//         "country_calling_code":"20"
//     },
//     "travellers":[
//         {
//             "UserType":"ADT", // CH , INF
//             "firstName":"Omar",
//             "lastName":"Helal",
//             "gender":"MALE", // FEMALE , MALE
        
//             "dateOfBirth":"1999-08-08",
//             "document":{
//                 "birthPlace":"Cairo",
//                 "issuanceLocation":"Cairo",
//                 "number":"P-712312113",
//                 "issuanceDate":"2024-01-01",
//                 "expiryDate":"2028-01-01",
//                 "issuanceCountry":"EG",
//                 "nationality":"EG"
//             }

//         }
//     ],

//     "currencyCode":"SAR",
//     "destinations":[
//         {
//             "id": "1",
//             "from": "CAI",
//             "to": "RUH",
//             "date": "2025-05-29"
//         }  
//     ],
//     "adults":1,
//     "children":0,
//     "infants":0,
//     "cabinClass":"Economy",
//     "directFlight":false,
//     "calendarSearch":false
// }