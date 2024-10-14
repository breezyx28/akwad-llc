'use client';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { DashboardTopPerformance } from '../dashboard-top-performance';
import { DashboardApplicationsListView } from '../dashboard-application-list-view';
import { TotalIntallsOverview } from '../total-installs-overview';
import { Iconify } from 'src/components/iconify';
import DatePickerButton from 'src/components/button/date-button';
import { SEARCH_LOGS_ENDPOINT } from 'src/actions/search-logs';
import { BRAND_ENDPOINT } from 'src/actions/brands';
import { toast } from 'sonner';
import { authedFetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function OverviewDashboardView() {
  const [topSearch, setTopSearch] = useState<[] | { name: string; count: number | string }[]>([]);
  const [topBrands, setTopBrands] = useState<
    [] | { brand_name: string; brand_id: number; total_opens: number }[]
  >([]);

  // Memoize the handleDateChange function using useCallback
  const handleDateChange = useCallback(async (startDate: string | null, endDate: string | null) => {
    try {
      let topSearchData = await getTopSearchSSR(`start_date=${startDate}&end_date=${endDate}`);
      if (topSearchData) {
        setTopSearch(topSearchData);
      }

      let topBrandsData = await getTopBrandsSSR(`start_date=${startDate}&end_date=${endDate}`);
      if (topBrandsData) {
        setTopBrands(topBrandsData);
      }
    } catch (error) {
      console.error('Error in handleDateChange:', error);
    }
  }, []); // No dependencies means this function will remain stable across renders

  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" sx={{ width: '100%' }}>
        <Box display={'flex'} justifyContent={'end'} sx={{ flexGrow: 1 }}>
          <DatePickerButton onDateChange={handleDateChange} />
        </Box>
      </Stack>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Sessions"
            percent={2.6}
            total={714000}
            icon={<img alt="icon" src={`/assets/icons/glass/ic-glass-message.svg`} />}
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
            icon={<img alt="icon" src={`/assets/icons/glass/ic-glass-unique-users.svg`} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Registered Users"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src={`/assets/icons/glass/ic-glass-registered-users.svg`} />}
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
            icon={<img alt="icon" src={`/assets/icons/glass/ic-glass-bag.svg`} />}
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
          <DashboardTopPerformance
            title="Top Performance"
            list={[]}
            top={{
              brands: topBrands,
              search: topSearch as any,
            }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <DashboardApplicationsListView />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

// Fetch Top Search Data
async function getTopSearchSSR(dateData: any) {
  const config = {};

  const url = `${SEARCH_LOGS_ENDPOINT.top}?${dateData}`;

  try {
    const data = await authedFetcher([url, config]); // Await the result
    return data?.data ?? [];
  } catch (error) {
    toast.error(error.error || error.message || 'Something went wrong');
    console.error('Error fetching data:', error); // Handle any error
  }
}

// Fetch Top Brands Data
async function getTopBrandsSSR(dateData: any) {
  const config = {};

  const url = `${BRAND_ENDPOINT.top}?${dateData}`;

  try {
    const data = await authedFetcher([url, config]); // Await the result
    return data?.data ?? [];
  } catch (error) {
    toast.error(error.error || error.message || 'Something went wrong');
    console.error('Error fetching data:', error); // Handle any error
  }
}
