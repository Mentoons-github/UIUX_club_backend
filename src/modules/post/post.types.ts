export interface PostMedia {
  url: string;
  type: "image" | "video";
}

export interface Post {
  _id: string;
  author: string;
  caption?: string;
  media: PostMedia[];
  tags?: string[];
  visibility: "public" | "private";
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostContent {
  caption: string;
  media: PostMedia[];
  tags: string[];
}

export interface CreatePostInput {
  caption: string;
  tags: string[];
  media: Express.Multer.File[];
}
