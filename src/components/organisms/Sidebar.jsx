import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const menuItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: "LayoutDashboard" 
    },
    { 
      path: "/students", 
      label: "Students", 
      icon: "Users" 
    },
    { 
      path: "/students", 
      label: "People", 
      icon: "Users2" 
    },
    { 
      path: "/grades", 
      label: "Grades", 
      icon: "BarChart3" 
    },
    { 
      path: "/attendance", 
      label: "Attendance", 
      icon: "Calendar" 
    },
    { 
      path: "/assignments", 
      label: "Assignments", 
      icon: "FileText" 
    }
  ];

  // Desktop Sidebar - Static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-gradient-primary lg:text-white">
      <div className="flex items-center px-6 py-8 border-b border-white/20">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
          <ApperIcon name="GraduationCap" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">ClassHub</h1>
          <p className="text-sm text-white/80">Student Management</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-white/90 hover:bg-white/10 hover:text-white group",
                isActive && "bg-white/20 text-white shadow-lg"
              )
            }
          >
            <ApperIcon 
              name={item.icon} 
              size={20} 
              className="mr-3 transition-transform group-hover:scale-110" 
            />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="px-6 py-4 border-t border-white/20">
        <div className="flex items-center text-white/80">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <ApperIcon name="User" size={16} />
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">Teacher</p>
            <p className="text-white/60">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar - Overlay with transform
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "lg:hidden fixed left-0 top-0 h-full w-64 bg-gradient-primary text-white z-50 transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ClassHub</h1>
              <p className="text-sm text-white/80">Student Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-white/90 hover:bg-white/10 hover:text-white group",
                  isActive && "bg-white/20 text-white shadow-lg"
                )
              }
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className="mr-3 transition-transform group-hover:scale-110" 
              />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="px-6 py-4 border-t border-white/20">
          <div className="flex items-center text-white/80">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <ApperIcon name="User" size={16} />
            </div>
            <div className="text-sm">
              <p className="font-medium text-white">Teacher</p>
              <p className="text-white/60">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;