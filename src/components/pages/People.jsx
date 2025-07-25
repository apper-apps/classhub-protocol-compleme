import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "@/services/api/studentService";
import parentContactService from "@/services/api/parentContactService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { Card } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { format } from "date-fns";

const People = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [parentContacts, setParentContacts] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredParentContacts, setFilteredParentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, parentContactsData] = await Promise.all([
        studentService.getAll(),
        parentContactService.getAll()
      ]);
      
      setStudents(studentsData);
      setParentContacts(parentContactsData);
      setFilteredStudents(studentsData);
      setFilteredParentContacts(parentContactsData);
    } catch (err) {
      setError("Failed to load people data. Please try again.");
      console.error("People loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
      setFilteredParentContacts(parentContacts);
    } else {
      const filteredStudentsData = students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const filteredParentContactsData = parentContacts.filter(contact =>
        contact.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.relationship.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredStudents(filteredStudentsData);
      setFilteredParentContacts(filteredParentContactsData);
    }
  }, [searchTerm, students, parentContacts]);

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

  const handleDeleteParentContact = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.parentName}?`)) {
      try {
        await parentContactService.delete(contact.Id);
        setParentContacts(prev => prev.filter(c => c.Id !== contact.Id));
        toast.success("Parent contact deleted successfully");
      } catch (err) {
        toast.error("Failed to delete parent contact");
        console.error("Delete parent contact error:", err);
      }
    }
  };

  const handleViewStudent = (student) => {
    navigate(`/students/${student.Id}/performance`);
    toast.info(`Viewing ${student.firstName} ${student.lastName}'s profile`);
  };

  const handleEditStudent = (student) => {
    navigate('/students');
    toast.info(`Edit ${student.firstName} ${student.lastName} in Students page`);
  };

  const handleViewParentContact = (contact) => {
    navigate('/parent-contact');
    toast.info(`Managing ${contact.parentName}'s contact information`);
  };

  const handleEditParentContact = (contact) => {
    navigate('/parent-contact');
    toast.info(`Edit ${contact.parentName} in Parent Contact page`);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  const StudentTable = ({ students }) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Student</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Contact</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Grade Level</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
              <th className="px-6 py-4 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.Id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                      {student.photoUrl ? (
                        <img 
                          src={student.photoUrl} 
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-semibold">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {student.Id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{student.email}</div>
                    <div className="text-gray-500">{student.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="info">
                    {student.gradeLevel}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={student.status === "active" ? "success" : "error"}>
                    {student.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewStudent(student)}
                      className="p-2 hover:bg-primary/10 text-primary"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStudent(student)}
                      className="p-2 hover:bg-secondary/10 text-secondary"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStudent(student)}
                      className="p-2 hover:bg-error/10 text-error"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const ParentContactTable = ({ contacts }) => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Parent</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Contact</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Relationship</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Added</th>
              <th className="px-6 py-4 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.Id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-warning/20 rounded-full flex items-center justify-center">
                      <span className="text-accent font-semibold">
                        {contact.parentName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {contact.parentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {contact.Id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{contact.email}</div>
                    <div className="text-gray-500">{contact.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="warning">
                    {contact.relationship}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {format(new Date(contact.createdDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewParentContact(contact)}
                      className="p-2 hover:bg-primary/10 text-primary"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditParentContact(contact)}
                      className="p-2 hover:bg-secondary/10 text-secondary"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteParentContact(contact)}
                      className="p-2 hover:bg-error/10 text-error"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const currentData = activeTab === "students" ? filteredStudents : filteredParentContacts;
  const totalCount = activeTab === "students" ? students.length : parentContacts.length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">People</h1>
            <p className="text-gray-600">Manage all people in your system</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/students')} variant="secondary">
            <ApperIcon name="UserPlus" size={20} className="mr-2" />
            Add Student
          </Button>
          <Button onClick={() => navigate('/parent-contact')} variant="primary">
            <ApperIcon name="Users" size={20} className="mr-2" />
            Add Parent Contact
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("students")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "students"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={16} />
              <span>Students</span>
              <Badge variant="info">{students.length}</Badge>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("parents")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "parents"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users2" size={16} />
              <span>Parent Contacts</span>
              <Badge variant="warning">{parentContacts.length}</Badge>
            </div>
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            placeholder={`Search ${activeTab === "students" ? "students" : "parent contacts"}...`}
            showCount
            count={currentData.length}
          />
        </div>
      </div>

      {/* Content */}
      {currentData.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <Empty
            type={activeTab === "students" ? "students" : "contacts"}
            onAction={() => navigate(activeTab === "students" ? '/students' : '/parent-contact')}
          />
        )
      ) : (
        activeTab === "students" ? (
          <StudentTable students={filteredStudents} />
        ) : (
          <ParentContactTable contacts={filteredParentContacts} />
        )
      )}
    </div>
  );
};

export default People;