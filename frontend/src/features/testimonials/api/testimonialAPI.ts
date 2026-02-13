import axiosInstance from "../../../shared/api/axiosInstance";

export interface Testimonial {
  testimonialId: string;
  name: string;
  title: string;
  titleFr?: string;
  company?: string;
  companyFr?: string;
  rating: number;
  message: string;
  messageFr?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured?: boolean;
  createdAt: string;
}

export interface TestimonialRequest {
  name: string;
  title: string;
  company?: string;
  rating: number;
  message: string;
}

export const testimonialAPI = {
  submitTestimonial: async (data: TestimonialRequest): Promise<Testimonial> => {
    const response = await axiosInstance.post('/api/v1/testimonials/submit', data);
    return response.data;
  },

  getApprovedTestimonials: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get('/api/v1/testimonials/approved');
    return response.data;
  },

  getFeaturedTestimonials: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get('/api/v1/testimonials/featured');
    return response.data;
  },

  getAllTestimonials: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get('/api/v1/testimonials');
    return response.data;
  },

  getPendingTestimonials: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get('/api/v1/testimonials/pending');
    return response.data;
  },

  approveTestimonial: async (testimonialId: string): Promise<void> => {
    await axiosInstance.put(`/api/v1/testimonials/${testimonialId}/approve`);
  },

  rejectTestimonial: async (testimonialId: string): Promise<void> => {
    await axiosInstance.put(`/api/v1/testimonials/${testimonialId}/reject`);
  },

  toggleFeaturedTestimonial: async (testimonialId: string, isFeatured: boolean): Promise<void> => {
    await axiosInstance.put(`/api/v1/testimonials/${testimonialId}/featured`, { isFeatured });
  },

  deleteTestimonial: async (testimonialId: string): Promise<void> => {
    await axiosInstance.delete(`/api/v1/testimonials/${testimonialId}`);
  }
};