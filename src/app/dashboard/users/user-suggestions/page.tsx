import { CONFIG } from 'src/config-global';
import { UserSuggestionsListView } from 'src/sections/users/user-suggestions/view/user-suggestions-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Users - User Suggestions | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UserSuggestionsListView />;
}
