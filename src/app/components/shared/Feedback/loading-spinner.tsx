interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const baseClasses =
    "animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600";

  return (
    <div className={` ${baseClasses} ${sizeClasses[size]} ${className}`} />
  );
}
