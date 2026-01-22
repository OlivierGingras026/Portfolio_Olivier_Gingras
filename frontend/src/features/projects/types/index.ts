export interface Project {
  projectId: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  technologies?: string[];
}

export type ProjectInput = Omit<Project, 'projectId'>;
