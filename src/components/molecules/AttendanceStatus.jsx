import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AttendanceStatus = ({ status, onClick, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "present":
        return {
          icon: "Check",
          color: "text-success bg-success/10 border-success/20",
          label: "Present"
        };
      case "absent":
        return {
          icon: "X",
          color: "text-error bg-error/10 border-error/20",
          label: "Absent"
        };
      case "tardy":
        return {
          icon: "Clock",
          color: "text-warning bg-warning/10 border-warning/20",
          label: "Tardy"
        };
      case "excused":
        return {
          icon: "FileText",
          color: "text-secondary bg-secondary/10 border-secondary/20",
          label: "Excused"
        };
      default:
        return {
          icon: "Minus",
          color: "text-gray-400 bg-gray-100 border-gray-200",
          label: "Not Marked"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110",
        config.color,
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      title={config.label}
    >
      <ApperIcon name={config.icon} size={14} />
    </button>
  );
};

export default AttendanceStatus;