"use client";

import { useEffect, useState, useMemo } from "react";
import actGetHotels from "@/redux/hotels/act/actGetHotels";
import { clearHotels } from "@/redux/hotels/hotelsSlice";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Section from "@/app/components/shared/section";
import { HotelInterface } from "@/redux/hotels/hotelsSlice";
import Hotel from "@/app/components/website/hotel-search/Hotel";
import Pagination from "@/app/components/shared/Pagination";
import HotelSearch from "@/app/components/website/home/components/hotel-search-form";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import CustomProgressBar from "@/app/components/shared/progress-bar";
import HotelCardSkeleton from "@/app/components/shared/Feedback/HotelCardSkeleton";

export default function Page() {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const locale = useLocale();
  const t = useTranslations("hotelSearchPage"); // 👈 namespace (adjust as needed)

  const { searchParamsData, hotels, loading } = useAppSelector(
    (state) => state.hotelData
  );

  console.log(loading,"loading hereeeeeeeeeeeeeeeeeeeeeeee")

  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsData, setHotelsData] = useState<{
    hotels: HotelInterface[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  }>({
    hotels: [],
    pagination: {
      page: 1,
      perPage: 50,
      total: 0,
      totalPages: 0,
    },
  });

  const fullParams = useMemo(() => {
    if (!searchParamsData) return null;
    return {
      ...searchParamsData,
      Language: locale,
      page: currentPage,
    };
  }, [searchParamsData, currentPage, locale]);

  useEffect(() => {
    if (!fullParams) return;
    console.log(loading, "loading 1");

    dispatch(clearHotels());
    dispatch(actGetHotels(fullParams));
    console.log(loading, "loading 2");
  }, [fullParams, dispatch, locale]);

  useEffect(() => {
    if (hotels) {
      setHotelsData({
        hotels: hotels.data || [],
        pagination: hotels.pagination || {
          page: 1,
          perPage: 50,
          total: 0,
          totalPages: 0,
        },
      });
    }
  }, [hotels]);

  return (
    <Section className="py-5">
      <Stepper currentStep={currentStep} stepsType="hotelSteps" />
      <HotelSearch className="lg:grid-cols-4 grid-cols-2 bg-white rounded-3xl shadow-lg p-8 border" />

      {loading === "pending" && (
        <>
          <CustomProgressBar />
          <HotelCardSkeleton />
        </>
      )}

      {loading === "succeeded" && (
        <>
          {!hotelsData.hotels.length && (
            <div className="min-h-[50vh] flex items-center justify-center">
              <p className="text-center text-gray-500">{t("noHotelsFound")}</p>
            </div>
          )}
          <Hotel hotels={hotelsData.hotels} />
          <Pagination
            currentPage={currentPage}
            totalPages={hotelsData.pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </Section>
  );
}
