'use client';

import { Check } from 'lucide-react';
import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";


interface StepperProps {
    currentStep: number;
    stepsType: string
}


export default function Stepper({ currentStep, stepsType }: StepperProps) {
    const t = useTranslations('Stepper');

    const flightSteps = [
        { key: 'chooseFlight', label: t('flightSteps.chooseFlight') },
        { key: 'enterDetails', label: t('flightSteps.enterDetails') },
        { key: 'upgradeExperience', label: t('flightSteps.upgradeExperience') },
        { key: 'finalDetails', label: t('flightSteps.finalDetails') }
    ];

    const hotelSteps = [
        { key: 'selectHotel', label: t('hotelSteps.selectHotel') },
        { key: 'selectRoom', label: t('hotelSteps.selectRoom') },
        { key: 'enterDetails', label: t('hotelSteps.enterDetails') },
        { key: 'finalDetails', label: t('hotelSteps.finalDetails') }
    ];

    // const hotelSteps = 

    const steps = stepsType == "flightSteps" ? flightSteps : hotelSteps;

    return (
        <div className="relative bg-white border-2 border-stone-200 rounded-3xl px-8 py-6 mb-8">
            {/* Curved border design - decorative only */}
            <div className="absolute inset-0 rounded-[3rem] border-2 border-transparent bg-gradient-to-r from-gray-100 via-transparent to-gray-100 opacity-50"></div>

            <div className="relative flex items-center justify-between">
                {steps?.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;

                    return (
                        <div key={stepNumber} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white transition-all duration-300 ${isCompleted || isActive
                                        ? 'bg-green-600'
                                        : 'bg-gray-300'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <FaCheck size={20} />

                                    ) : (
                                        <span className="text-sm">{stepNumber}</span>
                                    )}
                                </div>

                                {/* Step Title */}
                                <div className="mx-3">
                                    <p
                                        className={`text-sm font-medium transition-colors duration-300 ${isActive || isCompleted
                                            ? 'text-green-600'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            </div>

                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <div
                                        className={`h-0.5 transition-colors duration-300 ${isCompleted
                                            ? 'bg-green-600'
                                            : 'bg-gray-300'
                                            }`}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}