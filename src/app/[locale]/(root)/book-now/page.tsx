"use client";
import Section from "@/app/components/shared/section";
import React, { useEffect, useState } from "react";
import FlightCard from "@/app/components/website/book-now/DepartureCard";
import RulesComponent from "@/app/components/website/book-now/RulesComponent";
import { useSelector } from "react-redux";
import PaymentForm from "@/app/components/payment/MyFatoorahForm";
import TravelerAccordion from "@/app/components/website/book-now/TravelerAccordion";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import { useTranslations } from "next-intl";
import Head from "next/head";

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
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);

  const flightDataSlice = useSelector(
    (state: any) => state.flightData.slectedFlight
  );
  const travellersNum =
    Number(flightDataSlice[0]?.travelerPricings.length) || 1;

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
        <Stepper currentStep={currentStep} stepsType="flightSteps" />
        <div className="w-full flex items-start lg:flex-row flex-col gap-4 mt-6 mb-16">
          {/* ✅ Right section */}
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
                    className={`w-full sm:w-auto border bg-greenGradient border-gray-300 hover:border-gray-400 text-white transition py-3 px-6 rounded-xl font-semibold ${
                      !allTravelersCompleted
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

          {/* ✅ Left section */}
          <div className="lg:w-[35%] w-full flex flex-col gap-4">
            {flightDataSlice && flightDataSlice.length > 0 ? (
              flightDataSlice.map((flight: any, index: number) => (
                <div key={index}>
                  <FlightCard flightData={flight} />
                </div>
              ))
            ) : (
              <FlightCard flightData={flightDataSlice[0]} />
            )}
            <RulesComponent flightData={flightDataSlice[0]} />
          </div>
        </div>
      </Section>
    </>
  );
};

export default Page;
