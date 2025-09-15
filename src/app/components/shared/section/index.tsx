import React, { ReactNode } from "react";

const Section = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div className={`xl:max-w-[1800px] lg:px-12 mx-auto md:px-5 ${className || ""}`}>
            {children}
        </div>
    );
};

export default Section;