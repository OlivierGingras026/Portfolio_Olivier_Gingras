import axiosInstance from '../../../shared/api/axiosInstance';
import type { Skill, SkillInput } from '../types';

export const skillsAPI = {
  getAllSkills: async () => {
    const response = await axiosInstance.get<Skill[]>('/api/public/skills');
    return response.data;
  },

  getSkillById: async (id: string) => {
    const response = await axiosInstance.get<Skill>(`/api/public/skills/${id}`);
    return response.data;
  },

  createSkill: async (skill: SkillInput) => {
    const response = await axiosInstance.post<Skill>('/api/admin/skills', skill);
    return response.data;
  },

  updateSkill: async (id: string, skill: SkillInput) => {
    const response = await axiosInstance.put<Skill>(`/api/admin/skills/${id}`, skill);
    return response.data;
  },

  deleteSkill: async (id: string) => {
    await axiosInstance.delete(`/api/admin/skills/${id}`);
  },
};
