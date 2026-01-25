export interface Skill {
  skillId: string;
  title: string;
  description: string;
  type: 'frontend' | 'backend' | 'other';
}

export type SkillInput = Omit<Skill, 'skillId'>;
