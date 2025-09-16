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
  BookingCode: string; // or whatever fields you already have
  BookingReferenceId: string; // 👈 add this
  CustomerDetails: CustomerDetail[];
  ClientReferenceId: string;
  TotalFare: number;
  EmailId: string;
  PhoneNumber: string;
  BookingType: string;
  PaymentMode: string;
  // add other fields expected by your API here
};

export type BookingResponse = {
  // shape of the response from API
  success: boolean;
  bookingId: string;
  message?: string;
  BookingReferenceId: string; // now guaranteed to exist

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

      return {
        ...response.data,                          // everything from API
        BookingReferenceId: bookingData.BookingReferenceId // add your own field
      } as BookingResponse;

    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data || { error: error.message };
      return rejectWithValue(axiosErrorHandler(message));
    }
  }
);

export default actBookingHotel;
