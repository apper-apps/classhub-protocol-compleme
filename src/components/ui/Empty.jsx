import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel = "Add New",
  onAction,
  icon = "Plus",
  type = "default"
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "students":
        return {
          icon: "Users",
          title: "No students yet",
          description: "Start building your class roster by adding your first student",
          actionLabel: "Add Student"
        };
      case "assignments":
        return {
          icon: "FileText",
          title: "No assignments created",
          description: "Create your first assignment to start tracking student progress",
          actionLabel: "Create Assignment"
        };
      case "grades":
        return {
          icon: "BarChart3",
          title: "No grades recorded",
          description: "Begin grading assignments to track student performance",
          actionLabel: "Add Grades"
        };
      case "attendance":
        return {
          icon: "Calendar",
          title: "No attendance records",
          description: "Start taking attendance to track student participation",
          actionLabel: "Take Attendance"
        };
      case "courses":
        return {
          icon: "Book",
          title: "No courses available",
          description: "Create your first course to organize your teaching materials",
          actionLabel: "Add Course"
        };
      default:
        return { icon, title, description, actionLabel };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={config.icon} size={40} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {config.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {config.description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name={config.icon} size={20} className="mr-2" />
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;