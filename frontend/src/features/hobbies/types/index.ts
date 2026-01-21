export interface Hobby {
    hobbyId: string;
    title: string;
    description: string;
    imageUrl: string;
  }
  
  export type HobbyInput = Omit<Hobby, 'hobbyId'>;
