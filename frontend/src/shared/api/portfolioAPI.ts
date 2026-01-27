import axiosInstance from './axiosInstance';
import type { Skill } from '../../features/skills/types';
import type { Project } from '../../features/projects/types';
import type { WorkExperience } from '../../features/workExperience/types';
import type { Education } from '../../features/education/types';
import type { Hobby } from '../../features/hobbies/types';
import type { Testimonial } from '../../features/testimonials/api/testimonialAPI';

/**
 * Unified API to fetch all portfolio data at once
 * This reduces the number of HTTP requests from 8+ to 1
 */

export interface PortfolioData {
  skills: Skill[];
  projects: Project[];
  workExperiences: WorkExperience[];
  educationList: Education[];
  hobbies: Hobby[];
  testimonials: Testimonial[];
}

// Simple in-memory cache
let cachedData: PortfolioData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const portfolioAPI = {
  /**
   * Fetch all portfolio data in parallel
   * Returns cached data if available and not expired
   */
  async getAllPortfolioData(): Promise<PortfolioData> {
    // Check if cache is still valid
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
      return cachedData;
    }

    try {
      // Fetch all data in parallel
      const [skillsRes, projectsRes, workExperiencesRes, educationRes, hobbiesRes, testimonialsRes] = await Promise.all([
        axiosInstance.get('/api/public/skills'),
        axiosInstance.get('/api/public/projects'),
        axiosInstance.get('/api/public/workexperiences'),
        axiosInstance.get('/api/public/educations'),
        axiosInstance.get('/api/public/hobbies'),
        axiosInstance.get('/api/v1/testimonials/approved'),
      ]);

      cachedData = {
        skills: skillsRes.data,
        projects: projectsRes.data,
        workExperiences: workExperiencesRes.data,
        educationList: educationRes.data,
        hobbies: hobbiesRes.data,
        testimonials: testimonialsRes.data,
      };

      cacheTimestamp = Date.now();
      return cachedData;
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      throw error;
    }
  },

  /**
   * Invalidate the cache (call this after mutations)
   */
  invalidateCache(): void {
    cachedData = null;
    cacheTimestamp = 0;
  },

  /**
   * Force refresh the cache
   */
  async refreshCache(): Promise<PortfolioData> {
    this.invalidateCache();
    return this.getAllPortfolioData();
  },
};
