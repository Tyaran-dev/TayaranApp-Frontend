"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Section from "@/app/components/shared/section";
import HotelBookingSummary from "@/app/components/website/book-now/HotelBookingSummary ";
import {
  CustomAccordion,
  CustomAccordionItem,
} from "@/app/components/website/book-now/AccordionComponent";
import { Room } from "@/app/components/website/hotel-details/RoomChoices";
import BookingSkeleton from "@/app/components/shared/Feedback/HotelBookingSkeleton";
import DOMPurify from "dompurify";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import useBookingHandler from "@/hooks/useBookingHandler";
import { useDispatch } from "react-redux";
import { clearHotels } from "@/redux/hotels/hotelsSlice";
import { CustomSelect } from "@/app/components/website/book-now/TravelerAccordion";
import { countryCodesOptions } from "@/app/data/data.js";
import PaymentForm from "@/app/components/payment/MyFatoorahForm";
import Stepper from "@/app/components/shared/Feedback/Stepper";
import Head from "next/head";
import { LoadingSpinner } from "@/app/components/shared/Feedback/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

// Types (keep your existing types)
type Title = "Mr" | "Ms" | "Mrs" | "Master" | "Miss";
type CustomerType = "Adult" | "Child";
type BookingType = "Voucher" | "Regular";
type PaymentMode = "PayLater" | "PayNow" | "CreditCard" | "Cash" | "Limit";

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
  phoneCode: string;
  isCompleted: boolean; // Added to match flight structure
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

// Utility functions (keep your existing ones)
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
    .replace(/&lt;li&gt;/g, "<li>")
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
      .replace(/&lt;li&gt;/g, "<li>")
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

