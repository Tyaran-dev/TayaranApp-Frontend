import Link from "next/link";
import React from "react";
import { IoMdArrowForward } from "react-icons/io";

interface LinkWithIconProps {
  href: string;
  label?: string;
  iconStyles?: string;
  className?: string; // Optional styles for the container

  style?: string;
}

const CustomLink: React.FC<LinkWithIconProps> = ({
  href,
  label,
  className,

  style,
}) => {
  return (
    <Link
      href={href}
      className={` flex gap-2 items-center bg-green rounded-2xl md:py-3 py-2 cursor-pointer hover:scale-105 duration-300 transition-all md:px-7 px-5 ${className}`}
    >
      <p className={`text-base  text-white ${style}`}>{label}</p>
      {/* <IoMdArrowForward className="text-white text-xl" /> */}
    </Link>
  );
};

export default CustomLink;
