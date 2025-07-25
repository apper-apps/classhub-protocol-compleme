import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className,
  showCount = false,
  count = 0,
  onClear
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gradient-surface"
        />
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
      
      {showCount && (
        <div className="mt-2 text-sm text-gray-600">
          {count} result{count !== 1 ? "s" : ""} found
        </div>
      )}
    </div>
  );
};

export default SearchBar;