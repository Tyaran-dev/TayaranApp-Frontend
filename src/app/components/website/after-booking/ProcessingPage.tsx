import { useEffect, useState } from "react";
import ProcessingSpinner from "./ProcessingSpinner";
import ProcessingProgressBar from "./ProcessingProgressBar";
import ProcessingDots from "./ProcessingDots";
import { CheckCircle, Clock, CreditCard, Shield } from "lucide-react";

const ProcessingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: CreditCard, label: "Verifying payment details", delay: 2000 },
    { icon: Shield, label: "Securing your booking", delay: 3000 },
    { icon: Clock, label: "Confirming availability", delay: 4000 },
    { icon: CheckCircle, label: "Finalizing your order", delay: 5000 },
  ];

  useEffect(() => {
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, steps[index].delay);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-processing-bg via-white to-processing-bg/50 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Main processing card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8 text-center animate-fade-in">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <ProcessingSpinner size="lg" className="animate-scale-pulse" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3">
              Processing your order
            </h1>

            <p className="text-muted-foreground leading-relaxed">
              Please wait while we confirm your payment and booking
            </p>
          </div>

          {/* Progress section */}
          <div className="mb-8">
            <ProcessingProgressBar className="mb-6" />
            <ProcessingDots />
          </div>

          {/* Steps section */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex bg-emerald-50 items-center justify-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                    isActive
                      ? "bg-processing-primary/10 text-processing-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`relative ${isActive ? "animate-pulse-slow" : ""}`}
                  >
                    <Icon
                      className={`w-5 h-5 text-emerald-600 transition-all duration-300 ${
                        isCompleted
                          ? "text-success"
                          : isActive
                            ? "text-processing-primary"
                            : ""
                      }`}
                    />
                    {isCompleted && (
                      <CheckCircle className="absolute text-emerald-600 -top-1 -left-6 w-4 h-4 text-success animate-fade-in" />
                    )}
                  </div>
                  <span
                    className={`text-sm text-emerald-600 font-medium transition-all duration-300 ${
                      isActive ? "text-processing-primary" : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer message */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              This process usually takes 30-60 seconds. Please don't refresh the
              page.
            </p>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-processing-primary/20 rounded-full animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
