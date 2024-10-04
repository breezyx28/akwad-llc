'use client';

import type { IUserItem, IUserTableFilters } from 'src/types/user';

import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserSuggestionsTableRow } from '../user-suggestions-table-row';
import { useGetUserSuggestions } from 'src/actions/user-suggestions';
import { IUserSuggestionsItem, IUserSuggestionsTableFilters } from 'src/types/user-suggestions';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'brand', label: 'Brand', width: 180 },
  { id: 'numberOfSuggestions', label: 'No. Of Suggestions' },
];

// ----------------------------------------------------------------------

export function UserSuggestionsListView() {
  const { userSuggestions } = useGetUserSuggestions();

  console.log('user-suggestions-data: ', userSuggestions);

  const table = useTable();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IUserSuggestionsItem[]>([]);

  const filters = useSetState<IUserSuggestionsTableFilters>({ name: '', count: 0 });

  // -------------------------------------
  // set data when ready
  React.useEffect(() => {
    if (userSuggestions?.length > 0) {
      setTableData(userSuggestions);
    }
  }, [userSuggestions]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.name || !!filters.state.count;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="User Suggestions"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.users.root },
            { name: 'User Suggestions' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'#'}
              variant="soft"
              endIcon={<Iconify icon="solar:calendar-mark-bold-duotone" />}
            >
              This month
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.name)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.name)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserSuggestionsTableRow
                        key={row.name}
                        row={row}
                        selected={table.selected.includes(row.name)}
                        onSelectRow={() => table.onSelectRow(row.name)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IUserSuggestionsItem[];
  filters: IUserSuggestionsTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, count } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (userSuggestions) => userSuggestions.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (count) {
    inputData = inputData.filter((userSuggestions) => userSuggestions.count === count);
  }

  return inputData;
}
