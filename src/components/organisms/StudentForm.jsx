import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentForm = ({ student, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradeLevel: "",
    enrollmentDate: format(new Date(), "yyyy-MM-dd"),
    photoUrl: "",
    status: "active"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        gradeLevel: student.gradeLevel || "",
        enrollmentDate: student.enrollmentDate ? format(new Date(student.enrollmentDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        photoUrl: student.photoUrl || "",
        status: student.status || "active"
      });
    }
  }, [student]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const gradeLevels = [
    "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade",
    "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade",
    "10th Grade", "11th Grade", "12th Grade"
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="UserPlus" size={24} className="mr-2 text-primary" />
          {student ? "Edit Student" : "Add New Student"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors.firstName}
              placeholder="Enter first name"
            />
            
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors.lastName}
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="student@example.com"
            />
            
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Select
              label="Grade Level"
              value={formData.gradeLevel}
              onChange={(e) => handleChange("gradeLevel", e.target.value)}
              error={errors.gradeLevel}
            >
              <option value="">Select grade level</option>
              <option key="10th Grade" value="10th Grade">10th Grade</option>
            </Select>
            
            <Input
              label="Enrollment Date"
              type="date"
              value={formData.enrollmentDate}
              onChange={(e) => handleChange("enrollmentDate", e.target.value)}
              error={errors.enrollmentDate}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Photo URL (Optional)"
              value={formData.photoUrl}
              onChange={(e) => handleChange("photoUrl", e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {student ? "Update Student" : "Add Student"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;