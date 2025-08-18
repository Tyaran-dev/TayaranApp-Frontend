import React from "react";

interface Props {
    children?: React.ReactNode; // Allow children to be passed
    className?: string;
}

const MidHeading: React.FC<Props> = ({ className, children }) => {
    return (
        <div>
            <h1 className={`md:text-[20px] font-bold text-xl  ${className}`}>
                {children}
            </h1>
        </div>
    );
};

export default MidHeading;
