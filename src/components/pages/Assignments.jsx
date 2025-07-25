import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    points: "",
    dueDate: "",
    description: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const loadAssignmentsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, gradesData] = await Promise.all([
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setGrades(gradesData);
      setFilteredAssignments(assignmentsData);
      
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Assignments loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignmentsData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAssignments(assignments);
    } else {
      const filtered = assignments.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssignments(filtered);
    }
  }, [searchTerm, assignments]);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      points: "",
      dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      description: ""
    });
    setFormErrors({});
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    resetForm();
    setShowForm(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title || "",
      category: assignment.category || "",
      points: assignment.points?.toString() || "",
      dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd") : "",
      description: assignment.description || ""
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDeleteAssignment = async (assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      try {
        await assignmentService.delete(assignment.Id);
        setAssignments(prev => prev.filter(a => a.Id !== assignment.Id));
        toast.success("Assignment deleted successfully");
      } catch (err) {
        toast.error("Failed to delete assignment");
        console.error("Delete assignment error:", err);
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.points || isNaN(formData.points) || parseFloat(formData.points) <= 0) {
      errors.points = "Points must be a positive number";
    }

    if (!formData.dueDate) {
      errors.dueDate = "Due date is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      
      const assignmentData = {
        ...formData,
        points: parseFloat(formData.points),
        courseId: 1 // Default course ID
      };

      if (editingAssignment) {
        const updatedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a));
        toast.success("Assignment updated successfully");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment created successfully");
      }
      
      setShowForm(false);
      setEditingAssignment(null);
      resetForm();
      
    } catch (err) {
      toast.error(editingAssignment ? "Failed to update assignment" : "Failed to create assignment");
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAssignment(null);
    resetForm();
  };

  const getAssignmentStatus = (assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const hasGrades = grades.some(grade => grade.assignmentId === assignment.Id);

    if (hasGrades) {
      return { status: "graded", variant: "success", label: "Graded" };
    } else if (isAfter(now, dueDate)) {
      return { status: "overdue", variant: "error", label: "Overdue" };
    } else if (isBefore(dueDate, addDays(now, 3))) {
      return { status: "due-soon", variant: "warning", label: "Due Soon" };
    } else {
      return { status: "active", variant: "info", label: "Active" };
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "homework": return "info";
      case "quiz": return "warning";
      case "test": return "error";
      case "project": return "primary";
      default: return "default";
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadAssignmentsData} />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="FileText" size={24} className="mr-2 text-primary" />
              {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Input
                label="Assignment Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={formErrors.title}
                placeholder="Enter assignment title"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  error={formErrors.category}
                >
                  <option value="">Select category</option>
                  <option value="homework">Homework</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="project">Project</option>
                </Select>

                <Input
                  label="Total Points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                  error={formErrors.points}
                  placeholder="100"
                  min="1"
                />
              </div>

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                error={formErrors.dueDate}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Assignment description or instructions..."
                  rows={4}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleFormCancel}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
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
                      {editingAssignment ? "Update Assignment" : "Create Assignment"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Create and manage class assignments</p>
        </div>
        <Button onClick={handleAddAssignment} variant="primary">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search assignments by title, category, or description..."
            showCount
            count={filteredAssignments.length}
          />
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <Empty
            type="assignments"
            onAction={handleAddAssignment}
          />
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map(assignment => {
            const status = getAssignmentStatus(assignment);
            const gradeCount = grades.filter(g => g.assignmentId === assignment.Id).length;
            
            return (
              <Card key={assignment.Id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getCategoryColor(assignment.category)}>
                          {assignment.category}
                        </Badge>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAssignment(assignment)}
                        className="p-2 hover:bg-secondary/10 text-secondary"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="p-2 hover:bg-error/10 text-error"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {assignment.description && (
                      <p className="text-gray-600 text-sm">{assignment.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                          <ApperIcon name="Calendar" size={16} className="mr-1" />
                          Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ApperIcon name="Target" size={16} className="mr-1" />
                          {assignment.points} pts
                        </div>
                      </div>
                      
                      <div className="text-gray-600">
                        {gradeCount} graded
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;