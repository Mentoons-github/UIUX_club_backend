import { SHOWCASE_CATEGORIES } from "./designShowcase.constants";

export interface ILinkPreview {
  title: string;
  url: string;
  description?: string;
  image?: {
    url: string;
    type?: string;
    width?: number;
    height?: number;
  };
  logo?: {
    url: string;
  };
  publisher?: string;
  author?: string | null;
}

export type ShowcaseCategory = (typeof SHOWCASE_CATEGORIES)[number];

export interface IDesignShowcase {
  caption?: string;
  thumbnail?: string;
  user?: string;
  images?: string[];
  videoUrl: string[];
  tools?: string[];
  category?: ShowcaseCategory;
  linkPreview?: ILinkPreview;
  likeCount: number;
  feedbackCount: number;
  createdAt: Date;
  updatedAt: Date;
}
