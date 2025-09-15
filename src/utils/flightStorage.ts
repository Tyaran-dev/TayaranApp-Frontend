export const getPersistedFlightData = () => {
  try {
    const savedData = localStorage.getItem('persist:root');
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData);
    if (!parsedData.flightData) return null;

    const flightData = JSON.parse(parsedData.flightData); // ✅ second parse here

    // Convert string dates back to Date objects
    if (flightData.searchParamsData) {
      return {
        ...flightData,
        searchParamsData: {
          ...flightData.searchParamsData,
          departure: new Date(flightData.searchParamsData.departure),
          returnDate: flightData.searchParamsData.returnDate
            ? new Date(flightData.searchParamsData.returnDate)
            : null,
          segments:
            flightData.searchParamsData.segments?.map((segment: any) => ({
              ...segment,
              date: new Date(segment.date),
            })) || [],
        },
      };
    }

    return flightData;
  } catch (error) {
    console.error('Error parsing flight data from localStorage:', error);
    return null;
  }
};
