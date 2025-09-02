import { useState, useEffect } from "react";

interface ProcessingProgressBarProps {
  className?: string;
}

const ProcessingProgressBar = ({
  className = "",
}: ProcessingProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full h-2 bg-emerald-600 rounded-full overflow-hidden">
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

        {/* Progress fill */}
        <div
          className="h-full bg-gradient-to-r from-processing-primary via-processing-secondary to-processing-accent rounded-full transition-all duration-1000 ease-out animate-gradient-flow"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundSize: "200% 100%",
          }}
        ></div>

        {/* Glowing effect */}
        <div
          className="absolute top-0 h-full bg-gradient-to-r from-processing-primary/50 to-processing-secondary/50 rounded-full blur-sm transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>

      {/* Progress percentage */}
      <div className="mt-3 text-center">
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(Math.min(progress, 100))}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProcessingProgressBar;
