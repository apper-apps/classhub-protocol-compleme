import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ParentContactForm from "@/components/organisms/ParentContactForm";

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
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Student Selected
          </h2>
          <p className="text-gray-600 mb-4">
            Please select a student to manage parent contacts.
          </p>
          <button
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Return to Students
          </button>
        </div>
      </div>
    );
  }

  return <ParentContactForm studentId={parseInt(studentId)} onBack={handleBack} />;
};

export default ParentContact;