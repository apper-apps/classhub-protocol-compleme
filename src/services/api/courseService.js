import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

const courseService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...courses];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.Id)) : 0;
    const newCourse = {
      Id: maxId + 1,
      ...courseData
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    const updatedCourse = {
      ...courses[index],
      ...courseData,
      Id: parseInt(id)
    };
    courses[index] = updatedCourse;
    return { ...updatedCourse };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    courses.splice(index, 1);
    return true;
  }
};

export default courseService;