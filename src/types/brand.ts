import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IBrandTableFilters = {
  name: string;
  description: string;
  link: string;
  category?: Record<any, any>;
  status: boolean;
  filter: any[];
  [rest: string]: any | unknown;
};

export type IBrandProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IBrandProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IBrandProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IBrandProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IBrandProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IBrandProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IBrandCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IBrandItem = {
  id: string;
  name: string;
  description: string;
  websiteLink?: string;
  applicationLink?: string;
  visits: number;
  category_id?: any;
  category?: Record<any, any>;
  status?: boolean | number;
  link: string;
  image?: string;
  opend: boolean;
  created_at?: string;
  updated_at?: string;
  codes?: any[];
  [index: string]: any | unknown;
};

export type IBrandAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export type IBrandAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};

export type IBannerItem = {
  id: number;
  name: string;
  description: string;
  category_id: 1;
  keywords: string;
  link: string;
  image?: string;
  opend: boolean;
  status: boolean;
  created_at: string;
  updated_at: string;
  codes?: string[];
};
