// ----------------------------------------------------------------------

import { IBrandItem } from './brand';

export type IBannerTableFilters = {
  brand?: IBrandItem | null;
  type: string;
  expiry_date: string;
  link: string;
  clicks?: number | null;
};

export type IBannerItem = {
  id: any;
  image?: string | null;
  brand_id: number | null;
  type: string;
  clicks: number;
  link?: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  brand?: IBrandItem;
};
