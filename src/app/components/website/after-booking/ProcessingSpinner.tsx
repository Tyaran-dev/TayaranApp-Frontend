interface ProcessingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ProcessingSpinner = ({
  size = "md",
  className = "",
}: ProcessingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Outer ring */}
      <div
        className={`${sizeClasses[size]} rounded-full border-4 border-secondary animate-spin-slow`}
      >
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-processing-primary"></div>
      </div>

      {/* Inner pulsing dot */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        ${size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"} 
        bg-processing-secondary rounded-full animate-pulse-slow`}
      ></div>
    </div>
  );
};

export default ProcessingSpinner;
