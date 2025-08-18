import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { getAmadeusToken } from "../../../utils/amadeus-token";
import axiosErrorHandler from "@/utils/axiosErrorHandler";

// Define the types for flight search data
interface FlightSearchData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelers: number;
  page?: string;
  pageSize?: string;
  flightClass?: string;
}

// Define the expected shape of the API response
interface FlightData {
    origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelers: number;
  page?: string;
  pageSize?: string;
  flightClass?: string;
  }

interface Carriers {
  [key: string]: string; // Assuming carriers is a dictionary where key is carrier code
}

interface Meta {
  count: number;
}

interface FlightApiResponse {
    data: FlightData[];
    dictionaries: {
      carriers: Carriers;
    };
    meta: Meta;
  }

// Define the type of the result that will be returned
interface FlightsResult {
  flights: FlightData[];
  carriers: Carriers;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Define the thunk for getting flights
const actGetFlights = createAsyncThunk<FlightsResult, FlightSearchData, { rejectValue: string }>(
  "flights/actGetFlights",
  async (flightSearchData, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const page = flightSearchData.page || "1"; // Default to page 1
    const pageSize = flightSearchData.pageSize || "10"; // Default page size
  
    try {
      // const accessToken = await getAmadeusToken();
      const apiUrl = "https://test.api.amadeus.com/v2/shopping/flight-offers";

      // Helper function to format dates
      const formatDate = (date: string | Date): string => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Calculate offset based on page and pageSize
      const offset = (parseInt(page) - 1) * parseInt(pageSize);

      // Define params object with required fields
      const params: {
        originLocationCode: string;
        destinationLocationCode: string;
        departureDate: string;
        adults: number;
        currencyCode: string;
        max: string;
        returnDate?: string; // Make returnDate optional
        travelClass?: string; // Make travelClass optional
      } = {
        originLocationCode: flightSearchData.origin,
        destinationLocationCode: flightSearchData.destination,
        departureDate: formatDate(flightSearchData.departureDate),
        adults: flightSearchData.travelers,
        currencyCode: "SAR",
        max: pageSize, // Number of results per page
      };

      // Add returnDate if roundtrip
      if (flightSearchData.returnDate) {
        params.returnDate = formatDate(flightSearchData.returnDate);
      }

      // Add travel class if specified
      if (flightSearchData.flightClass) {
        params.travelClass = flightSearchData.flightClass.toUpperCase();
      }

      // Make the API call
      const response: AxiosResponse<FlightApiResponse> = await axios.get(apiUrl, {
        params,
        headers: {
          // Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      const flightData = response.data.data;
      const carriers = response.data.dictionaries.carriers;
      const meta = response.data.meta || {};

      // Calculate pagination info
      const totalResults = meta.count || flightData.length;
      const totalPages = Math.ceil(totalResults / parseInt(pageSize));

      // Combine flight data with carriers and pagination info
      const result: FlightsResult = {
        flights: flightData,
        carriers: carriers,
        pagination: {
          currentPage: parseInt(page),
          pageSize: parseInt(pageSize),
          totalResults,
          totalPages,
          hasNextPage: parseInt(page) < totalPages,
          hasPreviousPage: parseInt(page) > 1,
        },
      };

      return result;
    } catch (error: any) {
      console.error("Error fetching flights:", error);

      const statusCode = error.response?.status || 500;
      const message = error.response?.data || { error: error.message };
      return rejectWithValue(axiosErrorHandler(message));
    }
  }
);

export default actGetFlights;
