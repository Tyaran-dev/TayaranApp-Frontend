import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import actGetHotels from "./act/actGetHotels";
import actGetHotelDetails from "./act/actGetHotelDetails";
import actBookingHotel from "./act/actBookingHotel";
import { Room } from "@/app/components/website/hotel-details/RoomChoices";
// types/hotel.ts
export interface Hotel {
  HotelCode: string;
  HotelName: string;
  Description: string;
  HotelFacilities: string[];
  Images?: string[];
  Address: string;
  PinCode: string;
  CityId: string;
  CountryName: string;
  PhoneNumber: string;
  FaxNumber: string;
  Map: string;
  HotelRating: number;
  CityName: string;
  CountryCode: string;
  CheckInTime: string;
  CheckOutTime: string;
}

export interface HotelProps {
  hotel: Hotel;
}

export interface ImageGalleryProps {
  images: string[];
}

export interface HotelFacilitiesProps {
  facilities: string[];
}

export interface HotelInterface {
  HotelCode: string;
  HotelName: string;
  Description: string;
  HotelFacilities: string[];
  Attractions?: Record<string, string>;
  Images?: string[];
  Address: string;
  PinCode: string;
  CityId: string;
  CountryName: string;
  PhoneNumber: string;
  FaxNumber: string;
  Map: string; // You can split into latitude & longitude if needed
  HotelRating: number;
  CityName: string;
  CountryCode: string;
  CheckInTime: string;
  CheckOutTime: string;
}

export interface HotelSearchData {
  CityCode: string;
  CheckIn: string; // Format: YYYY-MM-DD
  CheckOut: string; // Format: YYYY-MM-DD
  HotelCodes: string[]; // Array of hotel codes
  GuestNationality: string; // ISO country code (e.g., "US")
  PreferredCurrencyCode: string; // Currency code (e.g., "SAR")
  PaxRooms: PaxRoom[];
  ResponseTime: number; // e.g., 23.0
  IsDetailedResponse: boolean;
  Filters: SearchFilters;
  page?: string | number;
  Language: string;
}

export interface PaxRoom {
  Adults: number;
  Children: number;
  ChildrenAges: number[]; // Ages of each child (if any)
}

export interface SearchFilters {
  Refundable: boolean;
  NoOfRooms: "All" | string; // can also be a number if filtered
  MealType:
    | "All"
    | "Breakfast"
    | "HalfBoard"
    | "FullBoard"
    | "RoomOnly"
    | string;
}

interface HotelDataState {
  hotels: HotelInterface[]; // This is where the flight data will be stored
  hotel: HotelInterface | null; // This is where the single hotel data will be stored
  selectedRoom: Room | {};
  slectedHotel: HotelInterface[] | null;
  searchParamsData: HotelSearchData | null;
  loading: "pending" | "succeeded" | "failed" | null;
  error: string | null;
}

const initialState: HotelDataState = {
  hotels: [],
  hotel: null,
  selectedRoom: {},
  slectedHotel: null,
  searchParamsData: null,
  loading: null,
  error: null,
};

export const hotelDataSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    clearHotels: (state) => {
      state.hotels = [];
      state.loading = null;
      state.error = null;
    },
    setHotelSearchData: (state, action: PayloadAction<any>) => {
      state.searchParamsData = action.payload;
    },
    setHotels: (state, action: PayloadAction<any[]>) => {
      state.hotels = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<any>) => {
      state.selectedRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetHotels.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetHotels.fulfilled, (state, action) => {
      state.loading = "succeeded";
      // Assuming the API returns flight data in action.payload
      state.hotels = action.payload; // Update state with fetched flight data
    });
    builder.addCase(actGetHotels.rejected, (state, action) => {
      state.loading = "failed";
      if (typeof action.payload === "string") {
        state.error = action.payload;
      } else {
        state.error = "Unknown error occurred";
      }
    });

    builder.addCase(actGetHotelDetails.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetHotelDetails.fulfilled, (state, action) => {
      state.loading = "succeeded";
      // Assuming the API returns flight data in action.payload
      state.hotel = action.payload; // Update state with fetched flight data
    });
    builder.addCase(actGetHotelDetails.rejected, (state, action) => {
      state.loading = "failed";
      if (typeof action.payload === "string") {
        state.error = action.payload;
      } else {
        state.error = "Unknown error occurred";
      }
    });

    builder.addCase(actBookingHotel.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actBookingHotel.fulfilled, (state, action) => {
      state.loading = "succeeded";
      // Assuming the API returns flight data in action.payload
      // state.hotel = action.payload; // Update state with fetched flight data
    });
    builder.addCase(actBookingHotel.rejected, (state, action) => {
      state.loading = "failed";
      if (typeof action.payload === "string") {
        state.error = action.payload;
      } else {
        state.error = "Unknown error occurred";
      }
    });
  },
});

export const { clearHotels, setHotelSearchData, setHotels, setSelectedRoom } =
  hotelDataSlice.actions;
export default hotelDataSlice.reducer;
