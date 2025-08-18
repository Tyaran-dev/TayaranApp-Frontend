"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  value: string;
  isOpen: boolean;
  onToggle: (value: string) => void;
}

export const CustomAccordionItem = ({
  title,
  children,
  value,
  isOpen,
  onToggle,
}: AccordionItemProps) => {
  return (
    <div className="border-b">
      <button
        onClick={() => onToggle(value)}
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
  children: React.ReactElement<AccordionItemProps>[];
  className?: string;
}

export const CustomAccordion = ({
  type = "single",
  defaultValue = [],
  children,
  className = "",
}: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const handleToggle = (value: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev[0] === value ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <div className={twMerge("w-full", className)}>
      {children.map((child) =>
        typeof child === "object"
          ? {
              ...child,
              props: {
                ...child.props,
                isOpen: openItems.includes(child.props.value),
                onToggle: handleToggle,
              },
            }
          : child
      )}
    </div>
  );
};
