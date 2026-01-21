export interface Education {
    educationId: string;
    school: string;
    degree: string;
    description: string;
    startDate: string; // ISO Date
    endDate?: string; // ISO Date
    isCurrentlyStudying: boolean;
  }
  
  export type EducationInput = Omit<Education, 'educationId'>;
