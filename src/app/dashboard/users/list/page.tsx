import { CONFIG } from 'src/config-global';

import { UserListView } from 'src/sections/users/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Users - list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UserListView />;
}
