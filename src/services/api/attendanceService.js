import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const attendanceService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...attendance];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async create(attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = attendance.length > 0 ? Math.max(...attendance.map(a => a.Id)) : 0;
    const newRecord = {
      Id: maxId + 1,
      ...attendanceData,
      date: new Date(attendanceData.date).toISOString()
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const updatedRecord = {
      ...attendance[index],
      ...attendanceData,
      Id: parseInt(id),
      date: new Date(attendanceData.date).toISOString()
    };
    attendance[index] = updatedRecord;
    return { ...updatedRecord };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance.splice(index, 1);
    return true;
  }
};

export default attendanceService;