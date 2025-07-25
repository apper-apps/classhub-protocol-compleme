import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Students loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentService.delete(student.Id);
        setStudents(prev => prev.filter(s => s.Id !== student.Id));
        toast.success("Student deleted successfully");
      } catch (err) {
        toast.error("Failed to delete student");
        console.error("Delete student error:", err);
      }
    }
  };

  const handleViewStudent = (student) => {
    // Navigate to student detail view (would be implemented with router)
    console.log("View student:", student);
    toast.info(`Viewing ${student.firstName} ${student.lastName}'s profile`);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, formData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s));
        toast.success("Student updated successfully");
      } else {
        const newStudent = await studentService.create(formData);
        setStudents(prev => [...prev, newStudent]);
        toast.success("Student added successfully");
      }
      
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error(editingStudent ? "Failed to update student" : "Failed to add student");
      console.error("Form submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadStudents} />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage your student roster</p>
        </div>
        <Button onClick={handleAddStudent} variant="primary">
          <ApperIcon name="UserPlus" size={20} className="mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder="Search students by name, email, or grade level..."
            showCount
            count={filteredStudents.length}
          />
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <Empty
            type="students"
            onAction={handleAddStudent}
          />
        )
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}
    </div>
  );
};

export default Students;