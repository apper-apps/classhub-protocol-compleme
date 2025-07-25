import React, { useState, useEffect } from "react";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "active"));
      setAttendance(attendanceData);
      
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Attendance data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handleMarkAttendance = async (studentId, date, status) => {
    try {
      const existingRecord = attendance.find(record => 
        record.studentId === studentId && 
        new Date(record.date).toDateString() === date.toDateString()
      );

      const attendanceData = {
        studentId,
        courseId: 1, // Default course ID
        date: date.toISOString(),
        status
      };

      if (status === null) {
        // Remove attendance record
        if (existingRecord) {
          await attendanceService.delete(existingRecord.Id);
          setAttendance(prev => prev.filter(record => record.Id !== existingRecord.Id));
          toast.success("Attendance record removed");
        }
      } else if (existingRecord) {
        // Update existing record
        const updatedRecord = await attendanceService.update(existingRecord.Id, attendanceData);
        setAttendance(prev => prev.map(record => 
          record.Id === existingRecord.Id ? updatedRecord : record
        ));
        toast.success(`Attendance updated to ${status}`);
      } else {
        // Create new record
        const newRecord = await attendanceService.create(attendanceData);
        setAttendance(prev => [...prev, newRecord]);
        toast.success(`Attendance marked as ${status}`);
      }

    } catch (err) {
      toast.error("Failed to update attendance");
      console.error("Mark attendance error:", err);
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadAttendanceData} />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-6">
        <Empty
          type="students"
          title="No active students"
          description="Add students to your roster before taking attendance"
          actionLabel="Add Students"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">Track student attendance with the calendar view</p>
      </div>

      {/* Attendance Calendar */}
      <AttendanceCalendar
        students={students}
        attendance={attendance}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
};

export default Attendance;