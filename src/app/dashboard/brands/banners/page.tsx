import { CONFIG } from 'src/config-global';
import { BannersListView } from 'src/sections/brands/banners/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Brands - Banners | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BannersListView />;
}
