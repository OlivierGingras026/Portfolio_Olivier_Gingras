import axiosInstance from '../../../shared/api/axiosInstance';
import type { Education, EducationInput } from '../types';

export const educationAPI = {
  getAllEducation: async () => {
    const response = await axiosInstance.get<Education[]>('/api/public/educations');
    return response.data;
  },

  getEducationById: async (id: string) => {
    const response = await axiosInstance.get<Education>(`/api/public/educations/${id}`);
    return response.data;
  },

  createEducation: async (education: EducationInput) => {
    const response = await axiosInstance.post<Education>('/api/admin/educations', education);
    return response.data;
  },

  updateEducation: async (id: string, education: EducationInput) => {
    const response = await axiosInstance.put<Education>(`/api/admin/educations/${id}`, education);
    return response.data;
  },

  deleteEducation: async (id: string) => {
    await axiosInstance.delete(`/api/admin/educations/${id}`);
  },
};
