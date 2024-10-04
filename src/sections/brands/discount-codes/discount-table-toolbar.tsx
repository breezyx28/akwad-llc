import type { IBrandTableFilters } from 'src/types/brand';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import React, { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { ListSubheader } from '@mui/material';
import { IDiscountCodeTableFilters } from 'src/types/discount-code';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IDiscountCodeTableFilters>;
  options: {
    filters: Record<any, any>;
  };
};

export function DiscountCodeTableToolbar({ filters, options, onResetPage }: Props) {
  const popover = usePopover();

  // Handle filtering based on selected options from the dropdown
  const handleFilter = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ filter: newValue });
    },
    [filters, onResetPage]
  );

  // Handle the name filter (search)
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="discount-codes-filter-select-label">Filter</InputLabel>
        <Select
          multiple
          value={filters.state.filter}
          onChange={handleFilter}
          input={<OutlinedInput label="Filter" />}
          renderValue={(selected) => selected.join(', ')} // Render selected values as comma-separated
          inputProps={{ id: 'discount-codes-filter-select-label' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {options.filters.map((filterObject: any) => {
            const entries: JSX.Element[] = [];

            Object.entries(filterObject).forEach(([category, categoryOptions]) => {
              entries.push(
                <ListSubheader
                  key={category}
                  sx={{
                    color: 'black',
                    fontWeight: '500',
                    fontSize: '14px',
                    textTransform: 'capitalize',
                  }}
                >
                  {category}
                </ListSubheader>
              );

              if (Array.isArray(categoryOptions)) {
                categoryOptions.forEach((option: any) => {
                  entries.push(
                    <MenuItem key={option} value={option}>
                      <Checkbox
                        disableRipple
                        size="small"
                        checked={filters.state.filter.includes(option)} // Ensure correct comparison
                      />
                      {option}
                    </MenuItem>
                  );
                });
              }
            });

            return entries;
          })}
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.state.name}
          onChange={handleFilterName}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </Stack>
  );
}
