export interface Hobby {
    hobbyId: string;
    title: string;
    titleFr?: string;
    description: string;
    descriptionFr?: string;
    imageUrl: string;
  }
  
  export type HobbyInput = Omit<Hobby, 'hobbyId'>;
