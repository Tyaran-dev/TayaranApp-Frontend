"use client";
import Section from "@/app/components/shared/section";
import React, { useEffect, useState } from "react";
import FlightCard from "@/app/components/website/book-now/DepartureCard";
import RulesComponent from "@/app/components/website/book-now/RulesComponent";
import { useSelector, useDispatch } from "react-redux";
import PaymentForm from "@/app/components/payment/MyFatoorahForm";
import TravelerAccordion from "@/app/components/website/book-now/TravelerAccordion";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import { useTranslations, useLocale } from "next-intl";
import Head from "next/head";
import axios from "axios";
import { addFlightData, selectFlight, setCommission } from "@/redux/flights/flightSlice";
import { LoadingSpinner } from "@/app/components/shared/Feedback/loading-spinner";
import Image from "next/image";
import Link from "next/link";

export interface TravelerFormData {
  travelerId: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  nationality: string;
  documentType: string;
  passportNumber: string;
  issuanceCountry: string;
  passportExpiry: {
    day: string;
    month: string;
    year: string;
  };
  email: string;
  phoneCode: string;
  phoneNumber: string;
  isCompleted: boolean;
}

const Page = () => {
  const t = useTranslations("bookNow");
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const flightDataSlice = useSelector(
    (state: any) => state.flightData.slectedFlight
  );

  // ✅ Top-level guard: no flight data
  if (!flightDataSlice || flightDataSlice.length === 0) {
    const isRTL = locale === "ar";

    return (
      <Section className="min-h-[80vh] flex justify-center items-center">
        <div
          className={`flex flex-col items-center justify-center min-h-[300px] text-center ${isRTL ? "rtl" : "ltr"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <p className="text-lg font-semibold text-gray-700">
            {t("errors.noFlightAvailable")}
          </p>
          <p className="text-gray-500 mt-2">{t("errors.noFlightDescription")}</p>

          <Link
            href={`/${locale}/flight-search`}
            className="mt-4 inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            {t("errors.backToSearch")}
          </Link>

          <Image
            src="/no-flight.svg"
            width={400}
            height={400}
            alt={t("errors.noFlightAltText")}
            className="mt-6"
          />
        </div>
      </Section>
    );
  }

  const travellersNum =
    Number(flightDataSlice[0]?.travelerPricings?.length) || 1;

  // 🔹 Re-price flight when page loads
  useEffect(() => {
    const repriceFlight = async () => {
      if (!flightDataSlice || flightDataSlice.length === 0) return;

      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/flights/flight-pricing`,
          flightDataSlice[0] // send the original selected flight
        );
        const flightData = response.data.data.flightOffers;

        // update redux with fresh priced flight
        dispatch(addFlightData(flightData));
        dispatch(selectFlight(flightData));
        dispatch(setCommission(response.data.presentageCommission)); // 🔹 store in Redux

      } catch (error) {
        console.error("Error repricing flight:", error);
      } finally {
        setLoading(false);
      }
    };

    repriceFlight();
  }, []);

  const initialTravelerData: TravelerFormData = {
    travelerId: Date.now(),
    title: "Mr",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: { day: "", month: "", year: "" },
    nationality: "",
    documentType: "PASSPORT",
    passportNumber: "",
    issuanceCountry: "",
    passportExpiry: { day: "", month: "", year: "" },
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    isCompleted: false,
  };

  const [travelers, setTravelers] = useState<TravelerFormData[]>(() => {
    return (
      flightDataSlice[0]?.travelerPricings?.map(
        (travelerPricing: any, i: number) => ({
          ...initialTravelerData,
          travelerId: i + 1,
          travelerType: travelerPricing.travelerType,
        })
      ) || []
    );
  });

  const handleTravelerUpdate = (
    index: number,
    updatedTraveler: TravelerFormData
  ) => {
    const newTravelers = [...travelers];
    newTravelers[index] = updatedTraveler;

    if (index === 0) {
      newTravelers.forEach((t, i) => {
        if (i !== 0) {
          t.email = updatedTraveler.email;
          t.phoneCode = updatedTraveler.phoneCode;
          t.phoneNumber = updatedTraveler.phoneNumber;
        }
      });
    }

    setTravelers(newTravelers);
  };

  const allTravelersCompleted = travelers.every(
    (traveler) => traveler.isCompleted
  );

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <Section className="py-10">
        {loading ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <LoadingSpinner size="lg" />
          </div>
        ) : !flightDataSlice || flightDataSlice.length === 0 ? (
          // ✅ No flight case
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <p className="text-lg font-semibold text-gray-700">
              {t("errors.noFlightAvailable")}
            </p>
            <p className="text-gray-500 mt-2">
              {t("errors.noFlightDescription")}
            </p>
          </div>
        ) : (
          // ✅ Normal case when flight exists
          <div className="w-full flex items-start lg:flex-row flex-col gap-4 mt-6 mb-16">
            {/* Right section */}
            <div className="lg:w-[65%] w-full flex flex-col gap-4">
              {currentStep === 2 && (
                <form>
                  <TravelerAccordion
                    travelers={travelers}
                    onTravelerUpdate={handleTravelerUpdate}
                  />

                  <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!allTravelersCompleted}
                      className={`w-full sm:w-auto border bg-emerald-800 border-gray-300 hover:border-gray-400 text-white transition py-3 px-4 rounded-xl font-semibold ${!allTravelersCompleted
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      {t("payment.continueToPayment")}
                    </button>

                    {!allTravelersCompleted && (
                      <p className="text-red-600 text-sm mt-2">
                        {t("errors.completeAllTravelers")}
                      </p>
                    )}
                  </div>
                </form>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col gap-4">
                  <PaymentForm
                    flightData={flightDataSlice[0]}
                    travelers={travelers}
                    setLoading={setLoading}
                  />

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ← {t("payment.backToDetails")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Left section */}
            <div className="lg:w-[35%] w-full flex flex-col gap-4">
              {flightDataSlice.map((flight: any, index: number) => (
                <div key={index}>
                  <FlightCard flightData={flight} />
                </div>
              ))}
              <RulesComponent flightData={flightDataSlice[0]} />
            </div>
          </div>
        )}
      </Section>
    </>
  );
};

export default Page;
