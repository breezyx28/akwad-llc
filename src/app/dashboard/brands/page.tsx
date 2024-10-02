import { CONFIG } from 'src/config-global';
import { BrandListView } from 'src/sections/brands/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Brands | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BrandListView />;
}