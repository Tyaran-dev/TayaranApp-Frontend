import { useCallback } from "react";
import { useAppDispatch } from "@/redux/hooks";
import actBookingHotel from "@/redux/hotels/act/actBookingHotel";
import { CustomerDetail } from "@/app/[locale]/(root)/book-hotel/page";

// -------------------
// Types
// -------------------
type CustomerName = {
  Type: "Adult" | "Child";
  FirstName: string;
  LastName: string;
};



type BookingData = {
  CustomerDetails: CustomerDetail[];
  // add other fields expected by your API here
};

type PaxRoom = {
  Adults: number;
  Children: number;
};

type SearchParamsData = {
  PaxRooms?: PaxRoom[];
};

type UseBookingHandlerReturn = () => Promise<any>; // adjust payload type if you know it

// -------------------
// Hook
// -------------------
const useBookingHandler = (
  formatGuestDataForAPI: () => BookingData,
  isValidForm: boolean,
  searchParamsData: SearchParamsData
): UseBookingHandlerReturn => {
  const dispatch = useAppDispatch();

  const handleSubmitBooking = useCallback(async () => {
    // Validate guest count matches search params
    const expectedAdults = searchParamsData?.PaxRooms?.reduce(
      (sum, room) => sum + (room.Adults || 0),
      0
    ) ?? 0;

    const expectedChildren = searchParamsData?.PaxRooms?.reduce(
      (sum, room) => sum + (room.Children || 0),
      0
    ) ?? 0;

    const bookingData = formatGuestDataForAPI();

    const submittedAdults = bookingData.CustomerDetails.reduce(
      (sum, room) =>
        sum +
        room.CustomerNames.filter((name) => name.Type === "Adult").length,
      0
    );

    const submittedChildren = bookingData.CustomerDetails.reduce(
      (sum, room) =>
        sum +
        room.CustomerNames.filter((name) => name.Type === "Child").length,
      0
    );

    if (
      submittedAdults < expectedAdults ||
      submittedChildren < expectedChildren
    ) {
      throw new Error(
        `Please enter information for all guests. 
        Expected: ${expectedAdults} adults and ${expectedChildren} children. 
        Provided: ${submittedAdults} adults and ${submittedChildren} children.`
      );
    }

    if (!isValidForm) {
      throw new Error("Please fill all required fields correctly");
    }

    try {
      const resultAction = await dispatch(actBookingHotel(bookingData));

      if (actBookingHotel.fulfilled.match(resultAction)) {
        console.log("Booking successful:", resultAction.payload);
        return resultAction.payload;
      } else {
        throw resultAction.error;
      }
    } catch (error) {
      console.error("Booking failed:", error);
      throw error;
    }
  }, [dispatch, formatGuestDataForAPI, isValidForm, searchParamsData]);

  return handleSubmitBooking;
};

export default useBookingHandler;
