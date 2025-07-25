import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import PerformanceChart from '@/components/molecules/PerformanceChart';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import studentService from '@/services/api/studentService';
import gradeService from '@/services/api/gradeService';
import attendanceService from '@/services/api/attendanceService';
import assignmentService from '@/services/api/assignmentService';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

const StudentPerformance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartsLoading, setChartsLoading] = useState(false);
  
  const [performanceData, setPerformanceData] = useState({
    gradesTrend: { series: [], categories: [] },
    attendanceRate: { series: [], categories: [] },
    assignmentScores: { series: [], categories: [] }
  });

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [studentData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudent(studentData);
      setGrades(gradesData.filter(g => g.studentId === parseInt(id)));
      setAttendance(attendanceData.filter(a => a.studentId === parseInt(id)));
      setAssignments(assignmentsData);
      
      processPerformanceData(
        gradesData.filter(g => g.studentId === parseInt(id)),
        attendanceData.filter(a => a.studentId === parseInt(id)),
        assignmentsData
      );
      
    } catch (err) {
      setError('Failed to load student performance data. Please try again.');
      console.error('Student performance loading error:', err);
      toast.error('Failed to load student performance data');
    } finally {
      setLoading(false);
    }
  };

  const processPerformanceData = (studentGrades, studentAttendance, allAssignments) => {
    setChartsLoading(true);
    
    try {
      // Process grades trend over time
      const gradesTrendData = processGradesTrend(studentGrades, allAssignments);
      
      // Process attendance rate over time  
      const attendanceRateData = processAttendanceRate(studentAttendance);
      
      // Process assignment scores
      const assignmentScoresData = processAssignmentScores(studentGrades, allAssignments);
      
      setPerformanceData({
        gradesTrend: gradesTrendData,
        attendanceRate: attendanceRateData,
        assignmentScores: assignmentScoresData
      });
      
    } catch (err) {
      console.error('Error processing performance data:', err);
      toast.error('Error processing performance data');
    } finally {
      setChartsLoading(false);
    }
  };

  const processGradesTrend = (studentGrades, allAssignments) => {
    if (!studentGrades || studentGrades.length === 0) {
      return { series: [], categories: [] };
    }

    // Sort grades by submission date
    const sortedGrades = [...studentGrades].sort((a, b) => 
      new Date(a.submittedDate) - new Date(b.submittedDate)
    );

    const categories = [];
    const scores = [];
    const averages = [];
    let runningTotal = 0;

    sortedGrades.forEach((grade, index) => {
      const assignment = allAssignments.find(a => a.Id === grade.assignmentId);
      const date = format(parseISO(grade.submittedDate), 'MMM dd');
      const assignmentTitle = assignment ? assignment.title.substring(0, 15) + '...' : 'Assignment';
      
      categories.push(`${date}\n${assignmentTitle}`);
      scores.push(grade.score);
      
      runningTotal += grade.score;
      averages.push(Math.round(runningTotal / (index + 1)));
    });

    return {
      series: [
        {
          name: 'Score',
          data: scores,
          type: 'column'
        },
        {
          name: 'Running Average',
          data: averages,
          type: 'line'
        }
      ],
      categories
    };
  };

  const processAttendanceRate = (studentAttendance) => {
    if (!studentAttendance || studentAttendance.length === 0) {
      return { series: [], categories: [] };
    }

    // Group attendance by week
    const weeklyAttendance = {};
    
    studentAttendance.forEach(record => {
      const date = parseISO(record.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = format(weekStart, 'MMM dd');
      
      if (!weeklyAttendance[weekKey]) {
        weeklyAttendance[weekKey] = { present: 0, total: 0 };
      }
      
      weeklyAttendance[weekKey].total++;
      if (record.status === 'present') {
        weeklyAttendance[weekKey].present++;
      }
    });

    const categories = Object.keys(weeklyAttendance).sort();
    const attendanceRates = categories.map(week => {
      const data = weeklyAttendance[week];
      return Math.round((data.present / data.total) * 100);
    });

    return {
      series: [
        {
          name: 'Attendance Rate',
          data: attendanceRates
        }
      ],
      categories
    };
  };

  const processAssignmentScores = (studentGrades, allAssignments) => {
    if (!studentGrades || studentGrades.length === 0) {
      return { series: [], categories: [] };
    }

    // Group by assignment category
    const categoryScores = {};
    
    studentGrades.forEach(grade => {
      const assignment = allAssignments.find(a => a.Id === grade.assignmentId);
      if (assignment) {
        const category = assignment.category || 'Other';
        if (!categoryScores[category]) {
          categoryScores[category] = [];
        }
        // Convert to percentage
        const percentage = Math.round((grade.score / assignment.points) * 100);
        categoryScores[category].push(percentage);
      }
    });

    // Calculate averages per category
    const categories = Object.keys(categoryScores);
    const averages = categories.map(category => {
      const scores = categoryScores[category];
      return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    });

    return {
      series: [
        {
          name: 'Average Score %',
          data: averages
        }
      ],
      categories: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
    };
  };

  const calculateStats = () => {
    if (!grades || grades.length === 0) {
      return {
        averageGrade: 0,
        totalAssignments: 0,
        attendanceRate: 0,
        trend: 'neutral'
      };
    }

    const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0);
    const averageGrade = Math.round(totalGrades / grades.length);
    
    const totalAssignments = grades.length;
    
    const presentCount = attendance.filter(record => record.status === 'present').length;
    const attendanceRate = attendance.length > 0 ? 
      Math.round((presentCount / attendance.length) * 100) : 0;
    
    // Calculate trend (compare first half vs second half of grades)
    const midPoint = Math.floor(grades.length / 2);
    const firstHalf = grades.slice(0, midPoint);
    const secondHalf = grades.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 ? 
      firstHalf.reduce((sum, g) => sum + g.score, 0) / firstHalf.length : 0;
    const secondHalfAvg = secondHalf.length > 0 ? 
      secondHalf.reduce((sum, g) => sum + g.score, 0) / secondHalf.length : 0;
    
    let trend = 'neutral';
    if (secondHalfAvg > firstHalfAvg + 5) trend = 'up';
    else if (secondHalfAvg < firstHalfAvg - 5) trend = 'down';

    return {
      averageGrade,
      totalAssignments,
      attendanceRate,
      trend
    };
  };

  useEffect(() => {
    if (id) {
      loadStudentData();
    }
  }, [id]);

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadStudentData} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Error message="Student not found" />
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/students')}
              className="p-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName} - Performance Analytics
            </h1>
          </div>
          <p className="text-gray-600">
            Grade Level: {student.gradeLevel} • Student ID: {student.Id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/students`)}
          >
            <ApperIcon name="Users" size={16} className="mr-2" />
            All Students
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="BarChart3"
          color="primary"
          trend={stats.trend}
          trendValue={stats.trend === 'up' ? '+5.2%' : stats.trend === 'down' ? '-3.1%' : '0%'}
        />
        
        <StatCard
          title="Assignments Completed"
          value={stats.totalAssignments}
          icon="FileText"
          color="accent"
        />
        
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="success"
          trend={stats.attendanceRate >= 90 ? 'up' : stats.attendanceRate >= 75 ? 'neutral' : 'down'}
          trendValue={`${stats.attendanceRate >= 90 ? '+' : ''}2.1%`}
        />
        
        <StatCard
          title="Performance Trend"
          value={stats.trend === 'up' ? 'Improving' : stats.trend === 'down' ? 'Declining' : 'Stable'}
          icon={stats.trend === 'up' ? 'TrendingUp' : stats.trend === 'down' ? 'TrendingDown' : 'Minus'}
          color={stats.trend === 'up' ? 'success' : stats.trend === 'down' ? 'warning' : 'primary'}
        />
      </div>

      {/* Performance Charts */}
      <div className="space-y-6">
        {/* Grades Trend Chart */}
        <PerformanceChart
          title="Grades Trend Over Time"
          series={performanceData.gradesTrend.series}
          categories={performanceData.gradesTrend.categories}
          type="line"
          height={400}
          loading={chartsLoading}
          color={['#2C5282', '#ED8936']}
          yAxisTitle="Score (Points)"
          showDataLabels={false}
          strokeWidth={3}
          enableZoom={true}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Rate Chart */}
          <PerformanceChart
            title="Weekly Attendance Rate"
            series={performanceData.attendanceRate.series}
            categories={performanceData.attendanceRate.categories}
            type="area"
            height={350}
            loading={chartsLoading}
            color="#38A169"
            yAxisTitle="Attendance Rate (%)"
            fillType="gradient"
            enableZoom={false}
          />

          {/* Assignment Scores by Category */}
          <PerformanceChart
            title="Average Scores by Assignment Type"
            series={performanceData.assignmentScores.series}
            categories={performanceData.assignmentScores.categories}
            type="bar"
            height={350}
            loading={chartsLoading}
            color="#ED8936"
            yAxisTitle="Average Score (%)"
            showDataLabels={true}
            enableZoom={false}
          />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-surface rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {stats.attendanceRate >= 90 && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-success" />
                  Excellent attendance record
                </li>
              )}
              {stats.averageGrade >= 85 && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-success" />
                  Strong academic performance
                </li>
              )}
              {stats.trend === 'up' && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-success" />
                  Showing improvement over time
                </li>
              )}
              {stats.totalAssignments >= 5 && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="Check" size={14} className="text-success" />
                  Consistent assignment completion
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {stats.attendanceRate < 75 && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" size={14} className="text-warning" />
                  Focus on improving attendance
                </li>
              )}
              {stats.averageGrade < 70 && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" size={14} className="text-warning" />
                  Academic support may be needed
                </li>
              )}
              {stats.trend === 'down' && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" size={14} className="text-warning" />
                  Recent performance decline
                </li>
              )}
              {stats.totalAssignments < 3 && (
                <li className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" size={14} className="text-warning" />
                  Limited assignment data available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;