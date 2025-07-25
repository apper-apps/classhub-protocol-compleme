import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, onBackClick, showBackButton = false, title, showSearch = false, searchValue, onSearchChange, onSearchClear, actionButton }) => {
  return (
    <header className="bg-surface border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="p-2 hover:bg-gray-100"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block w-80">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                onClear={onSearchClear}
                placeholder="Search students, assignments..."
                className="w-full"
              />
            </div>
          )}

          {actionButton}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Bell" size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onClear={onSearchClear}
            placeholder="Search students, assignments..."
          />
        </div>
      )}
    </header>
  );
};

export default Header;