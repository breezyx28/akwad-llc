import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  users: icon('ic-user'),
  kanban: icon('ic-kanban'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: '',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: 'Brands',
        path: paths.dashboard.brand.root,
        icon: ICONS.kanban,
        children: [
          { title: 'List', path: paths.dashboard.brand.root },
          { title: 'Discount Codes', path: paths.dashboard.brand.discountCodes },
          { title: 'Banners', path: paths.dashboard.brand.banners },
        ],
      },
      {
        title: 'Users',
        path: paths.dashboard.users.root,
        icon: ICONS.users,
        children: [
          { title: 'List', path: paths.dashboard.users.root },
          { title: 'User Suggestions', path: paths.dashboard.users.suggestions },
          { title: 'Search Logs', path: paths.dashboard.users.searchLogs },
        ],
      },
    ],
  },
];
