import axiosInstance from "../../../shared/api/axiosInstance";


export interface ContactMessage {
  messageId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

export interface ReachMeProfile {
  profileId: string;
  email: string;
  basedIn: string;
  availabilityStatus: string;
  availabilityStatusFr: string;
}

export const contactAPI = {
  // Submit contact message
  sendMessage: async (data: ContactMessageRequest): Promise<ContactMessage> => {
    const response = await axiosInstance.post('/api/v1/contact/send', data);
    return response.data;
  },

  // Get all messages (admin)
  getAllMessages: async (): Promise<ContactMessage[]> => {
    const response = await axiosInstance.get('/api/v1/contact');
    return response.data;
  },

  // Delete message (admin)
  deleteMessage: async (messageId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/contact/${messageId}`);
  },

  // Mark message as read (admin)
  markAsRead: async (messageId: string): Promise<void> => {
    await axiosInstance.put(`/api/v1/contact/${messageId}/mark-as-read`);
  }
};

export const reachMeAPI = {
  // Get profile info (public)
  getProfile: async (): Promise<ReachMeProfile> => {
    const response = await axiosInstance.get('/api/v1/reachme');
    return response.data;
  },

  // Update profile info (admin)
  updateProfile: async (data: Omit<ReachMeProfile, 'profileId'>): Promise<ReachMeProfile> => {
    const response = await axiosInstance.put('/api/v1/reachme', data);
    return response.data;
  }
};
