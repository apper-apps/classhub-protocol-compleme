import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Students from "@/components/pages/Students";
import ParentContactForm from "@/components/organisms/ParentContactForm";
import Button from "@/components/atoms/Button";

const ParentContact = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get("studentId");

  const handleBack = () => {
    navigate("/students");
  };

if (!studentId) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 hover:bg-gray-100"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parent Contact</h1>
            <p className="text-gray-600">Manage parent communications</p>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Student Selected
          </h2>
          <p className="text-gray-600 mb-4">
            Please select a student to manage parent contacts.
          </p>
          <Button
            onClick={handleBack}
            variant="primary"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Return to Students
          </Button>
        </div>
      </div>
    );
  }

return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100"
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Contact</h1>
          <p className="text-gray-600">Manage parent communications</p>
        </div>
      </div>
      
      <ParentContactForm studentId={parseInt(studentId)} onBack={handleBack} />
    </div>
  );
};

export default ParentContact;