"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import axios from "axios";
import HotelBookingSummary from "@/app/components/website/book-now/HotelBookingSummary ";
import {
  CustomAccordion,
  CustomAccordionItem,
} from "@/app/components/website/book-now/AccordionComponent";
import { Room } from "@/app/components/website/hotel-details/RoomChoices";
import BookingSkeleton from "@/app/components/shared/Feedback/HotelBookingSkeleton";
import DOMPurify from "dompurify";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Section from "@/app/components/shared/section";
import { useAppSelector } from "@/redux/hooks";
import useBookingHandler from "@/hooks/useBookingHandler";

// Types
type Title = "Mr" | "Ms" | "Mrs" | "Master" | "Miss";
type CustomerType = "Adult" | "Child";
type BookingType = "Voucher" | "Regular";
type PaymentMode = "PayLater" | "PayNow" | "CreditCard" | "Cash";

interface CustomerName {
  Title: Title;
  FirstName: string;
  LastName: string;
  Type: CustomerType;
}

export interface CustomerDetail {
  RoomIndex: number;
  CustomerNames: CustomerName[];
}

interface BookingPayload {
  BookingCode: string;
  CustomerDetails: CustomerDetail[];
  ClientReferenceId: string;
  BookingReferenceId: string;
  TotalFare: number;
  EmailId: string;
  PhoneNumber: string;
  BookingType: BookingType;
  PaymentMode: PaymentMode;
  Supplements?: {
    SuppID: number;
    SuppChargeType: "Mandatory" | "Optional";
    SuppIsSelected: boolean;
  }[];
}

interface GuestData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface RoomGuestData {
  roomNumber: number;
  adults: GuestData[];
  children: GuestData[];
}

interface PaxRoom {
  Adults: number;
  Children: number;
  ChildrenAges?: number[];
}

// Utility functions
const extractCheckInInstructions = (
  rateConditions: (string | object | null | undefined)[]
) => {
  const stringConditions = rateConditions.filter(
    (condition): condition is string => typeof condition === "string"
  );

  const checkInInstruction = stringConditions.find(
    (condition) =>
      condition.includes("CheckIn Instructions:") ||
      condition.includes("Special Instructions :")
  );

  if (!checkInInstruction) return undefined;

  let content = checkInInstruction
    .replace("CheckIn Instructions:", "")
    .replace("Special Instructions :", "")
    .trim();

  content = content
    .replace(/&lt;ul&gt;/g, "")
    .replace(/&lt;\/ul&gt;/g, "")
    .replace(/&lt;li&gt;/g, "<li>• ")
    .replace(/&lt;\/li&gt;/g, "")
    .replace(/-vib-dip/g, "")
    .replace(/-dip-dip/g, "")
    .replace(/-dip/g, "");

  return { __html: DOMPurify.sanitize(content) };
};

const extractFeesAndExtras = (
  rateConditions: (string | object | null | undefined)[]
) => {
  const stringConditions = rateConditions.filter(
    (condition): condition is string => typeof condition === "string"
  );

  const mandatoryFees = stringConditions.find((condition) =>
    condition.includes("Mandatory Fees:")
  );
  const optionalFees = stringConditions.find((condition) =>
    condition.includes("Optional Fees:")
  );

  const processFeeContent = (feeContent: string) => {
    if (!feeContent) return undefined;

    let content = feeContent
      .replace(/&lt;ul&gt;/g, "")
      .replace(/&lt;\/ul&gt;/g, "")
      .replace(/&lt;li&gt;/g, "<li>• ")
      .replace(/&lt;\/li&gt;/g, "")
      .replace(/&lt;p&gt;/g, "<p>")
      .replace(/&lt;\/p&gt;/g, "</p>");

    return { __html: DOMPurify.sanitize(content) };
  };

  return {
    mandatory: mandatoryFees
      ? processFeeContent(mandatoryFees.replace("Mandatory Fees:", "").trim())
      : undefined,
    optional: optionalFees
      ? processFeeContent(optionalFees.replace("Optional Fees:", "").trim())
      : undefined,
  };
};

