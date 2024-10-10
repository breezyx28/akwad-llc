import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  signIn: '/sign-in',
  // comingSoon: '/coming-soon',
  // maintenance: '/maintenance',
  // pricing: '/pricing',
  // payment: '/payment',
  // about: '/about-us',
  // contact: '/contact-us',
  // faqs: '/faqs',
  // page403: '/error/403',
  // page404: '/error/404',
  // page500: '/error/500',
  // components: '/components',
  // docs: 'https://docs.minimals.cc',
  // changelog: 'https://docs.minimals.cc/changelog',
  // zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  // minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  // figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',

  // AUTH
  auth: {
    sanctum: {
      signIn: `/sign-in`,
      verify: `/verification`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      // list: `${ROOTS.DASHBOARD}/users/list`,
      suggestions: `${ROOTS.DASHBOARD}/users/user-suggestions`,
      searchLogs: `${ROOTS.DASHBOARD}/users/search-logs`,
    },
    brand: {
      root: `${ROOTS.DASHBOARD}/brands`,
      discountCodes: `${ROOTS.DASHBOARD}/brands/discount-codes`,
      banners: `${ROOTS.DASHBOARD}/brands/banners`,
    },
  },
};
