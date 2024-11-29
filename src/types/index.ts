export interface Post {
  id: string;
  title: string;
  slug: string;
  content: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  type: 'text' | 'image' | 'video' | 'button';
  content: any;
  order: number;
}