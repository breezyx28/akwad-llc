// ----------------------------------------------------------------------

export type IUsersTableFilters = {
  id?: any;
  name: string;
  phone_number: string;
  age: number;
};

export type IUsersCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUsersItem = {
  id?: any;
  name: string;
  email: string;
  image?: string;
  phone_number: string;
  age: number;
  email_verified_at?: string;
  apple_id?: any;
  created_at?: string;
  updated_at?: string;
  [index: string]: unknown;
};
