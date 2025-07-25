import React, { useState } from "react";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-primary transition-colors"
    >
      <span>{children}</span>
      <ApperIcon 
        name={sortField === field 
          ? (sortDirection === "asc" ? "ChevronUp" : "ChevronDown")
          : "ChevronsUpDown"
        } 
        size={16} 
        className={sortField === field ? "text-primary" : "text-gray-400"}
      />
    </button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <SortButton field="lastName">Student</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="email">Contact</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="gradeLevel">Grade Level</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="enrollmentDate">Enrolled</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.map((student) => (
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
                <td className="px-6 py-4 text-sm text-gray-900">
                  {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
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
                      onClick={() => onView(student)}
                      className="p-2 hover:bg-primary/10 text-primary"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                      className="p-2 hover:bg-secondary/10 text-secondary"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student)}
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
};

export default StudentTable;