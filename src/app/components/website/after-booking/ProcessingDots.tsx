const ProcessingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="w-2 h-2 bg-processing-primary rounded-full animate-bounce-gentle"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-processing-secondary rounded-full animate-bounce-gentle"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-processing-accent rounded-full animate-bounce-gentle"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
};

export default ProcessingDots;
