import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import RecentActivity from "@/components/organisms/RecentActivity";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import gradeService from "@/services/api/gradeService";
import assignmentService from "@/services/api/assignmentService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData, gradesData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
      setAssignments(assignmentsData);
      
      // Generate recent activity
      const activity = generateRecentActivity(studentsData, attendanceData, gradesData, assignmentsData);
      setRecentActivity(activity);
      
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (students, attendance, grades, assignments) => {
    const activities = [];
    
    // Recent grades
    grades.slice(-5).forEach(grade => {
      const student = students.find(s => s.Id === grade.studentId);
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      if (student && assignment) {
        activities.push({
          type: "grade",
          title: "Grade Entered",
          description: `${student.firstName} ${student.lastName} received ${grade.score} points on ${assignment.title}`,
          timestamp: grade.submittedDate || new Date()
        });
      }
    });
    
    // Recent attendance
    attendance.slice(-3).forEach(record => {
      const student = students.find(s => s.Id === record.studentId);
      if (student) {
        activities.push({
          type: "attendance",
          title: "Attendance Recorded",
          description: `${student.firstName} ${student.lastName} marked as ${record.status}`,
          timestamp: record.date
        });
      }
    });
    
    // Recent assignments
    assignments.slice(-2).forEach(assignment => {
      activities.push({
        type: "assignment",
        title: "Assignment Created",
        description: `New ${assignment.category}: ${assignment.title}`,
        timestamp: assignment.dueDate
      });
    });
    
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === "active").length;
    
    // Calculate attendance rate for this week
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekAttendance = attendance.filter(record => new Date(record.date) >= thisWeek);
    const presentCount = weekAttendance.filter(record => record.status === "present").length;
    const attendanceRate = weekAttendance.length > 0 ? ((presentCount / weekAttendance.length) * 100).toFixed(1) : "0";
    
    // Calculate average grade
    const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0);
    const averageGrade = grades.length > 0 ? (totalGrades / grades.length).toFixed(1) : "0";
    
    // Count pending assignments
    const pendingAssignments = assignments.filter(assignment => {
      const hasGrades = grades.some(grade => grade.assignmentId === assignment.Id);
      return !hasGrades;
    }).length;
    
    return {
      totalStudents,
      activeStudents,
      attendanceRate,
      averageGrade,
      pendingAssignments
    };
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Teacher!</h1>
        <p className="text-white/90">
          Here's what's happening in your classroom today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+2"
        />
        
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="UserCheck"
          color="success"
        />
        
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="accent"
          trend={stats.attendanceRate >= 85 ? "up" : "down"}
          trendValue={`${stats.attendanceRate >= 85 ? "+" : ""}3.2%`}
        />
        
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="BarChart3"
          color="primary"
          trend={stats.averageGrade >= 75 ? "up" : "down"}
          trendValue={`${stats.averageGrade >= 75 ? "+" : "-"}1.5%`}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivity} />
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-surface rounded-lg p-6 border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors">
                <div className="font-medium">Take Attendance</div>
                <div className="text-sm text-primary/70">Mark today's attendance</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-accent/5 hover:bg-accent/10 text-accent transition-colors">
                <div className="font-medium">Enter Grades</div>
                <div className="text-sm text-accent/70">Grade recent assignments</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-success/5 hover:bg-success/10 text-success transition-colors">
                <div className="font-medium">Add Student</div>
                <div className="text-sm text-success/70">Enroll a new student</div>
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-surface rounded-lg p-6 border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Assignments Due</span>
                <span className="font-semibold">{stats.pendingAssignments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Classes Today</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tests This Week</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;