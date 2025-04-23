import React from "react";

interface RetryErrorProps {
  onRetry: () => void;
  className?: string;
  message?: string;
  buttonClassName?: string;
}

export const RetryError: React.FC<RetryErrorProps> = ({
  onRetry,
  className,
  message = "⚠️ Failed to load. Please try again.",
  buttonClassName,
}) => {
  return (
    <div className={`retry-error ${className ?? ""}`}>
      <p>{message}</p>
      <button
        className={`retry-button ${buttonClassName ?? ""}`}
        onClick={onRetry}
      >
        🔄 Retry
      </button>
    </div>
  );
};
