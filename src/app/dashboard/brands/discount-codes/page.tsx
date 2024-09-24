import { CONFIG } from 'src/config-global';
import { DiscountCodesListView } from 'src/sections/brands/discount-codes/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Brand Discount Codes | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <DiscountCodesListView />;
}
