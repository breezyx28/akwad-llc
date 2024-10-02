import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
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
        path: paths.dashboard.users.list,
        icon: ICONS.user,
        children: [
          { title: 'List', path: paths.dashboard.users.root },
          { title: 'User Suggestions', path: paths.dashboard.users.suggestions },
          { title: 'Search Logs', path: paths.dashboard.users.searchLogs },
        ],
      },
    ],
  },
];
