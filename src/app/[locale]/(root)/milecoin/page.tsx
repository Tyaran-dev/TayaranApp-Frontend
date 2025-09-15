"use client";
import Section from "@/app/components/shared/section";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Coins,
    MapPin,
    TrendingUp,
    Users,
    Zap,
    Shield,
    Globe,
    Smartphone,
    BarChart3,
    Wallet,
    Car,
    Bike,
    Footprints,
} from "lucide-react";

// === Custom Tailwind Components (no shadcn) ===
function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "secondary";
    size?: "sm" | "md" | "lg";
}) {
    const base =
        "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none";
    const sizes: Record<string, string> = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };
    const variants: Record<string, string> = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        secondary: "bg-white text-blue-600 hover:bg-gray-100",
    };

    return (
        <button
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200 ${className}`}>
            {children}
        </div>
    );
}

function CardHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

function CardContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function CardTitle({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
}

function CardDescription({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={`text-gray-600 text-sm ${className}`}>{children}</p>;
}

function Badge({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${className}`}
        >
            {children}
        </span>
    );
}

// === Page Component ===
export default function MileCoinPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Section>
                {/* Hero Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <Badge className="mb-4 bg-blue-50 text-blue-700">
                            Revolutionary Cryptocurrency
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            MileCoin
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                Mining Through Movement
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Experience the world's first cryptocurrency that transforms your
                            daily travel into digital assets. Every mile you travel becomes a
                            step toward financial freedom.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="group">
                                Start Mining Today
                                <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg">
                                Download Whitepaper
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ... 🔽 Keep all your other sections (What is MileCoin, How It Works, Benefits, etc.)
             just replace <Button>, <Card>, <Badge> with the custom ones above. 
             The structure/content stays exactly the same. 🔽 */}



            </Section>
            {/* CTA Section (example) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Start Your MileCoin Journey Today
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                        Join the movement revolution. Download the app and start earning
                        cryptocurrency with every step, pedal, and mile you travel.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" variant="secondary" className="group">
                            Download for iOS
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-blue-600"
                        >
                            Download for Android
                        </Button>
                    </div>
                    <p className="text-blue-200 mt-6 text-sm">
                        Available on all platforms. Start mining in under 2 minutes.
                    </p>
                </div>
            </section>
        </div >
    );
}
