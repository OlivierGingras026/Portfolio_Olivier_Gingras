import axiosInstance from '../../../shared/api/axiosInstance';
import type { WorkExperience, WorkExperienceInput } from '../types';

export const workExperienceAPI = {
  getAllWorkExperiences: async () => {
    const response = await axiosInstance.get<WorkExperience[]>('/api/public/workexperiences');
    return response.data;
  },

  getWorkExperienceById: async (id: string) => {
    const response = await axiosInstance.get<WorkExperience>(`/api/public/workexperiences/${id}`);
    return response.data;
  },

  createWorkExperience: async (workExperience: WorkExperienceInput) => {
    const response = await axiosInstance.post<WorkExperience>('/api/admin/workexperiences', workExperience);
    return response.data;
  },

  updateWorkExperience: async (id: string, workExperience: WorkExperienceInput) => {
    const response = await axiosInstance.put<WorkExperience>(`/api/admin/workexperiences/${id}`, workExperience);
    return response.data;
  },

  deleteWorkExperience: async (id: string) => {
    await axiosInstance.delete(`/api/admin/workexperiences/${id}`);
  },
};