const validateGuestName = (name: string) => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (!validateEnglishName(name)) {
    return "Only English letters allowed";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (name.trim().length > 25) {
    return "Name must be less than 25 characters";
  }
  return null;
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhoneNumber = (phone: string) => {
  if (!phone.trim()) {
    return "Phone number is required";
  }
  if (!/^[0-9]*$/.test(phone)) {
    return "Numbers only";
  }
  if (phone.trim().length < 7) {
    return "Phone must be at least 7 digits";
  }
  if (phone.trim().length > 15) {
    return "Phone must be less than 15 digits";
  }
  return null;
};

const validatePhoneCode = (phoneCode: string) => {
  if (!phoneCode.trim()) {
    return "Country code is required";
  }
  if (!/^[0-9]+$/.test(phoneCode.trim())) {
    return "Country code must contain numbers only";
  }
  if (phoneCode.length < 1 || phoneCode.length > 4) {
    return "Country code must be 1 to 4 digits";
  }
  return null;
};

export default function BookingPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations("bookNow");
  const locale = useLocale();
  const dispatch = useDispatch();
  const router = useRouter();

  // State similar to flight booking
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [bookingReferenceId, setBookingReferenceId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Hotel specific state
  const [roomsGuestData, setRoomsGuestData] = useState<RoomGuestData[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [preBookedRoom, setPreBookedRoom] = useState<Room | null>(null);
  const [isLoadingPreBook, setIsLoadingPreBook] = useState(false);
  const [preBookError, setPreBookError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Redux state
  const { loading: reduxLoading } = useAppSelector((state) => state.hotelData);
  const { selectedRoom, hotel, searchParamsData } = useAppSelector(
    (state) => state.hotelData
  );
  const hotelCode = hotel?.data?.hotel?.[0].HotelCode;

  // ✅ Top-level guard: no hotel data (similar to flight booking)
  if (!selectedRoom || !hotel) {
    const isRTL = locale === "ar";

    return (
      <Section className="min-h-[80vh] flex justify-center items-center">
        <div
          className={`flex flex-col items-center justify-center min-h-[300px] text-center ${isRTL ? "rtl" : "ltr"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <p className="text-lg font-semibold text-gray-700">
            {t("errors.noHotelAvailable") || "No hotel available"}
          </p>
          <p className="text-gray-500 mt-2">
            {t("errors.noHotelDescription") || "Please search for a hotel first"}
          </p>

          <Link
            href={`/${locale}/hotel-search`}
            className="mt-4 inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            {t("errors.backToSearch") || "Back to Search"}
          </Link>

          <Image
            src="/no-hotel.svg"
            width={400}
            height={400}
            alt={t("errors.noHotelAltText") || "No hotel found"}
            className="mt-6"
          />
        </div>
      </Section>
    );
  }

  // Validation functions (keep your existing ones)
  const validateField = useCallback(
    (
      roomIndex: number,
      guestType: "adults" | "children",
      guestIndex: number,
      field: keyof GuestData,
      value: string
    ) => {
      const guestKey = `room-${roomIndex}-${guestType}-${guestIndex}`;
      let error: string | null = null;

      if (field === "firstName" || field === "lastName") {
        error = validateGuestName(value);
      } else if (field === "email") {
        if (!value.trim()) error = "Email is required";
        else if (!validateEmail(value)) error = "Invalid email format";
      } else if (field === "phone") {
        error = validatePhoneNumber(value);
      } else if (field === "phoneCode") {
        error = validatePhoneCode(value);
      } else if (field === "title" && !value) {
        error = "Title is required";
      }

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[`${guestKey}-${field}`] = error;
        } else {
          delete newErrors[`${guestKey}-${field}`];
        }
        return newErrors;
      });

      return error === null;
    },
    []
  );

  const validateForm = useCallback(() => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    const allFirstNames: string[] = [];

    roomsGuestData.forEach((room, roomIndex) => {
      room.adults.forEach((adult, adultIndex) => {
        const guestKey = `room-${roomIndex}-adult-${adultIndex}`;

        // Validate title
        if (!adult.title) {
          errors[`${guestKey}-title`] = "Title is required";
          isValid = false;
        }

        // Validate first name
        const firstNameError = validateGuestName(adult.firstName);
        if (firstNameError) {
          errors[`${guestKey}-firstName`] = firstNameError;
          isValid = false;
        } else if (adult.firstName.trim()) {
          allFirstNames.push(adult.firstName.trim().toLowerCase());
        }

        // Validate last name
        const lastNameError = validateGuestName(adult.lastName);
        if (lastNameError) {
          errors[`${guestKey}-lastName`] = lastNameError;
          isValid = false;
        }

        // Check if guest is completed
        const isGuestCompleted = adult.firstName.trim() && adult.lastName.trim() && adult.title;

        // Lead guest validation
        if (roomIndex === 0 && adultIndex === 0) {
          if (!adult.email.trim()) {
            errors[`${guestKey}-email`] = "Email is required";
            isValid = false;
          } else if (!validateEmail(adult.email)) {
            errors[`${guestKey}-email`] = "Invalid email format";
            isValid = false;
          }

          const phoneError = validatePhoneNumber(adult.phone);
          if (phoneError) {
            errors[`${guestKey}-phone`] = phoneError;
            isValid = false;
          }

          const phoneCodeError = validatePhoneCode(adult.phoneCode);
          if (phoneCodeError) {
            errors[`${guestKey}-phoneCode`] = phoneCodeError;
            isValid = false;
          }
        }
      });

      room.children.forEach((child, childIndex) => {
        const guestKey = `room-${roomIndex}-child-${childIndex}`;

        if (!child.title) {
          errors[`${guestKey}-title`] = "Title is required";
          isValid = false;
        }

        const firstNameError = validateGuestName(child.firstName);
        if (firstNameError) {
          errors[`${guestKey}-firstName`] = firstNameError;
          isValid = false;
        } else if (child.firstName.trim()) {
          allFirstNames.push(child.firstName.trim().toLowerCase());
        }

        const lastNameError = validateGuestName(child.lastName);
        if (lastNameError) {
          errors[`${guestKey}-lastName`] = lastNameError;
          isValid = false;
        }
      });
    });

    // Duplicate name checking
    const nameCounts: { [key: string]: number } = {};
    allFirstNames.forEach((name) => {
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    });

    Object.keys(nameCounts).forEach((name) => {
      if (nameCounts[name] > 1) {
        isValid = false;
        roomsGuestData.forEach((room, roomIndex) => {
          room.adults.forEach((adult, adultIndex) => {
            if (adult.firstName.trim().toLowerCase() === name) {
              errors[`room-${roomIndex}-adult-${adultIndex}-firstName`] =
                "First name must be unique";
            }
          });
          room.children.forEach((child, childIndex) => {
            if (child.firstName.trim().toLowerCase() === name) {
              errors[`room-${roomIndex}-child-${childIndex}-firstName`] =
                "First name must be unique";
            }
          });
        });
      }
    });

    setValidationErrors(errors);
    return isValid;
  }, [roomsGuestData]);

  // Check if all travelers are completed (similar to flight booking)
  const allTravelersCompleted = useMemo(() => {
    return roomsGuestData.every(room =>
      room.adults.every(adult =>
        adult.firstName.trim() &&
        adult.lastName.trim() &&
        adult.title &&
        (room.adults.indexOf(adult) > 0 || (adult.email.trim() && validateEmail(adult.email) && adult.phone.trim()))
      ) &&
      room.children.every(child =>
        child.firstName.trim() &&
        child.lastName.trim() &&
        child.title
      )
    );
  }, [roomsGuestData]);

  // Callbacks (keep your existing ones with minor modifications)
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
          // Update isCompleted status for the guest
          isCompleted: field === 'firstName' || field === 'lastName' || field === 'title'
            ? checkGuestCompletion(updated[roomIndex][guestType][guestIndex], field, value)
            : updated[roomIndex][guestType][guestIndex].isCompleted
        };
        return updated;
      });

      if (hasAttemptedSubmit) {
        validateField(roomIndex, guestType, guestIndex, field, value);
      }
    },
    [hasAttemptedSubmit, validateField]
  );

  const checkGuestCompletion = (guest: GuestData, field: keyof GuestData, value: string): boolean => {
    const updatedGuest = { ...guest, [field]: value };
    return !!(updatedGuest.firstName.trim() &&
      updatedGuest.lastName.trim() &&
      updatedGuest.title);
  };

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

  const handlePhoneCodeChange = useCallback(
    (
      roomIndex: number,
      guestType: "adults" | "children",
      guestIndex: number,
      selectedValue: string
    ) => {
      const onlyNumbers = selectedValue.replace(/[^0-9]/g, "");
      updateGuestData(
        roomIndex,
        guestType,
        guestIndex,
        "phoneCode",
        onlyNumbers
      );

      if (hasAttemptedSubmit) {
        validateField(
          roomIndex,
          guestType,
          guestIndex,
          "phoneCode",
          onlyNumbers
        );
      }
    },
    [updateGuestData, hasAttemptedSubmit, validateField]
  );

  const formatGuestDataForAPI = useCallback((): BookingPayload => {
    const leadGuest = roomsGuestData[0]?.adults[0];
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 1000);

    const formattedPhoneNumber =
      leadGuest?.phoneCode && leadGuest?.phone
        ? `+${leadGuest.phoneCode}${leadGuest.phone}`
        : leadGuest?.phone || "";

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
      ClientReferenceId: `BOOK-${dateStr}${randomNum}`,
      BookingReferenceId: `TBO-BOOK-${dateStr}${randomNum}`,
      TotalFare: selectedRoom?.TotalFare || 0,
      EmailId: leadGuest?.email || "",
      PhoneNumber: formattedPhoneNumber,
      BookingType: "Voucher",
      PaymentMode: "Limit",
    };
  }, [roomsGuestData, selectedRoom]);

  const handleSubmitBooking = useBookingHandler(
    formatGuestDataForAPI,
    allTravelersCompleted,
    searchParamsData || (() => { throw new Error("Search parameters are missing"); })()
  );

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
            phoneCode: "",
            isCompleted: false,
          })),
          children: Array.from({ length: room.Children }, () => ({
            title: "Master",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            phoneCode: "",
            isCompleted: false,
          })),
        })
      );
      setRoomsGuestData(initialRoomsData);
      setOpenItems(initialRoomsData.map((_, i) => `room-${i}`));
    }
  }, [searchParamsData]);

  useEffect(() => {
    const preBookRoom = async () => {
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
  }, [selectedRoom, baseUrl]);

  // Handle step navigation
  const handleContinueToPayment = useCallback(async () => {
    setHasAttemptedSubmit(true);

    if (!allTravelersCompleted) {
      setOpenItems(roomsGuestData.map((_, i) => `room-${i}`));
      setTimeout(() => {
        const firstErrorKey = Object.keys(validationErrors)[0];
        if (firstErrorKey) {
          const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 100);
      return;
    }

    setCurrentStep(3);
  }, [allTravelersCompleted, roomsGuestData, validationErrors]);

  const handleBackToDetails = useCallback(() => {
    setCurrentStep(2);
  }, []);

  // Render guest inputs function (keep your existing one)
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
            validationErrors[`${guestKey}-title`] ||
            (isLeadGuest &&
              (validationErrors[`${guestKey}-email`] ||
                validationErrors[`${guestKey}-phone`]))
            ? "border-red-300 bg-red-50"
            : "border-gray-200 bg-gray-50"
            }`}
          data-error={guestKey}
        >
          <h4 className="font-medium text-gray-900">{guestLabel}</h4>

          <div className="flex gap-2">
            {(guestType === "adults"
              ? ["Mr", "Ms", "Mrs"]
              : ["Master", "Miss"]
            ).map((title) => (
              <button
                key={title}
                type="button"
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
          {validationErrors[`${guestKey}-title`] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors[`${guestKey}-title`]}
            </p>
          )}

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
                onBlur={(e) =>
                  validateField(
                    roomIndex,
                    guestType,
                    guestIndex,
                    "firstName",
                    e.target.value
                  )
                }
                className={`w-full px-3 py-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors[`${guestKey}-firstName`]
                  ? "border-red-500"
                  : "border-stone-300"
                  }`}
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
                onBlur={(e) =>
                  validateField(
                    roomIndex,
                    guestType,
                    guestIndex,
                    "lastName",
                    e.target.value
                  )
                }
                className={`w-full px-3 py-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors[`${guestKey}-lastName`]
                  ? "border-red-500"
                  : "border-stone-300"
                  }`}
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
                  onBlur={(e) =>
                    validateField(
                      roomIndex,
                      guestType,
                      guestIndex,
                      "email",
                      e.target.value
                    )
                  }
                  className={`w-full px-3 py-4 border rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none ${validationErrors[`${guestKey}-email`]
                    ? "border-red-500"
                    : "border-gray-300"
                    }`}
                  required
                />
                {validationErrors[`${guestKey}-email`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors[`${guestKey}-email`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <CustomSelect
                      value={guest.phoneCode}
                      required={true}
                      onChange={(selectedValue) => {
                        const onlyNumbers = selectedValue.replace(/[^0-9]/g, "");
                        updateGuestData(
                          roomIndex,
                          guestType,
                          guestIndex,
                          "phoneCode",
                          onlyNumbers
                        );
                      }}
                      options={countryCodesOptions.map((country) => ({
                        value: country.code.replace(/\+/g, ""),
                        label:
                          locale === "en"
                            ? `${country.country} ${country.code}`
                            : `${country.arabicName} ${country.code}`,
                      }))}
                      placeholder="+1"
                      searchable={true}
                    />
                    {validationErrors[`${guestKey}-phoneCode`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors[`${guestKey}-phoneCode`]}
                      </p>
                    )}
                  </div>
                  <div className="w-2/3">
                    <input
                      placeholder="Phone number"
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                        updateGuestData(
                          roomIndex,
                          guestType,
                          guestIndex,
                          "phone",
                          onlyNumbers
                        );
                      }}
                      onBlur={(e) =>
                        validateField(
                          roomIndex,
                          guestType,
                          guestIndex,
                          "phone",
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-4 border rounded-lg focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none ${validationErrors[`${guestKey}-phone`]
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      required
                    />
                    {validationErrors[`${guestKey}-phone`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors[`${guestKey}-phone`]}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: +{guest.phoneCode || "XX"}
                  {guest.phone || "XXXXXXXXX"}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    },
    [handleNameInput, updateGuestData, validationErrors, locale]
  );

  // Loading and error states
  if (isLoadingPreBook) {
    return (
      <Section className="min-h-[80vh] flex justify-center items-center">
        <div className="flex justify-center items-center min-h-[80vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Section>
    );
  }

  if (preBookError) {
    return (
      <Section className="min-h-[80vh] flex justify-center items-center">
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <p className="text-lg font-semibold text-gray-700">{preBookError}</p>
          <button
            onClick={() => router.push(`/${locale}/hotel-details/${hotelCode}`)}
            className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {t("errors.retry") || "Retry"}
          </button>
        </div>
      </Section>
    );
  }

  if (!preBookedRoom) {
    return (
      <Section className="min-h-[80vh] flex justify-center items-center">
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <p className="text-lg font-semibold text-gray-700">
            {t("errors.noRoomAvailable") || "No room data available"}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Head>
        <title>{t("pageTitle") || "Hotel Booking"}</title>
      </Head>
      <Section className="py-10">
        {loading ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <LoadingSpinner size="lg" />
          </div>
        ) : !selectedRoom || !hotel ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <p className="text-lg font-semibold text-gray-700">
              {t("errors.noHotelAvailable") || "No hotel available"}
            </p>
            <p className="text-gray-500 mt-2">
              {t("errors.noHotelDescription") || "Please search for a hotel first"}
            </p>
          </div>
        ) : (
          <div className="w-full flex items-start lg:flex-row flex-col gap-4 mt-6 mb-16">
            {/* Right section - Guest Details & Payment */}
            <div className="lg:w-[65%] w-full flex flex-col gap-4">
              {currentStep === 2 && (
                <>


                  <form>
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
                                        ? `, ${roomData.children.length} Child${roomData.children.length > 1 ? "ren" : ""}`
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
                                        : ""}`
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

                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between">
                      <button
                        type="button"
                        onClick={handleContinueToPayment}
                        disabled={!allTravelersCompleted}
                        className={`w-full sm:w-auto border bg-emerald-800 border-gray-300 hover:border-gray-400 text-white transition py-3 px-4 rounded-xl font-semibold ${!allTravelersCompleted
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                          }`}
                      >
                        {t("payment.continueToPayment") || "Continue to Payment"}
                      </button>

                      {!allTravelersCompleted && (
                        <p className="text-red-600 text-sm mt-2">
                          {t("errors.completeAllTravelers") || "Please complete all guest details"}
                        </p>
                      )}
                    </div>
                  </form>
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
                          {extractFeesAndExtras(preBookedRoom.RateConditions).mandatory && (
                            <div
                              dangerouslySetInnerHTML={
                                extractFeesAndExtras(preBookedRoom.RateConditions).mandatory
                              }
                              className="text-sm text-gray-600 space-y-2"
                            />
                          )}
                          {extractFeesAndExtras(preBookedRoom.RateConditions).optional && (
                            <div
                              dangerouslySetInnerHTML={
                                extractFeesAndExtras(preBookedRoom.RateConditions).optional
                              }
                              className="text-sm text-gray-600 space-y-2"
                            />
                          )}
                          <p className="text-base text-gray-500 mt-4">
                            The above list may not be comprehensive. Fees and deposits may not include tax and are subject to change.
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
                    </div>
                    <div className="px-6 pb-6">
                      {preBookedRoom.RateConditions &&
                        extractCheckInInstructions(preBookedRoom.RateConditions) && (
                          <div
                            dangerouslySetInnerHTML={extractCheckInInstructions(
                              preBookedRoom.RateConditions
                            )}
                            className="text-base text-gray-600 space-y-2"
                          />
                        )}
                      <p className="text-base text-gray-500 mt-4">
                        The above list may not be comprehensive. Please check with the property for any updates.
                      </p>
                    </div>
                  </div>
                </>

              )}



              {currentStep === 3 && (
                <div className="flex flex-col gap-4">
                  <PaymentForm
                    hotelData={preBookedRoom}
                    travelers={roomsGuestData}
                    setLoading={setLoading}
                    finalPrice={selectedRoom?.TotalFare || 0}
                    bookingType="hotel"
                  />

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleBackToDetails}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ← {t("payment.backToDetails") || "Back to Details"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Left section - Booking Summary */}
            <div className="lg:w-[35%] w-full flex flex-col gap-4">
              <HotelBookingSummary hotel={hotel} room={preBookedRoom} />

              {/* Amenities Section */}
              {preBookedRoom && preBookedRoom.Rooms?.[0]?.Amenities?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                    <h3 className="text-lg font-bold text-gray-900">Room Amenities</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {preBookedRoom.Rooms[0].Amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700 text-sm">{amenity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}