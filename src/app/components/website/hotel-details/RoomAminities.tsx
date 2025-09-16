"use client";

import { CheckCircle } from "lucide-react";

export default function AminitiesSection({
    amenities,
    title = "Amenities",
}: {
    amenities: string[];
    title?: string;
}) {
    if (!amenities || amenities.length === 0) return null;

    return (
        <section className="mt-10">
            {/* Section Title */}
            <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {amenities.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-start gap-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4"
                    >
                        <div className="flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
