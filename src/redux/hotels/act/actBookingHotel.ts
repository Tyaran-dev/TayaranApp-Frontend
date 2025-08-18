import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@/utils/axiosErrorHandler";

const actBookingHotel = createAsyncThunk(
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
      return response.data;
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data || { error: error.message };
      return rejectWithValue(axiosErrorHandler(message));
    }
  }
);
export default actBookingHotel;
