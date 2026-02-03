import axiosInstance from "../../../shared/api/axiosInstance";

export interface CVFile {
  cvId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
  isFrench: boolean;
}

export const cvAPI = {
  getActiveCV: async (isFrench: boolean = false): Promise<CVFile | null> => {
    try {
      const response = await axiosInstance.get('/api/v1/cv', {
        params: { isFrench }
      });
      return response.data;
    } catch (error: any) {
      // Return null if CV doesn't exist (404) instead of throwing
      if (error?.response?.status === 404) {
        return null;
      }
      // Don't throw for 404, but throw other errors
      if (error?.response?.status && error.response.status !== 404) {
        throw error;
      }
      return null; // Fallback for any network error
    }
  },

  downloadCV: async (cvId: string, fileName: string = 'CV.pdf'): Promise<void> => {
    const response = await axiosInstance.get(`/api/v1/cv/download/${cvId}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
  },

  uploadCV: async (file: File, isFrench: boolean = false): Promise<CVFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isFrench', isFrench.toString());

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
  },

  getAllCVs: async (): Promise<CVFile[]> => {
    const response = await axiosInstance.get('/api/v1/cv/all');
    return response.data;
  },

  activateCV: async (cvId: string): Promise<CVFile> => {
    const response = await axiosInstance.put(`/api/v1/cv/${cvId}/activate`);
    return response.data;
  },

  updateCVLanguage: async (cvId: string, isFrench: boolean): Promise<CVFile> => {
    const response = await axiosInstance.put(`/api/v1/cv/${cvId}/language`, null, {
      params: { isFrench }
    });
    return response.data;
  },

  updateCVFile: async (cvId: string, file: File, isFrench: boolean = false): Promise<CVFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isFrench', isFrench.toString());

    const response = await axiosInstance.put(`/api/v1/cv/${cvId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
