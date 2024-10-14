'use client';
import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { svgIconClasses } from '@mui/material/SvgIcon';

import { useTabs } from 'src/hooks/use-tabs';

import { fData, fCurrency, fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { _mock, _topSearch } from 'src/_mock';
import { SEARCH_LOGS_ENDPOINT } from 'src/actions/search-logs';
import { authedFetcher } from 'src/utils/axios';
import { toast } from 'sonner';
import { useState } from 'react';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'brands', label: 'Top Brands' },
  { value: 'search', label: 'Top Search' },
  { value: 'categories', label: 'Top Categories' },
];

// ----------------------------------------------------------------------

type SearchItem = {
  name: string;
  count: number | number;
};
type BrandItem = {
  brand_name: string;
  brand_id: number;
  total_opens: number;
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    name: string;
    size: number;
    price: number;
    shortcut: string;
    downloaded: number;
    ratingNumber: number;
    totalReviews: number;
  }[];
  top?: {
    brands?: Array<Record<string, unknown>> | [];
    search?: SearchItem[] | [];
  };
};
type TopSearchProps = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id?: string | number;
    name: string;
    count: number;
  }[];
};
type TopCategoriesProps = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    name: string;
    size: number;
    price: number;
    shortcut: string;
    downloaded: number;
    ratingNumber: number;
    totalReviews: number;
  }[];
};

export function DashboardTopPerformance({ title, subheader, list, top, ...other }: Props) {
  const tabs = useTabs('brands');

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {TABS.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      {renderTabs}

      <Scrollbar sx={{ minHeight: 384 }}>
        {tabs.value === 'brands' && (
          <Box sx={{ p: 3, gap: 3, minWidth: 360, display: 'flex', flexDirection: 'column' }}>
            {top?.brands?.map((item) => (
              <TopBrandsItem key={item.brand_id as any} item={item as any} />
            ))}
          </Box>
        )}
        {tabs.value === 'search' && (
          <Box sx={{ p: 3, gap: 6, minWidth: 360, display: 'flex', flexDirection: 'column' }}>
            {top?.search?.map((item, index) => <TopSearchsItem key={index} item={item} />)}
          </Box>
        )}
        {tabs.value === 'categories' && (
          <Box sx={{ p: 3, gap: 3, minWidth: 360, display: 'flex', flexDirection: 'column' }}>
            {list.map((item) => (
              <TopCategoriesItem key={item.id} item={item} />
            ))}
          </Box>
        )}
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: BrandItem;
};

function TopBrandsItem({ item, sx, ...other }: ItemProps) {
  return (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
      <Avatar
        variant="rounded"
        src={_mock.image.avatar(item.brand_id)}
        sx={{
          p: 1,
          width: 48,
          height: 48,
          bgcolor: 'background.neutral',
        }}
      />

      <div>
        <Box sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {item.brand_name}
          </Typography>

          {/* <Label color={item.price === 0 ? 'default' : 'success'} sx={{ height: 20 }}>
            {item.price === 0 ? 'Free' : fCurrency(item.price)}
          </Label> */}
        </Box>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          divider={
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
          }
          sx={{ typography: 'caption' }}
        >
          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify width={16} icon="solar:download-bold" sx={{ color: 'text.disabled' }} />
            {fShortenNumber(item.total_opens)}
          </Box>

          {/* <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify width={16} icon="heroicons:server-solid" sx={{ color: 'text.disabled' }} />
            {fData(item.size)}
          </Box> */}
        </Stack>
      </div>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TopSearchItemProps = BoxProps & {
  item: SearchItem;
};

function TopSearchsItem({ key, item, sx, ...other }: TopSearchItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" noWrap>
          #{key}
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {item.name}
        </Typography>
      </Box>
      <Typography variant="caption" noWrap>
        {item.count}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TopCategoriesItemProps = BoxProps & {
  item: TopCategoriesProps['list'][number];
};

function TopCategoriesItem({ item, sx, ...other }: TopCategoriesItemProps) {
  return (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
      <Avatar
        variant="rounded"
        src={item.shortcut}
        sx={{
          p: 1,
          width: 48,
          height: 48,
          bgcolor: 'background.neutral',
        }}
      />

      <div>
        <Box sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {item.name}
          </Typography>

          <Label color={item.price === 0 ? 'default' : 'success'} sx={{ height: 20 }}>
            {item.price === 0 ? 'Free' : fCurrency(item.price)}
          </Label>
        </Box>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          divider={
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
          }
          sx={{ typography: 'caption' }}
        >
          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify width={16} icon="heroicons:server-solid" sx={{ color: 'text.disabled' }} />
            {fData(item.size)}
          </Box>
        </Stack>
      </div>
    </Box>
  );
}
