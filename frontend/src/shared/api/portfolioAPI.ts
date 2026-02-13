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

// Cache invalidation listeners
const cacheInvalidationListeners = new Set<() => void>();

// Prevent infinite refresh loops with debounce
let isRefreshing = false;
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

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
   * This triggers background refresh with debounce
   */
  invalidateCache(): void {
    cachedData = null;
    cacheTimestamp = 0;

    // Clear pending refresh
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    // Debounce the refresh to avoid cascade
    refreshTimeout = setTimeout(() => {
      if (!isRefreshing) {
        isRefreshing = true;
        this.getAllPortfolioData()
          .then(() => {
            // Notify listeners only after successful refresh
            cacheInvalidationListeners.forEach(listener => {
              try {
                listener();
              } catch (err) {
                console.error('Error in cache invalidation listener:', err);
              }
            });
          })
          .catch(err => {
            console.error('Failed to refresh cache:', err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
    }, 300); // 300ms debounce
  },

  /**
   * Subscribe to cache invalidation events
   */
  onCacheInvalidated(callback: () => void): () => void {
    cacheInvalidationListeners.add(callback);
    return () => {
      cacheInvalidationListeners.delete(callback);
    };
  },
};