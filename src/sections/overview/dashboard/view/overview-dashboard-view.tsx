'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../dashboard-widget';
import { AppWelcome } from '../dashboard-welcome';
import { AppFeatured } from '../dashboard-featured';
import { BankingOverview } from '../banking-overview';
import { AppNewInvoice } from '../dashboard-new-invoice';
import { AppTopAuthors } from '../dashboard-top-authors';
import { AppAreaInstalled } from '../dashboard-area-installed';
import { AppWidgetSummary } from '../dashboard-widget-summary';
import { AppCurrentDownload } from '../dashboard-current-download';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { BankingBalanceStatistics } from '../banking-balance-statistics';
import { AppTopInstalledCountries } from '../dashboard-top-installed-countries';
import { Typography } from '@mui/material';
import { CONFIG } from 'src/config-global';
import { Iconify } from 'src/components/iconify';
import { UserListView } from '../user-list-view';
import { DashboardTopPerformance } from '../dashboard-top-performance';
import { DashboardApplicationsListView } from '../dashboard-application-list-view';
import { TotalIntallsOverview } from '../total-installs-overview';

// ----------------------------------------------------------------------

export function OverviewDashboardView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Sessions"
            percent={2.6}
            total={714000}
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-message.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Unique Users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-unique-users.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Registred Users"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-registered-users.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Installs"
            percent={3.6}
            total={234}
            color="error"
            icon={
              <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-bag.svg`} />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={7} lg={8}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <TotalIntallsOverview />
          </Box>
        </Grid>

        <Grid xs={12} md={5} lg={4}>
          <DashboardTopPerformance title="Top Performance" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <DashboardApplicationsListView />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
