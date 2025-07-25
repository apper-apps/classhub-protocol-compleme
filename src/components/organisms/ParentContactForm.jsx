import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import CommunicationTimeline from "@/components/organisms/CommunicationTimeline";
import parentContactService from "@/services/api/parentContactService";
import { toast } from "react-toastify";

const ParentContactForm = ({ studentId, onBack }) => {
  const [parentContact, setParentContact] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    relationship: "parent",
    studentId: studentId || null
  });
  const [newCommunication, setNewCommunication] = useState({
    type: "email",
    message: "",
    direction: "sent"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadParentContact();
  }, [studentId]);

  const loadParentContact = async () => {
    try {
      setLoading(true);
      const contact = await parentContactService.getByStudentId(studentId);
      if (contact) {
        setParentContact(contact);
        setFormData({
          parentName: contact.parentName,
          email: contact.email,
          phone: contact.phone,
          relationship: contact.relationship,
          studentId: contact.studentId
        });
        const comms = await parentContactService.getCommunications(contact.Id);
        setCommunications(comms);
      } else {
        setShowForm(true);
      }
    } catch (error) {
      toast.error("Failed to load parent contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCommunicationChange = (field, value) => {
    setNewCommunication(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitParent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      let savedContact;
      
      if (parentContact) {
        savedContact = await parentContactService.update(parentContact.Id, formData);
        toast.success("Parent contact updated successfully");
      } else {
        savedContact = await parentContactService.create(formData);
        toast.success("Parent contact created successfully");
      }
      
      setParentContact(savedContact);
      setShowForm(false);
      loadParentContact();
    } catch (error) {
      toast.error("Failed to save parent contact");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddCommunication = async (e) => {
    e.preventDefault();
    if (!newCommunication.message.trim()) {
      toast.error("Communication message is required");
      return;
    }

    try {
      const communication = await parentContactService.addCommunication(parentContact.Id, newCommunication);
      setCommunications(prev => [communication, ...prev]);
      setNewCommunication({ type: "email", message: "", direction: "sent" });
      toast.success("Communication logged successfully");
    } catch (error) {
      toast.error("Failed to log communication");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ApperIcon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-gray-900">
          Parent Contact Management
        </h1>
        <Button variant="ghost" onClick={onBack}>
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Students
        </Button>
      </div>

      {(showForm || !parentContact) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="UserPlus" size={24} className="mr-2 text-primary" />
              {parentContact ? "Edit Parent Contact" : "Add Parent Contact"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitParent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Parent Name"
                  value={formData.parentName}
                  onChange={(e) => handleFormChange("parentName", e.target.value)}
                  error={errors.parentName}
                  placeholder="Enter parent name"
                />
                
                <Select
                  label="Relationship"
                  value={formData.relationship}
                  onChange={(e) => handleFormChange("relationship", e.target.value)}
                >
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="emergency_contact">Emergency Contact</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  error={errors.email}
                  placeholder="parent@example.com"
                />
                
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  error={errors.phone}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {parentContact && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {parentContact ? "Update Contact" : "Create Contact"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {parentContact && !showForm && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="User" size={24} className="mr-2 text-primary" />
                  Parent Information
                </div>
                <Button variant="ghost" onClick={() => setShowForm(true)}>
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg text-gray-900">{parentContact.parentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Relationship</p>
                  <p className="text-lg text-gray-900 capitalize">{parentContact.relationship.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{parentContact.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg text-gray-900">{parentContact.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="MessageSquare" size={24} className="mr-2 text-primary" />
                Log New Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCommunication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Communication Type"
                    value={newCommunication.type}
                    onChange={(e) => handleCommunicationChange("type", e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="meeting">In-Person Meeting</option>
                    <option value="text">Text Message</option>
                  </Select>
                  
                  <Select
                    label="Direction"
                    value={newCommunication.direction}
                    onChange={(e) => handleCommunicationChange("direction", e.target.value)}
                  >
                    <option value="sent">Sent to Parent</option>
                    <option value="received">Received from Parent</option>
                  </Select>
                </div>

                <Input
                  label="Message/Notes"
                  value={newCommunication.message}
                  onChange={(e) => handleCommunicationChange("message", e.target.value)}
                  placeholder="Enter communication details..."
                  multiline
                  rows={3}
                />

                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Log Communication
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <CommunicationTimeline communications={communications} />
        </>
      )}
    </div>
  );
};

export default ParentContactForm;