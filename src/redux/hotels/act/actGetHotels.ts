import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@/utils/axiosErrorHandler";
import { HotelSearchData } from "../hotelsSlice";

const actGetHotels = createAsyncThunk(
  "hotels/actGetHotels",
  async (hotelSearchData: HotelSearchData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

      // Perform your request here
      const response = await axios.post(`${BaseUrl}/hotels/HotelsSearch`, {
        ...hotelSearchData,
      });

      return response.data;
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data || { error: error.message };
      console.log(error, "the error");
      return rejectWithValue(axiosErrorHandler(message));
    }
  }
);

export default actGetHotels;
