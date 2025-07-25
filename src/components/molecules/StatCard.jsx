import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "primary",
  className
}) => {
  const colorVariants = {
    primary: {
      bg: "bg-gradient-to-br from-primary/10 to-secondary/10",
      icon: "text-primary",
      text: "text-primary"
    },
    accent: {
      bg: "bg-gradient-to-br from-accent/10 to-orange-400/10",
      icon: "text-accent",
      text: "text-accent"
    },
    success: {
      bg: "bg-gradient-to-br from-success/10 to-green-400/10",
      icon: "text-success",
      text: "text-success"
    },
    warning: {
      bg: "bg-gradient-to-br from-warning/10 to-yellow-400/10",
      icon: "text-warning",
      text: "text-warning"
    }
  };

  const variant = colorVariants[color];

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold gradient-text">{value}</p>
            {trend && (
              <div className="flex items-center text-sm">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16} 
                  className={cn("mr-1", trend === "up" ? "text-success" : "text-error")}
                />
                <span className={trend === "up" ? "text-success" : "text-error"}>
                  {trendValue}
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", variant.bg)}>
            <ApperIcon name={icon} size={24} className={variant.icon} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;