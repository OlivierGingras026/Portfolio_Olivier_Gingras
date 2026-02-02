export interface WorkExperience {
    workExperienceId: string;
    company: string;
    companyFr?: string;
    position: string;
    positionFr?: string;
    description: string;
    descriptionFr?: string;
    startDate: string; // ISO Date / YYYY-MM-DD
    endDate?: string; // ISO Date / YYYY-MM-DD
    isCurrent: boolean;
  }
  
  export type WorkExperienceInput = Omit<WorkExperience, 'workExperienceId'>;