const validateEnglishName = (name: string) => /^[a-zA-Z\s'-]*$/.test(name);
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNumber = (phone: string) => /^[0-9]*$/.test(phone);

export default function BookingPage() {
  // State
  const [currentStep] = useState(3);
  const [roomsGuestData, setRoomsGuestData] = useState<RoomGuestData[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [preBookedRoom, setPreBookedRoom] = useState<Room | null>(null);
  const [isLoadingPreBook, setIsLoadingPreBook] = useState(false);
  const [preBookError, setPreBookError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const { loading } = useAppSelector((state) => state.hotelData);

  // Hooks
  const locale = useLocale();
  const router = useRouter();
  const { selectedRoom, hotel, searchParamsData } = useAppSelector(
    (state) => state.hotelData
  );
  const hotelCode = hotel?.data?.hotel[0].HotelCode;

  // Validate form
  const isValidForm = useMemo(() => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    roomsGuestData.forEach((room, roomIndex) => {
      room.adults.forEach((adult, adultIndex) => {
        const guestKey = `room-${roomIndex}-adult-${adultIndex}`;

        if (!adult.firstName.trim()) {
          errors[`${guestKey}-firstName`] = "First name is required";
          isValid = false;
        } else if (!validateEnglishName(adult.firstName)) {
          errors[`${guestKey}-firstName`] = "Only English letters allowed";
          isValid = false;
        }

        if (!adult.lastName.trim()) {
          errors[`${guestKey}-lastName`] = "Last name is required";
          isValid = false;
        } else if (!validateEnglishName(adult.lastName)) {
          errors[`${guestKey}-lastName`] = "Only English letters allowed";
          isValid = false;
        }

        // Validate lead guest (first adult in first room)
        if (roomIndex === 0 && adultIndex === 0) {
          if (!adult.email.trim()) {
            errors[`${guestKey}-email`] = "Email is required";
            isValid = false;
          } else if (!validateEmail(adult.email)) {
            errors[`${guestKey}-email`] = "Invalid email format";
            isValid = false;
          }

          if (!adult.phone.trim()) {
            errors[`${guestKey}-phone`] = "Phone is required";
            isValid = false;
          } else if (!validatePhoneNumber(adult.phone)) {
            errors[`${guestKey}-phone`] = "Numbers only";
            isValid = false;
          }
        }
      });

      room.children.forEach((child, childIndex) => {
        const guestKey = `room-${roomIndex}-child-${childIndex}`;

        if (!child.firstName.trim()) {
          errors[`${guestKey}-firstName`] = "First name is required";
          isValid = false;
        } else if (!validateEnglishName(child.firstName)) {
          errors[`${guestKey}-firstName`] = "Only English letters allowed";
          isValid = false;
        }

        if (!child.lastName.trim()) {
          errors[`${guestKey}-lastName`] = "Last name is required";
          isValid = false;
        } else if (!validateEnglishName(child.lastName)) {
          errors[`${guestKey}-lastName`] = "Only English letters allowed";
          isValid = false;
        }
      });
    });

    setValidationErrors(errors);
    return isValid;
  }, [roomsGuestData]);

  // Callbacks
  const handleToggle = useCallback((value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  const updateGuestData = useCallback(
    (
      roomIndex: number,
      guestType: "adults" | "children",
      guestIndex: number,
      field: keyof GuestData,
      value: string
    ) => {
      setRoomsGuestData((prev) => {
        const updated = [...prev];
        updated[roomIndex] = { ...updated[roomIndex] };
        updated[roomIndex][guestType] = [...updated[roomIndex][guestType]];
        updated[roomIndex][guestType][guestIndex] = {
          ...updated[roomIndex][guestType][guestIndex],
          [field]: value,
        };
        return updated;
      });
    },
    []
  );

  const handleNameInput = useCallback(
    (
      roomIndex: number,
      guestType: "adults" | "children",
      guestIndex: number,
      field: keyof GuestData,
      value: string
    ) => {
      if (
        (field === "firstName" || field === "lastName") &&
        !validateEnglishName(value)
      ) {
        return;
      }
      updateGuestData(roomIndex, guestType, guestIndex, field, value);
    },
    [updateGuestData]
  );

  const formatGuestDataForAPI = useCallback((): BookingPayload => {
    const leadGuest = roomsGuestData[0]?.adults[0];
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 1000);

    return {
      BookingCode: selectedRoom?.BookingCode || "",
      CustomerDetails: roomsGuestData.map((room, idx) => ({
        RoomIndex: idx,
        CustomerNames: [
          ...room.adults.map((adult) => ({
            Title: adult.title as Title,
            FirstName: adult.firstName,
            LastName: adult.lastName,
            Type: "Adult" as CustomerType,
          })),
          ...room.children.map((child) => ({
            Title: child.title as Title,
            FirstName: child.firstName,
            LastName: child.lastName,
            Type: "Child" as CustomerType,
          })),
        ],
      })),
      ClientReferenceId: `CASE7-${dateStr}${randomNum}`,
      BookingReferenceId: `TBO-BOOK-CASE9-${dateStr}${randomNum}`,
      TotalFare: selectedRoom?.TotalFare || 0,
      EmailId: leadGuest?.email || "",
      PhoneNumber: leadGuest?.phone || "",
      BookingType: "Voucher",
      PaymentMode: "PayLater",
    };
  }, [roomsGuestData, selectedRoom]);

  const handleSubmitBooking = useBookingHandler(
    formatGuestDataForAPI,
    isValidForm,
    searchParamsData ? searchParamsData : (() => {
      throw new Error('Search parameters are missing');
    })());

  // Effects
  useEffect(() => {
    if (searchParamsData?.PaxRooms) {
      const initialRoomsData: RoomGuestData[] = searchParamsData.PaxRooms.map(
        (room: PaxRoom, index: number) => ({
          roomNumber: index + 1,
          adults: Array.from({ length: room.Adults }, () => ({
            title: "Mr",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          })),
          children: Array.from({ length: room.Children }, () => ({
            title: "Master",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          })),
        })
      );
      setRoomsGuestData(initialRoomsData);
      // Open all accordions by default
      setOpenItems(initialRoomsData.map((_, i) => `room-${i}`));
    }
  }, [searchParamsData]);

  useEffect(() => {
    const preBookRoom = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!selectedRoom) return;

      try {
        setIsLoadingPreBook(true);
        setPreBookError(null);
        const response = await axios.post(`${baseUrl}/hotels/PreBookRoom`, {
          BookingCode: selectedRoom.BookingCode,
        });
        setPreBookedRoom(response.data?.data.HotelResult[0]);
      } catch (error) {
        console.error("Error during pre-booking:", error);
        setPreBookError("Failed to pre-book room. Please try again.");
      } finally {
        setIsLoadingPreBook(false);
      }
    };

    preBookRoom();
  }, [selectedRoom]);

  // Render functions
  const renderGuestInputs = useCallback(
    (
      guest: GuestData,
      roomIndex: number,
      guestType: "adults" | "children",
      guestIndex: number,
      guestLabel: string
    ) => {
      const isLeadGuest =
        roomIndex === 0 && guestIndex === 0 && guestType === "adults";
      const guestKey = `room-${roomIndex}-${guestType}-${guestIndex}`;

      return (
        <div
          key={`${guestKey}`}
          className={`space-y-4 p-4 border rounded-lg ${validationErrors[`${guestKey}-firstName`] ||
            validationErrors[`${guestKey}-lastName`] ||
            (isLeadGuest &&
              (validationErrors[`${guestKey}-email`] ||
                validationErrors[`${guestKey}-phone`]))
            ? "border-red-300 bg-red-50"
            : "border-gray-200 bg-gray-50"
            }`}
        >
          <h4 className="font-medium text-gray-900">{guestLabel}</h4>

          <div className="flex gap-2">
            {(guestType === "adults"
              ? ["Mr", "Ms", "Mrs"]
              : ["Master", "Miss"]
            ).map((title) => (
              <button
                key={title}
                onClick={() =>
                  updateGuestData(
                    roomIndex,
                    guestType,
                    guestIndex,
                    "title",
                    title
                  )
                }
                className={`px-4 py-2 text-sm rounded-lg ${guest.title === title
                  ? "bg-greenGradient text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {title}
              </button>
            ))}
          </div>

          <div className="flex justify-between gap-4">
            <div className="w-full">
              <input
                placeholder="First name"
                value={guest.firstName}
                onChange={(e) =>
                  handleNameInput(
                    roomIndex,
                    guestType,
                    guestIndex,
                    "firstName",
                    e.target.value
                  )
                }
                className="w-full px-3 py-4 border border-stone-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {validationErrors[`${guestKey}-firstName`] && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors[`${guestKey}-firstName`]}
                </p>
              )}
            </div>

            <div className="w-full">
              <input
                placeholder="Last name"
                value={guest.lastName}
                onChange={(e) =>
                  handleNameInput(
                    roomIndex,
                    guestType,
                    guestIndex,
                    "lastName",
                    e.target.value
                  )
                }
                className="w-full px-3 py-4 border border-stone-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {validationErrors[`${guestKey}-lastName`] && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors[`${guestKey}-lastName`]}
                </p>
              )}
            </div>
          </div>

          {isLeadGuest && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  placeholder="Email address"
                  type="email"
                  value={guest.email}
                  onChange={(e) =>
                    updateGuestData(
                      roomIndex,
                      guestType,
                      guestIndex,
                      "email",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  required
                />
                {validationErrors[`${guestKey}-email`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors[`${guestKey}-email`]}
                  </p>
                )}
              </div>
              <div className="flex">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-gray-50">
                  <option value="+966">+966</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <div className="flex-1">
                  <input
                    placeholder="Phone number"
                    type="tel"
                    value={guest.phone}
                    onChange={(e) =>
                      updateGuestData(
                        roomIndex,
                        guestType,
                        guestIndex,
                        "phone",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-4 border border-gray-300 border-l-0 rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                    required
                  />
                  {validationErrors[`${guestKey}-phone`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors[`${guestKey}-phone`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    },
    [handleNameInput, updateGuestData, validationErrors]
  );

  // Loading and error states
  if (isLoadingPreBook) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingSkeleton />
        </div>
      </div>
    );
  }

  if (preBookError) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
            <p className="text-red-500">{preBookError}</p>
            <button
              onClick={() =>
                router.push(`/${locale}/hotel-details/${hotelCode}`)
              }
              className="mt-4 px-4 py-2 bg-greenGradient text-white rounded-lg hover:bg-greenGradient"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!preBookedRoom) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">No room data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <Section className="py-10">
      <div className="hidden md:block">
        <Stepper currentStep={currentStep} stepsType="hotelSteps" />
      </div>
      <div className="min-h-screen py-2">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Enter guest details
                  </h2>
                </div>
                <div className="px-6 pb-6 space-y-6">
                  <CustomAccordion
                    type="multiple"
                    value={openItems}
                    onValueChange={setOpenItems}
                  >
                    {roomsGuestData.map((roomData, roomIndex) => {
                      const value = `room-${roomIndex}`;
                      return (
                        <CustomAccordionItem
                          key={roomIndex}
                          value={value}
                          title={
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-lg">
                                Room {roomData.roomNumber}
                              </span>
                              <span className="text-sm">
                                ({roomData.adults.length} Adult
                                {roomData.adults.length > 1 ? "s" : ""}
                                {roomData.children.length > 0
                                  ? `, ${roomData.children.length} Child${roomData.children.length > 1 ? "ren" : ""
                                  }`
                                  : ""}
                                )
                              </span>
                            </div>
                          }
                        >
                          <div className="space-y-4">
                            {roomData.adults.map((adult, adultIndex) =>
                              renderGuestInputs(
                                adult,
                                roomIndex,
                                "adults",
                                adultIndex,
                                `Guest ${adultIndex + 1} (Adult)${roomIndex === 0 && adultIndex === 0
                                  ? " - Lead Guest *"
                                  : ""
                                }`
                              )
                            )}
                            {roomData.children.map((child, childIndex) => {
                              const childAge =
                                searchParamsData?.PaxRooms?.[roomIndex]
                                  ?.ChildrenAges?.[childIndex] || 0;
                              return renderGuestInputs(
                                child,
                                roomIndex,
                                "children",
                                childIndex,
                                `Guest ${roomData.adults.length + childIndex + 1
                                } (Child) - Age ${childAge} Yrs *`
                              );
                            })}
                          </div>
                        </CustomAccordionItem>
                      );
                    })}
                  </CustomAccordion>
                </div>
              </div>

              {/* Fees and extras section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Fees and extras
                  </h2>
                  <p className="text-sm text-gray-600">Optional fees</p>
                </div>
                <div className="px-6 pb-6">
                  {preBookedRoom.RateConditions && (
                    <div className="space-y-4">
                      {extractFeesAndExtras(preBookedRoom.RateConditions)
                        .mandatory && (
                          <div
                            dangerouslySetInnerHTML={
                              extractFeesAndExtras(preBookedRoom.RateConditions)
                                .mandatory
                            }
                            className="text-sm text-gray-600 space-y-2"
                          />
                        )}
                      {extractFeesAndExtras(preBookedRoom.RateConditions)
                        .optional && (
                          <div
                            dangerouslySetInnerHTML={
                              extractFeesAndExtras(preBookedRoom.RateConditions)
                                .optional
                            }
                            className="text-sm text-gray-600 space-y-2"
                          />
                        )}
                      <p className="text-base text-gray-500 mt-4">
                        The above list may not be comprehensive. Fees and
                        deposits may not include tax and are subject to change.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Check-in instructions section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Check in instructions
                  </h2>
                  <p className="text-base text-gray-600">
                    Check-in Instructions
                  </p>
                </div>
                <div className="px-6 pb-6">
                  {preBookedRoom.RateConditions &&
                    extractCheckInInstructions(
                      preBookedRoom.RateConditions
                    ) && (
                      <div
                        dangerouslySetInnerHTML={extractCheckInInstructions(
                          preBookedRoom.RateConditions
                        )}
                        className="text-base text-gray-600 space-y-2"
                      />
                    )}
                  <p className="text-base text-gray-500 mt-4">
                    The above list may not be comprehensive. Please check with
                    the property for any updates.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <button
                    disabled={!isValidForm || loading === "pending"}
                    className={`bg-greenGradient w-full p-4 rounded-lg text-slate-200 transition-opacity duration-300 ${!isValidForm || loading === "pending"
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 hover:opacity-90"
                      }`}
                    onClick={async () => {
                      if (!isValidForm) {
                        // Open all accordions to show errors
                        setOpenItems(roomsGuestData.map((_, i) => `room-${i}`));
                        alert("Please fill in all required fields correctly");
                        return;
                      }
                      try {
                        await handleSubmitBooking();
                      } catch (error) {
                        if (error instanceof Error) {
                          alert(error.message);
                        } else {
                          alert("An unexpected error occurred");
                        }
                      }
                    }}
                  >
                    {loading === "pending" ? "Processing..." : "Book Now"}
                  </button>
                </div>
              </div>
            </div>

            <HotelBookingSummary hotel={hotel} room={preBookedRoom} />
          </div>
        </div>
      </div>
    </Section>
  );
}
