import axiosInstance from "../../../shared/api/axiosInstance";

export interface CVFile {
  cvId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
}

export const cvAPI = {
  getActiveCV: async (): Promise<CVFile> => {
    const response = await axiosInstance.get('/api/v1/cv');
    return response.data;
  },

  downloadCV: async (cvId: string): Promise<void> => {
    const response = await axiosInstance.get(`/api/v1/cv/download/${cvId}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CV.pdf');
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
  },

  uploadCV: async (file: File): Promise<CVFile> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/api/v1/cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deactivateCV: async (cvId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/cv/${cvId}`);
  },

  deleteCV: async (cvId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/cv/${cvId}`);
  }
};
