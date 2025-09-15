import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@/utils/axiosErrorHandler";

// -------- Types --------
type CustomerName = {
  Type: "Adult" | "Child";
  FirstName: string;
  LastName: string;
};

type CustomerDetail = {
  RoomIndex: number;
  CustomerNames: CustomerName[];
};

export type BookingData = {
  CustomerDetails: CustomerDetail[];
  // add more fields as required by API
};

export type BookingResponse = {
  // shape of the response from API
  success: boolean;
  bookingId: string;
  message?: string;
};

// -------- Thunk --------
const actBookingHotel = createAsyncThunk<
  BookingResponse, // return type of fulfilled action
  BookingData,     // argument type (payload)
  { rejectValue: any }
>(
  "hotels/actBookingHotel",
  async (bookingData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

      console.log(bookingData, "here is payload");

      const response = await axios.post(
        `${BaseUrl}/hotels/BookRoom`,
        bookingData
      );

      return response.data as BookingResponse;
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data || { error: error.message };
      return rejectWithValue(axiosErrorHandler(message));
    }
  }
);

export default actBookingHotel;
