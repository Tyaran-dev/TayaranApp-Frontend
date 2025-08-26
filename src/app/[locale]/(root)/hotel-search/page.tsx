"use client";

import { useEffect, useState, useMemo } from "react";
import actGetHotels from "@/redux/hotels/act/actGetHotels";
import { clearHotels } from "@/redux/hotels/hotelsSlice";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Section from "@/app/components/shared/section";
import { Hotel as HotelInterface } from "@/redux/hotels/hotelsSlice";
import Hotel from "@/app/components/website/hotel-search/Hotel";
import Pagination from "@/app/components/shared/Pagination";
import HotelSearch from "@/app/components/website/home/components/hotel-search-form";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import CustomProgressBar from "@/app/components/shared/progress-bar";
import HotelCardSkeleton from "@/app/components/shared/Feedback/HotelCardSkeleton";
import Heading from "@/app/components/shared/heading";
import Image from "next/image";
// Rename the type to avoid confusion with the Pagination component
type Paging = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type HotelsData = {
  hotels: HotelInterface[];
  pagination: Paging;
};

const DEFAULT_PAGING: Paging = {
  page: 1,
  perPage: 50,
  total: 0,
  totalPages: 0,
};

export default function Page() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const locale = useLocale();
  const t = useTranslations("hotelSearchPage");

  const { searchParamsData, hotels, loading } = useAppSelector(
    (state) => state.hotelData
  );

  const [currentPage, setCurrentPage] = useState(1);

  // Local, flattened state that the UI can rely on
  const [hotelsData, setHotelsData] = useState<HotelsData>({
    hotels: [],
    pagination: DEFAULT_PAGING,
  });

  const fullParams = useMemo(() => {
    if (!searchParamsData) return null;
    return {
      ...searchParamsData,
      Language: locale,
      page: currentPage,
    };
  }, [searchParamsData, currentPage, locale]);

  // Fetch on params change
  useEffect(() => {
    if (!fullParams?.CityCode || !fullParams?.CheckIn || !fullParams?.CheckOut) {
      return; // don't fire until params are ready
    }

    dispatch(clearHotels());
    dispatch(actGetHotels(fullParams));
  }, [fullParams, dispatch]);

  useEffect(() => {
    if (!hotels) return;

    console.log("🔥 RAW HOTELS FROM REDUX:", JSON.stringify(hotels, null, 2));
  }, [hotels]);

  useEffect(() => {
    if (!hotels) return;

    console.log("RAW HOTELS FROM REDUX:", JSON.stringify(hotels, null, 2));

    const h: any = hotels;
    const normalizedHotels: HotelInterface[] = Array.isArray(h)
      ? h
      : Array.isArray(h?.data)
        ? h.data
        : h?.data?.hotels ?? h?.hotels ?? [];

    const normalizedPagination: Paging =
      h?.data?.pagination ?? h?.pagination ?? DEFAULT_PAGING;

    setHotelsData({
      hotels: normalizedHotels,
      pagination: normalizedPagination,
    });
  }, [hotels]);


  // Debug
  console.log(hotelsData.hotels, "normalized hotels");
  console.log(hotelsData.pagination, "normalized pagination");

  const noResults =
    loading === "succeeded" && hotelsData.hotels.length === 0 || loading === "failed";

  console.log(noResults)

  return (
    <Section className="py-5">
      <div className="hidden md:block">
        <Stepper currentStep={currentStep} stepsType="hotelSteps" />
      </div>
      <HotelSearch className="lg:grid-cols-4 grid-cols-2 bg-white rounded-3xl shadow-lg p-8 border" />



      {loading === "failed" && (
        <>
            <div className="min-h-screen w-full flex-col flex justify-center items-center">
              <Heading>No Hotels Found</Heading>
              <Image
                src={"/no-flight.svg"}
                width={400}
                height={400}
                alt=""
              />
            </div>
        </>
      )}

      {loading === "pending" && (
        <>
          <CustomProgressBar />
          <HotelCardSkeleton />
        </>
      )}

      {loading === "succeeded" && (
        <>
          {noResults && (
            <div className="min-h-[50vh] flex items-center justify-center">
              <p className="text-center text-gray-500">{t("noHotelsFound")}</p>
            </div>
          )}

          {!noResults && <Hotel hotels={hotelsData.hotels} />}

          <Pagination
            currentPage={currentPage}
            totalPages={hotelsData.pagination.totalPages || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </Section>
  );
}
