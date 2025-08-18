// Remove 'use client' - email templates should be server-rendered
import { format, parseISO } from 'date-fns';

// Replace React icons with inline SVGs
const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4l-8 6.315v1.895l8-2.526V18l-2 2v2l3.5-1 3.5 1v-2l-2-2v-4.316l8 2.526z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
  </svg>
);

// Helper functions remain the same
const getCityName = (iataCode: string) => {
  const cityNames: Record<string, string> = {
    CAI: "Cairo",
    JED: "Jeddah",
    MED: "Medina"
  };
  return cityNames[iataCode] || iataCode;
};

const getAirportName = (iataCode: string) => {
  const airportNames: Record<string, string> = {
    CAI: "Cairo International Airport",
    JED: "King Abdul Aziz Airport",
    MED: "Prince Mohammad Bin Abdulaziz Airport"
  };
  return airportNames[iataCode] || `${iataCode} Airport`;
};

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes}m`;
  }
  return duration;
};

const formatFlightNumber = (carrierCode: string, number: string) => {
  return `${carrierCode}${number}`;
};

export default function FlightEmailTemplate() {
  const bookingRef = flightData.order.data.associatedRecords[0].reference;
  const flightOffer = flightData.order.data.flightOffers[0];
  const travelers = flightData.order.data.travelers;
  const contact = flightData.order.data.contacts.find(c => c.purpose === "STANDARD");

  const primaryTraveler = travelers[0];
  const travelerName = `${primaryTraveler.name.firstName} ${primaryTraveler.name.lastName}`;

  const outboundItinerary = flightOffer.itineraries[0];
  const returnItinerary = flightOffer.itineraries[1];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
                <span style={{ color: '#1d1068' }}>Tayy</span>
                <span style={{ color: '#006838' }}>ran</span>
                <span style={{ color: '#4b5563', fontSize: '0.875rem' }}>.com</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
              <PhoneIcon />
              <span style={{ fontSize: '0.875rem' }}>Support: 920025959</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '2rem' }}>
          {/* Greeting Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Hello {travelerName},
                </h2>
                <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>Thank you for Choosing Flyin.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                  Flyin Trip ID: <span style={{ fontWeight: '600' }}>1101240547336</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  Booking Date: {format(parseISO(flightData.order.data.associatedRecords[0].creationDate), 'EEE, dd MMM yyyy')}
                </p>
              </div>
            </div>

            {/* Confirmation Message */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', marginBottom: '1rem' }}>
              <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '9999px', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '0.75rem', height: '0.75rem', color: '#059669' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span style={{ fontWeight: '500' }}>Your {getCityName("CAI")} - {getCityName("MED")} Round trip has been Confirmed</span>
            </div>

            <p style={{ color: '#374151' }}>
              Your e-ticket is attached along with this email. You have paid <span style={{ fontWeight: '600' }}>{flightOffer.price.currency} {flightOffer.price.total}</span>
            </p>
          </div>

          {/* Flight Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Outbound Journey */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937' }}>
                    Departure: {getCityName(outboundItinerary.segments[0].departure.iataCode)} - {getCityName(outboundItinerary.segments[outboundItinerary.segments.length - 1].arrival.iataCode)} ({format(parseISO(outboundItinerary.segments[0].departure.at), 'dd MMM yyyy')})
                  </h3>
                  <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>PNR No: {bookingRef}</span>
                </div>
              </div>

              {outboundItinerary.segments.map((segment, index) => (
                <div key={segment.id}>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ color: '#2563eb' }}>
                          <PlaneIcon />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Saudi Arabian Airlines</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formatFlightNumber(segment.carrierCode, segment.number)}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '2rem' }}>
                      {/* Departure */}
                      <div>
                        <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                          {format(parseISO(segment.departure.at), 'HH:mm')}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                          <p style={{ fontWeight: '500' }}>{getCityName(segment.departure.iataCode)}</p>
                          <p>{getAirportName(segment.departure.iataCode)}({segment.departure.iataCode})</p>
                          {segment.departure.terminal && <p>Terminal {segment.departure.terminal}</p>}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div>
                        <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                          {format(parseISO(segment.arrival.at), 'HH:mm')}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                          <p style={{ fontWeight: '500' }}>{getCityName(segment.arrival.iataCode)}</p>
                          <p>{getAirportName(segment.arrival.iataCode)}({segment.arrival.iataCode})</p>
                          {segment.arrival.terminal && <p>Terminal {segment.arrival.terminal}</p>}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                        <span>Baggage Info: 0 Pieces + 1 Checked Bag (Per Person)</span>
                      </div>
                    </div>
                  </div>

                  {/* Layover Info */}
                  {index < outboundItinerary.segments.length - 1 && (
                    <div style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4b5563' }}>
                        <ClockIcon />
                        <span style={{ fontSize: '0.875rem' }}>Layover: 1hr 45mins, {getCityName(segment.arrival.iataCode)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Return Journey */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937' }}>
                    {getCityName(returnItinerary.segments[0].departure.iataCode)} - {getCityName(returnItinerary.segments[0].arrival.iataCode)} ({format(parseISO(returnItinerary.segments[0].departure.at), 'dd MMM yyyy')})
                  </h3>
                  <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>PNR No:</span>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: '#2563eb' }}>
                      <PlaneIcon />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Saudi Arabian Airlines</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formatFlightNumber(returnItinerary.segments[0].carrierCode, returnItinerary.segments[0].number)}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {format(parseISO(returnItinerary.segments[0].departure.at), 'HH:mm')}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      <p style={{ fontWeight: '500' }}>{getCityName(returnItinerary.segments[0].departure.iataCode)}</p>
                      <p>{getAirportName(returnItinerary.segments[0].departure.iataCode)}({returnItinerary.segments[0].departure.iataCode})</p>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {format(parseISO(returnItinerary.segments[0].arrival.at), 'HH:mm')}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      <p style={{ fontWeight: '500' }}>{getCityName(returnItinerary.segments[0].arrival.iataCode)}</p>
                      <p>{getAirportName(returnItinerary.segments[0].arrival.iataCode)}({returnItinerary.segments[0].arrival.iataCode})</p>
                      {returnItinerary.segments[0].arrival.terminal && <p>Terminal {returnItinerary.segments[0].arrival.terminal}</p>}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                    <span>Baggage Info: 0 Pieces + 1 Checked Bag (Per Person)</span>
                    <span>Economy | Trip Duration - {formatDuration(returnItinerary.segments[0].duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '9999px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem' }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>!</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                <p style={{ fontWeight: '500' }}>Note:</p>
                <p>Airlines stop accepting cancellation/change requested 4-72 hours before departure of the flight. Please read airline terms before the purchase.</p>
                <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }}>Rules for cancellation and changes</a>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2563eb', marginBottom: '1rem' }}>Passenger information</h3>

            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                <div>Name</div>
                <div>PAX Type</div>
                <div>Ticket Number</div>
              </div>

              {travelers.map((traveler, index) => (
                <div key={traveler.id} style={{ padding: '1rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', fontSize: '0.875rem', borderBottom: '1px solid #f3f4f6', lastChild: { borderBottom: 'none' } }}>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {traveler.name.firstName} {traveler.name.lastName}
                  </div>
                  <div style={{ color: '#4b5563' }}>Adult</div>
                  <div style={{ color: '#4b5563' }}>065-3705552{67 + index}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href="#"
              style={{ display: 'inline-flex', alignItems: 'center', color: '#2563eb', fontSize: '0.875rem', fontWeight: '500' }}
            >
              <span style={{ marginRight: '0.5rem' }}>📋</span>
              Manage Bookings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FlightData {
  message: string;
  order: {
    data: {
      type: string;
      id: string;
      associatedRecords: Array<{
        reference: string;
        creationDate: string;
        originSystemCode: string;
        flightOfferId: string;
      }>;
      flightOffers: Array<{
        type: string;
        id: string;
        source: string;
        lastTicketingDate: string;
        itineraries: Array<{
          segments: Array<{
            departure: {
              iataCode: string;
              terminal?: string;
              at: string;
            };
            arrival: {
              iataCode: string;
              terminal?: string;
              at: string;
            };
            carrierCode: string;
            number: string;
            aircraft: {
              code: string;
            };
            duration: string;
            id: string;
            numberOfStops: number;
          }>;
        }>;
        price: {
          currency: string;
          total: string;
          base: string;
          grandTotal: string;
          billingCurrency: string;
        };
        travelerPricings: Array<{
          travelerId: string;
          fareOption: string;
          travelerType: string;
          price: {
            currency: string;
            total: string;
            base: string;
          };
        }>;
      }>;
      travelers: Array<{
        id: string;
        dateOfBirth: string;
        gender: string;
        name: {
          firstName: string;
          lastName: string;
        };
        documents: Array<{
          number: string;
          expiryDate: string;
          issuanceCountry: string;
          nationality: string;
          documentType: string;
          holder: boolean;
        }>;
        contact: {
          purpose: string;
          phones: Array<{
            deviceType: string;
            countryCallingCode: string;
            number: string;
          }>;
          emailAddress: string;
        };
      }>;
      contacts: Array<{
        addresseeName: {
          firstName: string;
        };
        address: {
          lines: string[];
          countryCode: string;
          cityName: string;
          stateName: string;
        };
        purpose: string;
        phones?: Array<{
          deviceType: string;
          countryCallingCode: string;
          number: string;
        }>;
        emailAddress?: string;
      }>;
    };
    dictionaries: {
      locations: {
        [key: string]: {
          cityCode: string;
          countryCode: string;
        };
      };
    };
  };
}

const flightData: FlightData = {
  message: "Flight order created successfully",
  order: {
    data: {
      type: "flight-order",
      id: "eJzTd9e3DAt0NQoAAAr8Ak0%3D",
      associatedRecords: [
        {
          reference: "9VQE2P",
          creationDate: "2025-08-16T10:24:00.000",
          originSystemCode: "GDS",
          flightOfferId: "1"
        },
        {
          reference: "9VQE2P",
          creationDate: "2025-08-16T10:24:00.000",
          originSystemCode: "SV",
          flightOfferId: "1"
        }
      ],
      flightOffers: [
        {
          type: "flight-offer",
          id: "1",
          source: "GDS",
          lastTicketingDate: "2025-09-28",
          itineraries: [
            {
              segments: [
                {
                  departure: {
                    iataCode: "CAI",
                    terminal: "2",
                    at: "2025-09-28T04:20:00"
                  },
                  arrival: {
                    iataCode: "JED",
                    terminal: "1",
                    at: "2025-09-28T06:35:00"
                  },
                  carrierCode: "SV",
                  number: "308",
                  aircraft: {
                    code: "330"
                  },
                  duration: "PT2H15M",
                  id: "6",
                  numberOfStops: 0
                },
                {
                  departure: {
                    iataCode: "JED",
                    terminal: "1",
                    at: "2025-09-28T08:20:00"
                  },
                  arrival: {
                    iataCode: "MED",
                    at: "2025-09-28T09:25:00"
                  },
                  carrierCode: "SV",
                  number: "1424",
                  aircraft: {
                    code: "320"
                  },
                  duration: "PT1H5M",
                  id: "7",
                  numberOfStops: 0
                }
              ]
            },
            {
              segments: [
                {
                  departure: {
                    iataCode: "MED",
                    at: "2025-09-30T02:50:00"
                  },
                  arrival: {
                    iataCode: "CAI",
                    terminal: "2",
                    at: "2025-09-30T04:45:00"
                  },
                  carrierCode: "SV",
                  number: "391",
                  aircraft: {
                    code: "321"
                  },
                  duration: "PT1H55M",
                  id: "112",
                  numberOfStops: 0
                }
              ]
            }
          ],
          price: {
            currency: "SAR",
            total: "1490.78",
            base: "436.00",
            grandTotal: "1490.78",
            billingCurrency: "SAR"
          },
          travelerPricings: [
            {
              travelerId: "1",
              fareOption: "STANDARD",
              travelerType: "ADULT",
              price: {
                currency: "SAR",
                total: "745.39",
                base: "218.00"
              }
            },
            {
              travelerId: "2",
              fareOption: "STANDARD",
              travelerType: "ADULT",
              price: {
                currency: "SAR",
                total: "745.39",
                base: "218.00"
              }
            }
          ]
        }
      ],
      travelers: [
        {
          id: "1",
          dateOfBirth: "1982-01-16",
          gender: "MALE",
          name: {
            firstName: "JOHN",
            lastName: "DOE"
          },
          documents: [
            {
              number: "123456789",
              expiryDate: "2030-12-31",
              issuanceCountry: "US",
              nationality: "US",
              documentType: "PASSPORT",
              holder: true
            }
          ],
          contact: {
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "1",
                number: "5551234567"
              }
            ],
            emailAddress: "john.doe1@example.com"
          }
        },
        {
          id: "2",
          dateOfBirth: "1982-01-16",
          gender: "MALE",
          name: {
            firstName: "mohamed",
            lastName: "DOE"
          },
          documents: [
            {
              number: "123456789",
              expiryDate: "2030-12-31",
              issuanceCountry: "US",
              nationality: "US",
              documentType: "PASSPORT",
              holder: true
            }
          ],
          contact: {
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "1",
                number: "5551234567"
              }
            ],
            emailAddress: "john.doe2@example.com"
          }
        }
      ],
      contacts: [
        {
          addresseeName: {
            firstName: "QESSA TRAVEL & TOURISM"
          },
          address: {
            lines: [
              "ANAS IBN MALEK ST",
              "ALMALQA"
            ],
            countryCode: "SA",
            cityName: "Riyadh",
            stateName: "Saudi Arabia"
          },
          purpose: "INVOICE"
        },
        {
          addresseeName: {
            firstName: "QESSA TRAVEL & TOURISM"
          },
          address: {
            lines: [
              "ANAS IBN MALEK ST",
              "ALMALQA"
            ],
            countryCode: "SA",
            cityName: "Riyadh",
            stateName: "Saudi Arabia"
          },
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "LANDLINE",
              countryCallingCode: "00966",
              number: "533322921"
            }
          ],
          emailAddress: "info@movejeje.com"
        }
      ]
    },
    dictionaries: {
      locations: {
        JED: {
          cityCode: "JED",
          countryCode: "SA"
        },
        CAI: {
          cityCode: "CAI",
          countryCode: "EG"
        },
        MED: {
          cityCode: "MED",
          countryCode: "SA"
        }
      }
    }
  }
};