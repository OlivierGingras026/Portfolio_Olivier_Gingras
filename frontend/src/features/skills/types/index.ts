export interface Skill {
  skillId: string;
  title: string;
  description: string;
}

export type SkillInput = Omit<Skill, 'skillId'>;
