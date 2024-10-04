import { IBrandItem } from './brand';
// ----------------------------------------------------------------------

export type IDiscountCodeTableFilters = {
  name: string;
  description: string;
  coupon: string;
  brand?: Record<any, any>;
  status: boolean;
  uses?: number | null;
  filter: any[];
  [rest: string]: any | unknown;
};

export type IDiscountCodeItem = {
  id: any;
  name: string;
  description: string;
  brand_id: number;
  keywords: string;
  coupon: string;
  uses: number;
  status: number | boolean;
  created_at?: string;
  updated_at?: string;
  brand?: IBrandItem;
};
