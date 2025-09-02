import React from "react";
import Section from "@/app/components/shared/section";
import PaymentFailedComponent from "@/app/components/website/after-booking/PaymentFaield";

const page = () => {
  return (
    <Section className="text-center h-screen">
      <PaymentFailedComponent />
    </Section>
  );
};

export default page;
