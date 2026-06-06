import apiClient from './client';

export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  register: (email, password, firstName, lastName, role = 'STUDENT') =>
    apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      role,
    }),
};

export const studentAPI = {
  create: (data) => apiClient.post('/students', data),
  getAll: () => apiClient.get('/students'),
  getById: (id) => apiClient.get(`/students/${id}`),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
  getByStream: (id) => apiClient.get(`/students/stream/${id}`),
  getResults: (id) => apiClient.get(`/students/${id}/results`),
};

export const classStreamAPI = {
  create: (data) => apiClient.post('/class-streams', data),
  getAll: () => apiClient.get('/class-streams'),
  getById: (id) => apiClient.get(`/class-streams/${id}`),
  update: (id, data) => apiClient.put(`/class-streams/${id}`, data),
  delete: (id) => apiClient.delete(`/class-streams/${id}`),
  getReport: (id) => apiClient.get(`/class-streams/${id}/report`),
  getPositions: () => apiClient.get('/class-streams/positions'),
};

export const subjectAPI = {
  create: (data) => apiClient.post('/subjects', data),
  getAll: () => apiClient.get('/subjects'),
  getById: (id) => apiClient.get(`/subjects/${id}`),
  update: (id, data) => apiClient.put(`/subjects/${id}`, data),
  delete: (id) => apiClient.delete(`/subjects/${id}`),
  assignToClass: (classStreamId, subjectId) =>
    apiClient.post('/subjects/assign-class', {
      classStreamId,
      subjectId,
    }),
  getClassSubjectsByStream: (id) => apiClient.get(`/subjects/class-stream/${id}`),
  getClassSubjects: () => apiClient.get('/subjects/class-stream/all'),
  getSubjectPositionsByStream: (id) => apiClient.get(`/subjects/position/${id}`),
};

export const assessmentAPI = {
  create: (data) => apiClient.post('/assessments', data),
  getAll: () => apiClient.get('/assessments'),
  getById: (id) => apiClient.get(`/assessments/${id}`),
  update: (id, data) => apiClient.put(`/assessments/${id}`, data),
  delete: (id) => apiClient.delete(`/assessments/${id}`),
};

export const scoreAPI = {
  create: (data) => apiClient.post('/scores', data),
  getAll: () => apiClient.get('/scores'),
  getById: (id) => apiClient.get(`/scores/${id}`),
  update: (id, data) => apiClient.put(`/scores/${id}`, data),
  delete: (id) => apiClient.delete(`/scores/${id}`),
  getAverageByClassSubject: (classSubjectId) =>
    apiClient.get(`/scores/class-subject/${classSubjectId}`),
};
