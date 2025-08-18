"use client";
import React, { useState, useEffect } from "react";

type Tab = {
    id: string;
    label: string;
};

type TabsProps = {
    tabs: Tab[];
};

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

    // Scroll to section
    const handleScrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setActiveTab(id);
        }
    };

    // Highlight the active tab on scroll
    useEffect(() => {
        const handleScroll = () => {
            tabs.forEach((tab) => {
                const section = document.getElementById(tab.id);
                if (section) {
                    const { top, bottom } = section.getBoundingClientRect();
                    if (top <= 150 && bottom >= 150) {
                        setActiveTab(tab.id);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [tabs]); 

    return (
        <div className="flex space-x-4 w-full overflow-x-auto py-2 px-4 bg-white">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-4 py-2 w-full flex-1 h-fit whitespace-nowrap rounded-2xl border-2 ${activeTab === tab.id
                        ? "text-white bg-orange border-orange"
                        : "text-grayText border-grayText hover:text-orange hover:border-orange"
                        }`}
                    onClick={() => handleScrollToSection(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
