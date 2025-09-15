"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import React from "react";

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  value: string;
  isOpen?: boolean;
  onToggle?: (value: string) => void;
}

export const CustomAccordionItem = ({
  title,
  children,
  value,
  isOpen = false,
  onToggle,
}: AccordionItemProps) => {
  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => onToggle?.(value)}
        className="w-full flex items-center bg-greenGradient text-slate-100 justify-between rounded-lg p-4 font-medium text-left transition-all"
      >
        <div className="text-slate-200">{title}</div>
        <ChevronDown
          className={twMerge(
            "h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      {isOpen && (
        <div className="overflow-hidden text-sm pb-4 pt-0">{children}</div>
      )}
    </div>
  );
};

interface AccordionProps {
  type: "single" | "multiple";
  defaultValue?: string[];
  value?: string[]; // controlled value
  onValueChange?: (val: string[]) => void; // controlled handler
  children: React.ReactElement<AccordionItemProps>[];
  className?: string;
}

export const CustomAccordion = ({
  type = "single",
  defaultValue = [],
  value,
  onValueChange,
  children,
  className = "",
}: AccordionProps) => {
  // if parent passes `value`, we are controlled; otherwise, use internal state
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const openItems = value ?? internalValue;

  const setOpenItems = (newItems: string[]) => {
    if (onValueChange) {
      onValueChange(newItems); // controlled
    } else {
      setInternalValue(newItems); // uncontrolled
    }
  };

  const handleToggle = (val: string) => {
    if (type === "single") {
      setOpenItems(openItems[0] === val ? [] : [val]);
    } else {
      setOpenItems(
        openItems.includes(val)
          ? openItems.filter((item) => item !== val)
          : [...openItems, val]
      );
    }
  };

  return (
    <div className={twMerge("w-full", className)}>
      {children.map((child) =>
        React.cloneElement(child, {
          isOpen: openItems.includes(child.props.value),
          onToggle: handleToggle,
        })
      )}
    </div>
  );
};
