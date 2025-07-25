import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  type = "default"
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "Search";
      case "permission":
        return "Lock";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Error";
      case "notFound":
        return "Not Found";
      case "permission":
        return "Access Denied";
      default:
        return "Error";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={getErrorIcon()} size={32} className="text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;