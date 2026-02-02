export interface Education {
    educationId: string;
    school: string;
    schoolFr?: string;
    degree: string;
    degreeFr?: string;
    description: string;
    descriptionFr?: string;
    startDate: string; // ISO Date
    endDate?: string; // ISO Date
    isCurrentlyStudying: boolean;
  }
  
  export type EducationInput = Omit<Education, 'educationId'>;
