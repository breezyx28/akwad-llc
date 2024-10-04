import { CONFIG } from 'src/config-global';

import { UserListView } from 'src/sections/users/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Users | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <UserListView />;
}
