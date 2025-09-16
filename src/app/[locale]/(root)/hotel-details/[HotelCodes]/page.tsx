"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import actGetHotelDetails from "@/redux/hotels/act/actGetHotelDetails";
import Section from "@/app/components/shared/section";
import { useParams } from "next/navigation";
import HotelDetails from "@/app/components/website/hotel-details";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import CustomProgressBar from "@/app/components/shared/progress-bar";
import HotelDetailsSkeleton from "@/app/components/shared/Feedback/HotelDetailsSkeleton";
import { Hotel } from "@/redux/hotels/hotelsSlice";
import AttractionsSection from "@/app/components/website/hotel-details/AttractionsSection";
const defaultHotel: Hotel = {
  HotelCode: "",
  HotelName: "",
  Description: "",
  HotelFacilities: [],
  Images: [],
  Address: "",
  PinCode: "",
  CityId: "",
  CountryName: "",
  MinHotelPrice: 0,
  PhoneNumber: "",
  FaxNumber: "",
  Map: "",
  HotelRating: 0,
  CityName: "",
  CountryCode: "",
  CheckInTime: "",
  CheckOutTime: ""
};



export default function HotelPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations(); // Use translations

  const dispatch = useAppDispatch();
  const HotelCodes = params.HotelCodes;

  const { hotel, searchParamsData, loading, error } = useAppSelector(
    (state) => state.hotelData
  );

  const hotelData: Hotel | undefined = hotel?.data?.hotel?.[0];
  const availableRooms = hotel?.data?.availableRooms ?? [];


  useEffect(() => {
    if (HotelCodes && locale) {
      dispatch(
        actGetHotelDetails({ HotelCodes, searchParamsData, Language: locale })
      );
    }
  }, [HotelCodes, locale, searchParamsData, dispatch]);

  if (!HotelCodes) {
    return (
      <p className="text-center text-gray-500">
        {t("hotel.invalidHotelCode", { default: "Invalid Hotel Code." })}
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        {t("hotel.error")}: {error}
      </p>
    );
  }

  return (
    <Section className="py-10">
      <div className="hidden md:block">


        <Stepper currentStep={currentStep} stepsType="hotelSteps" />
      </div>
      {loading === "pending" && (
        <>
          <CustomProgressBar />
          <HotelDetailsSkeleton />
        </>
      )}

      {loading === "succeeded" && (
        <HotelDetails
          hotel={hotelData ?? defaultHotel}
          availableRooms={availableRooms}
        />
      )}
    </Section>
  );
}
