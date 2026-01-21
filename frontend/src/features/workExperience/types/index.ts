export interface WorkExperience {
    workExperienceId: string;
    company: string;
    position: string;
    description: string;
    startDate: string; // ISO Date / YYYY-MM-DD
    endDate?: string; // ISO Date / YYYY-MM-DD
    isCurrent: boolean;
  }
  
  export type WorkExperienceInput = Omit<WorkExperience, 'workExperienceId'>;
