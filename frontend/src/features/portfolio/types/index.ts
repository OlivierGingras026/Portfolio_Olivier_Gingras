export interface Project {
  projectId: string; // The backend uses UUIDs usually mapped to strings
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  url: string;
  imageUrl: string;
}

export interface WorkExperience {
  workExperienceId: string;
  company: string;
  companyFr?: string;
  position: string;
  positionFr?: string;
  description: string;
  descriptionFr?: string;
  startDate: string; // ISO Date
  endDate?: string; // ISO Date, null if current
  isCurrent: boolean;
}

export interface Education {
  educationId: string;
  school: string;
  schoolFr?: string;
  degree: string;
  degreeFr?: string;
  description: string;
  descriptionFr?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
}

export interface Skill {
  skillId: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
}

export interface Hobby {
  hobbyId: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  imageUrl: string;
}
