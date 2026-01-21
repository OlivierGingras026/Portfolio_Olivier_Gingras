import axiosInstance from '../../../shared/api/axiosInstance';
import type { Hobby, HobbyInput } from '../types';

export const hobbiesAPI = {
  getAllHobbies: async () => {
    const response = await axiosInstance.get<Hobby[]>('/api/public/hobbies');
    return response.data;
  },

  getHobbyById: async (id: string) => {
    const response = await axiosInstance.get<Hobby>(`/api/public/hobbies/${id}`);
    return response.data;
  },

  createHobby: async (hobby: HobbyInput) => {
    const response = await axiosInstance.post<Hobby>('/api/admin/hobbies', hobby);
    return response.data;
  },

  updateHobby: async (id: string, hobby: HobbyInput) => {
    const response = await axiosInstance.put<Hobby>(`/api/admin/hobbies/${id}`, hobby);
    return response.data;
  },

  deleteHobby: async (id: string) => {
    await axiosInstance.delete(`/api/admin/hobbies/${id}`);
  },
};
