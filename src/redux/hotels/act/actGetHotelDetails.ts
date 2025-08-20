import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosErrorHandler from "@/utils/axiosErrorHandler";

interface HotelData {
  HotelCodes: string | string[];
  searchParamsData: Record<string, any> | null; // ✅ allow null
  Language?: string;
}

const actGetHotelDetails = createAsyncThunk(
  "hotels/actGetHotelDetails",
  async (hotelData: HotelData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    const { HotelCodes, searchParamsData, Language } = hotelData;

    try {
      const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

      // Perform your request here
      const response = await axios.post(`${BaseUrl}/hotels/HotelDetails`, {
        HotelCodes,
        ...searchParamsData,
        Language,
      });

      return response.data;
    } catch (error: any) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data || { error: error.message };
      return rejectWithValue(axiosErrorHandler(message));
    }
  }
);

export default actGetHotelDetails;
