import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const studentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      Id: maxId + 1,
      ...studentData,
      enrollmentDate: new Date(studentData.enrollmentDate).toISOString()
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    const updatedStudent = {
      ...students[index],
      ...studentData,
      Id: parseInt(id),
      enrollmentDate: new Date(studentData.enrollmentDate).toISOString()
    };
    students[index] = updatedStudent;
    return { ...updatedStudent };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
    return true;
  }
};

export default studentService;