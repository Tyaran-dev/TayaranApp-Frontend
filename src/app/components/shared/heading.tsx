import React from "react";

interface Props {
  children?: React.ReactNode; // Allow children to be passed
  className?: string;
}

const Heading: React.FC<Props> = ({ className, children }) => {
  return (
    <div>
      <h1 className={`md:text-[24px] font-semibold text-xl  ${className}`}>
        {children}
      </h1>
    </div>
  );
};

export default Heading;
