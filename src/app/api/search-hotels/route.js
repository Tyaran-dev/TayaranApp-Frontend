import axios from 'axios';
import { getAmadeusToken } from '../../../utils/amadeus-token';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const travelers = searchParams.get('travelers') || '1';

    try {
        // const accessToken = await getAmadeusToken();

        // Step 1: Fetch hotels by city
        const cityUrl = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city`;
        const cityResponse = await axios.get(cityUrl, {
            params: { cityCode: address },
            headers: {
                // Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const hotels = cityResponse.data.data;
        const hotelIds = hotels.map(hotel => hotel.hotelId);

        if (!hotelIds.length) {
            return new Response(
                JSON.stringify({ error: 'No hotels found for the given city code.' }),
                { status: 404 }
            );
        }

        const batchSize = 10;
        const hotelOffers = [];
        const invalidHotels = [];
        const unavailableHotels = [];

        for (let i = 0; i < hotelIds.length; i += batchSize) {
            const batch = hotelIds.slice(i, i + batchSize);

            try {
                const hotelOffersUrl = `https://test.api.amadeus.com/v3/shopping/hotel-offers`;
                const offersResponse = await axios.get(hotelOffersUrl, {
                    params: {
                        hotelIds: batch.join(','),
                        adults: travelers,
                        checkInDate: checkIn,
                        checkOutDate: checkOut,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                hotelOffers.push(...offersResponse.data.data);
            } catch (error) {
                // Handle specific errors
                if (error.response) {
                    const errorDetails = error.response.data.errors;
                    errorDetails.forEach(err => {
                        if (err.code === 3664) {
                            unavailableHotels.push(err.source.parameter);
                        } else if (err.code === 1257) {
                            invalidHotels.push(err.source.parameter);
                        }
                    });
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        }

        const result = {
            hotels,
            offers: hotelOffers,
            unavailableHotels, // List of hotels with no availability
            invalidHotels, // List of invalid hotel IDs
        };

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('Error fetching hotels:', error);

        const statusCode = error.response?.status || 500;
        const message = error.response?.data || { error: error.message };

        return new Response(JSON.stringify(message), { status: statusCode });
    }
}