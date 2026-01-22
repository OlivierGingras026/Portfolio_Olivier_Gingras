// Request Models
export interface CreateProjectRequest {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  projectId: string;
}

export interface CreateSkillRequest {
  title: string;
  description: string;
}

export interface UpdateSkillRequest extends CreateSkillRequest {
  skillId: string;
}

export interface CreateWorkExperienceRequest {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface UpdateWorkExperienceRequest extends CreateWorkExperienceRequest {
  workExperienceId: string;
}

export interface CreateEducationRequest {
  school: string;
  degree: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
}

export interface UpdateEducationRequest extends CreateEducationRequest {
  educationId: string;
}

export interface CreateHobbyRequest {
  title: string;
  description: string;
  imageUrl: string;
}

export interface UpdateHobbyRequest extends CreateHobbyRequest {
  hobbyId: string;
}

// Response Models
export interface ProjectResponse {
  projectId: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export interface SkillResponse {
  skillId: string;
  title: string;
  description: string;
}

export interface WorkExperienceResponse {
  workExperienceId: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface EducationResponse {
  educationId: string;
  school: string;
  degree: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
}

export interface HobbyResponse {
  hobbyId: string;
  title: string;
  description: string;
  imageUrl: string;
}

// Generic type unions for easier switching
export type CreateRequest = 
  | CreateProjectRequest 
  | CreateSkillRequest 
  | CreateWorkExperienceRequest 
  | CreateEducationRequest 
  | CreateHobbyRequest;

export type UpdateRequest = 
  | UpdateProjectRequest 
  | UpdateSkillRequest 
  | UpdateWorkExperienceRequest 
  | UpdateEducationRequest 
  | UpdateHobbyRequest;

export type ApiResponse = 
  | ProjectResponse 
  | SkillResponse 
  | WorkExperienceResponse 
  | EducationResponse 
  | HobbyResponse;
