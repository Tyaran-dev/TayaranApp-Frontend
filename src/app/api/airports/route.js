import { getAmadeusToken } from '../../../utils/amadeus-token';
import axios from 'axios';

export async function GET(request) {
    const airportsApiUrl = 'https://testflight.eficta.com/api/flights-core/select2/airports';
    // const accessToken = await getAmadeusToken();

    // Extract query parameters from the request
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || 1;
    // const limit = searchParams.get('limit') || 10;
    // const offset = searchParams.get('offset') || 0;

    if (!keyword) {
        return new Response(
            JSON.stringify({ error: 'Keyword is required for searching.' }),
            { status: 400 }
        );
    }

    try {

        const response = await axios.get(airportsApiUrl, {
            params: {
                search,
                page                
            },
            headers: {
                // Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                "lng": "en"
            },
        });

        // Return successful response
        return new Response(JSON.stringify(response.data.data), { status: 200 });
    } catch (error) {
        if (error.response) {
            console.error('API Response Error:', error.response.data);
            return new Response(
                JSON.stringify({
                    error: error.response.data.errors || 'An error occurred while fetching data.',
                }),
                { status: error.response.status }
            );
        } else {
            console.error('Request Error:', error.message);
            return new Response(
                JSON.stringify({
                    error: error.message || 'An unknown error occurred.',
                }),
                { status: 500 }
            );
        }
    }
}

