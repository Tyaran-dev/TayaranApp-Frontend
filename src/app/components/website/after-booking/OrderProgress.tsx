'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Shield, Clock, Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl'; // Assuming you're using next-intl

interface ProcessStep {
    id: string;
    label: string;
    icon: React.ReactNode;
    status: 'completed' | 'current' | 'pending';
}

interface OrderProgressProps {
  lng?: "en" | "ar";
}

export default function OrderProgress({ lng = "en" }: OrderProgressProps) {
    const [progress, setProgress] = useState(45);
    const [currentStepIndex, setCurrentStepIndex] = useState(1);
    const t = useTranslations('OrderProgress');
    const isRTL = lng === "ar";

    const steps: ProcessStep[] = [
        {
            id: 'verify-payment',
            label: t('verifyingPayment'),
            icon: <CreditCard className="w-5 h-5" />,
            status: currentStepIndex > 0 ? 'completed' : 'pending'
        },
        {
            id: 'secure-booking',
            label: t('securingBooking'),
            icon: <Shield className="w-5 h-5" />,
            status: currentStepIndex === 1 ? 'current' : currentStepIndex > 1 ? 'completed' : 'pending'
        },
        {
            id: 'confirm-availability',
            label: t('confirmingAvailability'),
            icon: <Clock className="w-5 h-5" />,
            status: currentStepIndex === 2 ? 'current' : currentStepIndex > 2 ? 'completed' : 'pending'
        },
        {
            id: 'finalize-order',
            label: t('finalizingOrder'),
            icon: <Check className="w-5 h-5" />,
            status: currentStepIndex === 3 ? 'current' : currentStepIndex > 3 ? 'completed' : 'pending'
        }
    ];

    // Simulate progress animation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Update current step based on progress
    useEffect(() => {
        if (progress >= 75) setCurrentStepIndex(3);
        else if (progress >= 60) setCurrentStepIndex(2);
        else if (progress >= 30) setCurrentStepIndex(1);
        else setCurrentStepIndex(0);
    }, [progress]);

    return (
        <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full">
                {/* Animated Spinner */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('processingOrder')}
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {t('pleaseWait')}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{t('progress')}</span>
                        <span className="text-sm font-medium text-gray-700">{t('complete')} {progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-greenGradient rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Process Steps */}
                <div className="space-y-3 mb-8">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center p-4 rounded-xl transition-all duration-300 ${step.status === 'completed'
                                    ? 'bg-green-50 border border-green-200'
                                    : step.status === 'current'
                                        ? 'bg-blue-50 border border-blue-200'
                                        : 'bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <div
                                className={`flex items-center m-2 justify-center w-10 h-10 rounded-full ${isRTL ? 'ml-4' : 'mr-4'} transition-all duration-300 ${step.status === 'completed'
                                        ? 'bg-emerald-600 text-white'
                                        : step.status === 'current'
                                            ? 'bg-blue-500 text-white animate-pulse'
                                            : 'bg-gray-300 text-gray-500'
                                    }`}
                            >
                                {step.status === 'completed' ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    step.icon
                                )}
                            </div>
                            <span
                                className={`font-medium transition-colors duration-300 ${step.status === 'completed'
                                        ? 'text-green-700'
                                        : step.status === 'current'
                                            ? 'text-blue-700'
                                            : 'text-gray-500'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer Message */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {t('processTime')}
                    </p>
                </div>
            </div>
        </div>
    );
}