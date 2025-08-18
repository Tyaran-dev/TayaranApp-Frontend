    // In your airports-helper.js or a similar file
import { existingAirports } from '../app/data/airports';

export function getAirportByIATA(iataCode) {
    const airport = existingAirports.find(airport => airport.iata_code === iataCode);
    // Return airport name or city if found, otherwise return a fallback message  
    // return airport ? `${airport.name}, ${airport.city}` : 'Unknown Airport';
    return true
}

export function getCityCountryByIATA(iataCode) {
    const airport = existingAirports.find(airport => airport.iata_code === iataCode);
    return airport ? `${airport.city}, ${airport.country}` : 'Unknown city';
}


export function calculateTotalDuration(segments) {
    let totalMinutes = 0;

    console.log(segments,'from utils')

    segments.forEach((segment) => {
        const durationMatch = segment.duration.match(/PT(\d+)H(\d+)M/);
        if (durationMatch) {
            const hours = parseInt(durationMatch[1]);
            const minutes = parseInt(durationMatch[2]);
            totalMinutes += hours * 60 + minutes;
        }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}


export function calculateDurationSimple(duration) {
    let totalMinutes = 0;
    const durationMatch = duration.match(/PT(\d+)H(\d+)M/);
    if (durationMatch) {
        const hours = parseInt(durationMatch[1]);
        const minutes = parseInt(durationMatch[2]);
        totalMinutes += hours * 60 + minutes;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format hours and minutes to always have two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}h ${formattedMinutes}m`;
}

export function calculateTotalDurationShortNew(segments) {
    let totalMinutes = 0;

    segments.forEach((segment) => {
        const durationMatch = segment.duration.match(/PT(\d+)H(\d+)M/);
        if (durationMatch) {
            const hours = parseInt(durationMatch[1]);
            const minutes = parseInt(durationMatch[2]);
            totalMinutes += hours * 60 + minutes;
        }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format hours and minutes to always have two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}h ${formattedMinutes}m`;
}


export function calculateTotalDurationShort(segments) {
    let totalMinutes = 0;

    segments.forEach((segment) => {
        const durationMatch = segment.duration.match(/PT(\d+)H(\d+)M/);
        if (durationMatch) {
            const hours = parseInt(durationMatch[1]);
            const minutes = parseInt(durationMatch[2]);
            totalMinutes += hours * 60 + minutes;
        }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${hours !== 1 ? '' : ''} ${minutes}m${minutes !== 1 ? '' : ''}`;
}


export const getFlightNames = (offer) => {
    return offer.itineraries.map((itinerary) => {
        // Map over the segments in each itinerary to get the carrierCode and flight number
        return itinerary.segments.map((segment) => {
            return `${segment.carrierCode} ${segment.number}`;
        });
    }).flat(); // Flatten the array to get a single list of flight names
};
