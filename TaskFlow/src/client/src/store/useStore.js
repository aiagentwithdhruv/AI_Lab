import { create } from 'zustand';
import { api } from '../api/client';

const useStore = create((set, get) => ({
  // ── Auth ──
  user: null,
  token: null,

  initAuth: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      set({ token, user });
    }
  },

  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  signup: async (name, email, password) => {
    const data = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, projects: [], currentProject: null, tasks: [] });
  },

  // ── Projects ──
  projects: [],
  currentProject: null,
  projectsLoading: false,

  fetchProjects: async () => {
    set({ projectsLoading: true });
    try {
      const projects = await api.get('/projects');
      set({ projects, projectsLoading: false });
    } catch (e) {
      set({ projectsLoading: false });
      throw e;
    }
  },

  fetchProject: async (id) => {
    set({ projectsLoading: true });
    try {
      const project = await api.get(`/projects/${id}`);
      set({ currentProject: project, projectsLoading: false });
      return project;
    } catch (e) {
      set({ projectsLoading: false });
      throw e;
    }
  },

  createProject: async (data) => {
    const project = await api.post('/projects', data);
    set((s) => ({ projects: [...s.projects, project] }));
    return project;
  },

  updateProject: async (id, data) => {
    const project = await api.put(`/projects/${id}`, data);
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
      currentProject: s.currentProject?.id === id ? { ...s.currentProject, ...project } : s.currentProject,
    }));
    return project;
  },

  deleteProject: async (id) => {
    await api.del(`/projects/${id}`);
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      currentProject: s.currentProject?.id === id ? null : s.currentProject,
    }));
  },

  // ── Tasks ──
  tasks: [],
  tasksLoading: false,

  fetchTasks: async (projectId, filters = {}) => {
    set({ tasksLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.assignee_id) params.append('assignee_id', filters.assignee_id);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      const qs = params.toString();
      const tasks = await api.get(`/projects/${projectId}/tasks${qs ? '?' + qs : ''}`);
      set({ tasks, tasksLoading: false });
    } catch (e) {
      set({ tasksLoading: false });
      throw e;
    }
  },

  createTask: async (projectId, data) => {
    const task = await api.post(`/projects/${projectId}/tasks`, data);
    set((s) => ({ tasks: [...s.tasks, task] }));
    return task;
  },

  updateTask: async (projectId, taskId, data) => {
    const task = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...task } : t)) }));
    return task;
  },

  moveTask: async (projectId, taskId, status, position) => {
    const task = await api.patch(`/projects/${projectId}/tasks/${taskId}/move`, { status, position });
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...task } : t)) }));
    return task;
  },

  deleteTask: async (projectId, taskId) => {
    await api.del(`/projects/${projectId}/tasks/${taskId}`);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }));
  },

  // ── Members ──
  members: [],
  membersLoading: false,

  fetchMembers: async (projectId) => {
    set({ membersLoading: true });
    try {
      const members = await api.get(`/projects/${projectId}/members`);
      set({ members, membersLoading: false });
    } catch (e) {
      set({ membersLoading: false });
      throw e;
    }
  },

  addMember: async (projectId, email) => {
    const member = await api.post(`/projects/${projectId}/members`, { email });
    set((s) => ({ members: [...s.members, member] }));
    return member;
  },

  removeMember: async (projectId, userId) => {
    await api.del(`/projects/${projectId}/members/${userId}`);
    set((s) => ({ members: s.members.filter((m) => m.id !== userId && m.user_id !== userId) }));
  },

  // ── Activity ──
  activities: [],
  activitiesLoading: false,
  hasMoreActivities: true,

  fetchActivities: async (projectId, offset = 0, limit = 20) => {
    set({ activitiesLoading: true });
    try {
      const items = await api.get(`/projects/${projectId}/activity?limit=${limit}&offset=${offset}`);
      set((s) => ({
        activities: offset === 0 ? items : [...s.activities, ...items],
        activitiesLoading: false,
        hasMoreActivities: items.length === limit,
      }));
    } catch (e) {
      set({ activitiesLoading: false });
      throw e;
    }
  },

  // ── Analytics ──
  analytics: null,
  analyticsLoading: false,

  fetchAnalytics: async (projectId) => {
    set({ analyticsLoading: true });
    try {
      const analytics = await api.get(`/projects/${projectId}/analytics`);
      set({ analytics, analyticsLoading: false });
    } catch (e) {
      set({ analyticsLoading: false });
      throw e;
    }
  },

  // ── UI ──
  filters: { status: '', assignee_id: '', priority: '', search: '' },
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () => set({ filters: { status: '', assignee_id: '', priority: '', search: '' } }),

  showTaskModal: false,
  editingTask: null,
  openTaskModal: (task = null) => set({ showTaskModal: true, editingTask: task }),
  closeTaskModal: () => set({ showTaskModal: false, editingTask: null }),

  showProjectModal: false,
  openProjectModal: () => set({ showProjectModal: true }),
  closeProjectModal: () => set({ showProjectModal: false }),
}));

export default useStore;
