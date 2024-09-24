import { CONFIG } from 'src/config-global';
import { BannersListView } from 'src/sections/brands/banners/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Brand Discount Codes | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BannersListView />;
}
