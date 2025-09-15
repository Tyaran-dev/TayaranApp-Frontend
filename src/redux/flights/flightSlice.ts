import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actGetFlights from './act/actGetFlights';

// Step 1: Define the type for flight data
export interface Flight {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelers: number;
  page?: string;
  pageSize?: string;
  class?: string;
}

interface FlightSegment {
  id: string | null;
  origin: string | null;
  destination: string | null;
  date: Date | null;
}

export interface FlightFormData {
  origin: string;
  destination: string;
  departure: Date | null;
  returnDate: Date | null;
  travelers: { adults: number; children: number; infants: number; };
  flightClass: string;
  flightType: string;
  segments?: FlightSegment[];
}

export type TripType = 'oneway' | 'roundtrip' | 'multiCities';

interface FlightDataState {
  flights: Flight[]; // This is where the flight data will be stored
  slectedFlight: Flight[] | null;
  searchParamsData: FlightFormData | null,
  tripType: string;
  loading: 'pending' | 'succeeded' | 'failed' | null;
  error: string | null;
  presentageCommission: number; // 🔹 add commission here

}

const initialState: FlightDataState = {
  flights: [],
  slectedFlight: null,
  searchParamsData: null,
  tripType: 'oneway',
  loading: null,
  error: null,
  presentageCommission: 0, // default
};

export const flightDataSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setCommission: (state, action: PayloadAction<number>) => {
      state.presentageCommission = action.payload;
    },
    setSearchData: (state, action: PayloadAction<FlightFormData>) => {
      state.searchParamsData = action.payload;
    },
    clearFlightSearch: (state) => {
      state.searchParamsData = null;
    },
    addFlightData: (state, action: PayloadAction<Flight>) => {
      state.flights.push(action.payload); // Push a single flight object to the array
    },
    // setFlightData: (state, action: PayloadAction<Flight[]>) => {
    //   state.flights = action.payload; // Replace the flight array with a new one
    // },
    selectFlight: (state, action: PayloadAction<Flight[]>) => {
      state.slectedFlight = action.payload;
    },
    removeFlightData: (state, action: PayloadAction<number>) => {
      state.flights.splice(action.payload, 1); // Remove the flight at the given index
    },
    clearFlightData: (state) => {
      state.flights = []; // Clear the flight data
    },
    changeTripType: (state, action: PayloadAction<TripType>) => {
      state.tripType = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(actGetFlights.pending, (state) => {
      state.loading = 'pending';
      state.error = null;
    });
    builder.addCase(actGetFlights.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      // Assuming the API returns flight data in action.payload
      state.flights = action.payload.flights; // Update state with fetched flight data
    });
    builder.addCase(actGetFlights.rejected, (state, action) => {
      state.loading = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload;
      } else {
        state.error = 'Unknown error occurred';
      }
    });
  },
});

export const { setCommission , addFlightData, selectFlight, clearFlightData, removeFlightData, changeTripType, setSearchData, clearFlightSearch } = flightDataSlice.actions;
export default flightDataSlice.reducer;
