import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    info: "bg-secondary/10 text-secondary border-secondary/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;