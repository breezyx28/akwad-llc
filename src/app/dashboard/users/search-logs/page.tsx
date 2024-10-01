import { CONFIG } from 'src/config-global';
import { SearchLogsListView } from 'src/sections/users/search-logs/view/search-logs-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Users - Search Logs | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <SearchLogsListView />;
}
