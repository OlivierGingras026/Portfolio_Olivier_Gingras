export interface Skill {
  skillId: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  type: 'frontend' | 'backend' | 'other';
}

export type SkillInput = Omit<Skill, 'skillId'>;
