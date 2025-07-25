import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const assignmentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...assignments];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      dueDate: new Date(assignmentData.dueDate).toISOString()
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    const updatedAssignment = {
      ...assignments[index],
      ...assignmentData,
      Id: parseInt(id),
      dueDate: new Date(assignmentData.dueDate).toISOString()
    };
    assignments[index] = updatedAssignment;
    return { ...updatedAssignment };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments.splice(index, 1);
    return true;
  }
};

export default assignmentService;