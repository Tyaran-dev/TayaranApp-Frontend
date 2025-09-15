"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function AnimationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-in-out",
            offset: 200,
            once: true,
        });
    }, []);
    return <>{children}</>;
}