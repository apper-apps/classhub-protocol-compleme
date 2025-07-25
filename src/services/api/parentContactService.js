import parentContactsData from "@/services/mockData/parentContacts.json";
import communicationsData from "@/services/mockData/communications.json";

let parentContacts = [...parentContactsData];
let communications = [...communicationsData];
let nextContactId = Math.max(...parentContacts.map(p => p.Id)) + 1;
let nextCommunicationId = Math.max(...communications.map(c => c.Id)) + 1;

const parentContactService = {
  // Get all parent contacts
  getAll: () => {
    return Promise.resolve([...parentContacts]);
  },

  // Get parent contact by ID
  getById: (id) => {
    const contact = parentContacts.find(p => p.Id === parseInt(id));
    return Promise.resolve(contact ? { ...contact } : null);
  },

  // Get parent contact by student ID
  getByStudentId: (studentId) => {
    const contact = parentContacts.find(p => p.studentId === parseInt(studentId));
    return Promise.resolve(contact ? { ...contact } : null);
  },

  // Create new parent contact
  create: (contactData) => {
    const newContact = {
      Id: nextContactId++,
      parentName: contactData.parentName,
      email: contactData.email,
      phone: contactData.phone,
      relationship: contactData.relationship,
      studentId: parseInt(contactData.studentId),
      createdDate: new Date().toISOString()
    };

    parentContacts.push(newContact);
    return Promise.resolve({ ...newContact });
  },

  // Update parent contact
  update: (id, contactData) => {
    const index = parentContacts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error("Parent contact not found"));
    }

    const updatedContact = {
      ...parentContacts[index],
      parentName: contactData.parentName,
      email: contactData.email,
      phone: contactData.phone,
      relationship: contactData.relationship,
      updatedDate: new Date().toISOString()
    };

    parentContacts[index] = updatedContact;
    return Promise.resolve({ ...updatedContact });
  },

  // Delete parent contact
  delete: (id) => {
    const index = parentContacts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error("Parent contact not found"));
    }

    parentContacts.splice(index, 1);
    // Also delete associated communications
    communications = communications.filter(c => c.parentContactId !== parseInt(id));
    return Promise.resolve(true);
  },

  // Get communications for a parent contact
  getCommunications: (parentContactId) => {
    const contactComms = communications
      .filter(c => c.parentContactId === parseInt(parentContactId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return Promise.resolve([...contactComms]);
  },

  // Add new communication
  addCommunication: (parentContactId, communicationData) => {
    const newCommunication = {
      Id: nextCommunicationId++,
      parentContactId: parseInt(parentContactId),
      type: communicationData.type,
      message: communicationData.message,
      direction: communicationData.direction,
      date: new Date().toISOString()
    };

    communications.push(newCommunication);
    return Promise.resolve({ ...newCommunication });
  },

  // Update communication
  updateCommunication: (id, communicationData) => {
    const index = communications.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error("Communication not found"));
    }

    const updatedCommunication = {
      ...communications[index],
      type: communicationData.type,
      message: communicationData.message,
      direction: communicationData.direction,
      updatedDate: new Date().toISOString()
    };

    communications[index] = updatedCommunication;
    return Promise.resolve({ ...updatedCommunication });
  },

  // Delete communication
  deleteCommunication: (id) => {
    const index = communications.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error("Communication not found"));
    }

    communications.splice(index, 1);
    return Promise.resolve(true);
  },

  // Get all communications (for admin view)
  getAllCommunications: () => {
    const sortedComms = communications.sort((a, b) => new Date(b.date) - new Date(a.date));
    return Promise.resolve([...sortedComms]);
  },

  // Search communications
  searchCommunications: (query) => {
    const filtered = communications.filter(c =>
      c.message.toLowerCase().includes(query.toLowerCase()) ||
      c.type.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return Promise.resolve([...filtered]);
  }
};

export default parentContactService;