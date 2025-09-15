import React from "react";

interface Props {
    className?: string; // Additional styles if needed
    children?: React.ReactNode; // Allow children to be passed
}

const ParaHeading: React.FC<Props> = ({ children, className }) => {
    return (
        <div>
            <h1 className={`lg:text-[35px] text-white text-2xl font-[800] lg:leading-[48px] font-cairo  ${className}`}>
                {children}
            </h1>
        </div>
    );
};

export default ParaHeading;
