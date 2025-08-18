"use client";

import BestOffer from "../components/website/home/best-offer";
import HeroSection from "../components/website/home/hero-section";
import TopHotels from "../components/website/home/top-hotels";
import TopDeals from "../components/website/home/top-deals";
import Footer from "../components/shared/footer/Footer";
import TopFlights from "../components/website/home/popular-fligts";
import MobileAppSection from "../components/website/home/mobile-app-section";
import Navbar from "../components/shared/navbar";
import { Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const user = "client";

  if (user === "client") {

    return (
      <div>
        <Toaster />
        <div className="sticky top-0 left-0 z-50">
          <Navbar />
        </div>
        <HeroSection />
        {/* <HotelSearch/> */}
        <BestOffer t={t} />
        <TopHotels t={t} />
        <TopDeals t={t} />
        <TopFlights t={t} />
        <MobileAppSection t={t} />
        <Footer />
      </div>
    );
  } else {
    return "dashboard"
  }


}
