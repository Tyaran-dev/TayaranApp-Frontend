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
  MinHotelPrice: number;
  CityName: string;
  CountryCode: string;
  CheckInTime: string;
  CheckOutTime: string;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface HotelsApiResponse {
  success: boolean;
  data: Hotel[];
  pagination: Pagination;
}

export interface HotelDetailsResponse {
  success: boolean;
  data: {
    hotel: Hotel[];
    availableRooms: Room[];
    presentageCommission: number
  };
}

export interface HotelSearchData {
  Language: string;
  page: number;
  CityCode?: string | undefined;
  CheckIn?: string | undefined;
  CheckOut?: string | undefined;
  HotelCodes?: string[] | undefined;
  GuestNationality?: string | undefined;
  PreferredCurrencyCode?: string | undefined;
  PaxRooms?: PaxRoom[] | undefined;
  ResponseTime?: number | undefined;
  IsDetailedResponse?: boolean | undefined;
  Filters?: SearchFilters | undefined;
}

export interface PaxRoom {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
}

export interface SearchFilters {
  Refundable: boolean;
  NoOfRooms: "All" | string;
  MealType: "All" | "Breakfast" | "HalfBoard" | "FullBoard" | "RoomOnly" | string;
}

interface HotelDataState {
  hotels: HotelsApiResponse | null;
  hotel: HotelDetailsResponse | null;
  selectedRoom: Room | null;
  selectedHotel: Hotel | null;
  searchParamsData: HotelSearchData | null;
  loading: "pending" | "succeeded" | "failed" | null;
  error: string | null;
}

const initialState: HotelDataState = {
  hotels: null,
  hotel: null,
  selectedRoom: null,
  selectedHotel: null,
  searchParamsData: null,
  loading: null,
  error: null,
};

export const hotelDataSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    clearHotels: (state) => {
      state.hotels = null;
      state.loading = null;
      state.error = null;
    },
    setHotelSearchData: (state, action: PayloadAction<HotelSearchData>) => {
      state.searchParamsData = action.payload;
    },
    setHotels: (state, action: PayloadAction<HotelsApiResponse>) => {
      state.hotels = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<Room>) => {
      state.selectedRoom = action.payload;
    },
    setSelectedHotel: (state, action: PayloadAction<Hotel>) => {
      state.selectedHotel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetHotels.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetHotels.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.hotels = action.payload; // Store the entire API response
    });
    builder.addCase(actGetHotels.rejected, (state, action) => {
      state.loading = "failed";
      state.error = typeof action.payload === "string" ? action.payload : "Unknown error occurred";
    });

    builder.addCase(actGetHotelDetails.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetHotelDetails.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.hotel = action.payload;
    });
    builder.addCase(actGetHotelDetails.rejected, (state, action) => {
      state.loading = "failed";
      state.error = typeof action.payload === "string" ? action.payload : "Unknown error occurred";
    });

    builder.addCase(actBookingHotel.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actBookingHotel.fulfilled, (state) => {
      state.loading = "succeeded";
    });
    builder.addCase(actBookingHotel.rejected, (state, action) => {
      state.loading = "failed";
      state.error = typeof action.payload === "string" ? action.payload : "Unknown error occurred";
    });
  },
});

export const {
  clearHotels,
  setHotelSearchData,
  setHotels,
  setSelectedRoom,
  setSelectedHotel
} = hotelDataSlice.actions;

export default hotelDataSlice.reducer;