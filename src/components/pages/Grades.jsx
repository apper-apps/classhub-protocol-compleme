import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import GradePill from "@/components/molecules/GradePill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [gradeInputs, setGradeInputs] = useState({});

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
      
      if (assignmentsData.length > 0 && !selectedAssignment) {
        setSelectedAssignment(assignmentsData[0].Id.toString());
      }
      
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Grades data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const getGradeForStudent = (studentId, assignmentId) => {
    return grades.find(grade => 
      grade.studentId === studentId && grade.assignmentId === parseInt(assignmentId)
    );
  };

  const handleGradeChange = (studentId, score) => {
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: score
    }));
  };

  const handleSaveGrade = async (studentId) => {
    if (!selectedAssignment) return;
    
    const score = parseFloat(gradeInputs[studentId]);
    if (isNaN(score)) {
      toast.error("Please enter a valid score");
      return;
    }

    const assignment = assignments.find(a => a.Id === parseInt(selectedAssignment));
    if (score < 0 || score > assignment.points) {
      toast.error(`Score must be between 0 and ${assignment.points}`);
      return;
    }

    try {
      const existingGrade = getGradeForStudent(studentId, selectedAssignment);
      const gradeData = {
        studentId,
        assignmentId: parseInt(selectedAssignment),
        score,
        submittedDate: new Date().toISOString(),
        comments: ""
      };

      if (existingGrade) {
        const updatedGrade = await gradeService.update(existingGrade.Id, gradeData);
        setGrades(prev => prev.map(g => g.Id === existingGrade.Id ? updatedGrade : g));
        toast.success("Grade updated successfully");
      } else {
        const newGrade = await gradeService.create(gradeData);
        setGrades(prev => [...prev, newGrade]);
        toast.success("Grade saved successfully");
      }

      // Clear the input
      setGradeInputs(prev => ({ ...prev, [studentId]: "" }));
      
    } catch (err) {
      toast.error("Failed to save grade");
      console.error("Save grade error:", err);
    }
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(grade => grade.studentId === studentId);
    if (studentGrades.length === 0) return 0;

    let totalPoints = 0;
    let totalPossible = 0;

    studentGrades.forEach(grade => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      if (assignment) {
        totalPoints += grade.score;
        totalPossible += assignment.points;
      }
    });

    return totalPossible > 0 ? (totalPoints / totalPossible) * 100 : 0;
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadGradesData} />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="p-6">
        <Empty
          type="assignments"
          title="No assignments available"
          description="Create assignments first to start grading student work"
          actionLabel="Go to Assignments"
        />
      </div>
    );
  }

  const selectedAssignmentData = assignments.find(a => a.Id === parseInt(selectedAssignment));

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600">Enter and manage student grades</p>
        </div>
      </div>

      {/* Assignment Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2 text-primary" />
            Grade Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              label="Assignment"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              <option value="">Select an assignment</option>
              {assignments.map(assignment => (
                <option key={assignment.Id} value={assignment.Id}>
                  {assignment.title} ({assignment.points} pts)
                </option>
              ))}
            </Select>
            
            {selectedAssignmentData && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>
                  <div className="h-10 flex items-center">
                    <span className="capitalize text-gray-900 font-medium">
                      {selectedAssignmentData.category}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Total Points
                  </label>
                  <div className="h-10 flex items-center">
                    <span className="text-gray-900 font-medium">
                      {selectedAssignmentData.points} points
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Table */}
      {selectedAssignment && (
        <Card>
          <CardHeader>
            <CardTitle>
              Grades for: {selectedAssignmentData?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.filter(s => s.status === "active").map(student => {
                const existingGrade = getGradeForStudent(student.Id, selectedAssignment);
                const inputValue = gradeInputs[student.Id] !== undefined 
                  ? gradeInputs[student.Id] 
                  : existingGrade?.score || "";

                return (
                  <div key={student.Id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        {student.photoUrl ? (
                          <img 
                            src={student.photoUrl} 
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-semibold text-sm">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Average: {calculateStudentAverage(student.Id).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {existingGrade && (
                        <GradePill 
                          score={existingGrade.score} 
                          maxScore={selectedAssignmentData.points}
                        />
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Score"
                          value={inputValue}
                          onChange={(e) => handleGradeChange(student.Id, e.target.value)}
                          className="w-20 text-center"
                          min="0"
                          max={selectedAssignmentData.points}
                        />
                        <span className="text-gray-500">/ {selectedAssignmentData.points}</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSaveGrade(student.Id)}
                          disabled={!gradeInputs[student.Id]}
                        >
                          <ApperIcon name="Save" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Grades;