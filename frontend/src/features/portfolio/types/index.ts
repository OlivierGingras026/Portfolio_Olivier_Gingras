export interface Project {
  projectId: string; // The backend uses UUIDs usually mapped to strings
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export interface WorkExperience {
  workExperienceId: string;
  company: string;
  position: string;
  description: string;
  startDate: string; // ISO Date
  endDate?: string; // ISO Date, null if current
  isCurrent: boolean;
}

export interface Education {
  educationId: string;
  school: string;
  degree: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
}

export interface Skill {
  skillId: string;
  title: string;
  description: string;
}

export interface Hobby {
  hobbyId: string;
  title: string;
  description: string;
  imageUrl: string;
}
