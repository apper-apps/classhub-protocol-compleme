import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AttendanceStatus from "@/components/molecules/AttendanceStatus";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

const AttendanceCalendar = ({ students, attendance, onMarkAttendance }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getAttendanceForDate = (studentId, date) => {
    return attendance.find(record => 
      record.studentId === studentId && 
      isSameDay(new Date(record.date), date)
    );
  };

  const handleMarkAttendance = (studentId, date, currentStatus) => {
    const statusCycle = ["present", "absent", "tardy", "excused", null];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    onMarkAttendance(studentId, date, nextStatus);
  };

  const getDateAttendanceStats = (date) => {
    const dayAttendance = attendance.filter(record => 
      isSameDay(new Date(record.date), date)
    );
    
    const present = dayAttendance.filter(r => r.status === "present").length;
    const total = students.length;
    
    return { present, total, percentage: total > 0 ? (present / total) * 100 : 0 };
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ApperIcon name="Calendar" size={20} className="mr-2 text-primary" />
              Attendance Calendar
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <h3 className="text-lg font-semibold min-w-[140px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {calendarDays.map(day => {
              const stats = getDateAttendanceStats(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    p-2 text-sm rounded-lg transition-all duration-200 hover:bg-gray-100
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-900"}
                    ${isSelected ? "bg-primary text-white hover:bg-primary/90" : ""}
                    ${isToday && !isSelected ? "bg-accent/10 text-accent font-semibold" : ""}
                  `}
                >
                  <div className="text-center">
                    <div>{format(day, "d")}</div>
                    {isCurrentMonth && stats.total > 0 && (
                      <div className={`
                        w-2 h-2 rounded-full mx-auto mt-1
                        ${stats.percentage >= 90 ? "bg-success" : 
                          stats.percentage >= 70 ? "bg-warning" : "bg-error"}
                      `} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Attendance for {format(selectedDate, "EEEE, MMMM do, yyyy")}
            </span>
            <div className="text-sm text-gray-500">
              {(() => {
                const stats = getDateAttendanceStats(selectedDate);
                return `${stats.present}/${stats.total} Present (${stats.percentage.toFixed(0)}%)`;
              })()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map(student => {
              const attendanceRecord = getAttendanceForDate(student.Id, selectedDate);
              return (
                <div key={student.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
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
                        {student.gradeLevel}
                      </div>
                    </div>
                  </div>
                  
                  <AttendanceStatus
                    status={attendanceRecord?.status}
                    onClick={() => handleMarkAttendance(
                      student.Id, 
                      selectedDate, 
                      attendanceRecord?.status
                    )}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;