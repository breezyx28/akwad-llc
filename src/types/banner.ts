import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IBannerTableFilters = {
  name: string;
  filter: string[];
  status: string;
};

export type IBannerProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IBannerProfile = {
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

export type IBannerProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IBannerProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IBannerProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IBannerProfilePost = {
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

export type IBannerCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IBannerAccount = {
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

export type IBannerAccountBillingHistory = {
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
