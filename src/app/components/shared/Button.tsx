"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";

type ButtonProps = {
  label: string;
  loadingLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: string;
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  style,
  type,
  loadingLabel,
  disabled,
  loading,
  icon
}) => {
  return (
    <div className="my-2 w-full">
      <button
        className={`md:py-4 py-3 md:px-5 px-3 rounded-2xl md:text-base justify-center text-sm font-semibold text-white  flex gap-2 items-center hover:scale-105 duration-300 transition-all ${disabled ? "bg-opacity-50 cursor-not-allowed" : ""
          } ${style}`}
        onClick={onClick}
        disabled={disabled} 
        type={type || "button"}
      >
        {icon}
        {loading ? loadingLabel : label}
      </button>
    </div>
  );
};

export default Button;
