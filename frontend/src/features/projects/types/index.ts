export interface Project {
  projectId: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  url: string;
  imageUrl: string;
  technologies?: string[];
}

export type ProjectInput = Omit<Project, 'projectId'>;
