import axiosInstance from '../../../shared/api/axiosInstance';
import type { Project, ProjectInput } from '../types';

export const projectsAPI = {
  // Public
  getAllProjects: async () => {
    const response = await axiosInstance.get<Project[]>('/api/public/projects');
    return response.data;
  },
  getProjectById: async (id: string) => {
    const response = await axiosInstance.get<Project>(`/api/public/projects/${id}`);
    return response.data;
  },

  // Admin
  createProject: async (project: ProjectInput) => {
    const response = await axiosInstance.post<Project>('/api/admin/projects', project);
    return response.data;
  },
  updateProject: async (id: string, project: ProjectInput) => {
    const response = await axiosInstance.put<Project>(`/api/admin/projects/${id}`, project);
    return response.data;
  },
  deleteProject: async (id: string) => {
    await axiosInstance.delete(`/api/admin/projects/${id}`);
  }
};
