'use client';

import { useState, useCallback } from 'react';

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

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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

import { UserTableRow } from './user-table-row';
import { Stack, Typography } from '@mui/material';
import { DashboardApplicationsTableRow } from './dashboard-applications-table-row';
import { IApplicationItem, IApplicationTableFilters } from 'src/types/application';
import { string } from 'zod';
import { _applicationList } from 'src/_mock/_application';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'brand', label: 'Brand' },
  { id: 'numberOfUsers', label: 'Number of users', width: 180 },
  { id: 'numberOfDownloads', label: 'Number of downloads', width: 220 },
  { id: 'numberOfSessions', label: 'Number of sessions', width: 220 },
  { id: 'visits', label: 'Visits', width: 180 },
  { id: 'usageProcesses', label: 'Usage processes', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function DashboardApplicationsListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IApplicationItem[]>(_applicationList);

  const filters = useSetState<IApplicationTableFilters>({
    brand: '',
    numberOfUsers: 0,
    avatarUrl: '',
    numberOfDownloads: 0,
    numberOfSessions: 0,
    visits: 0,
    usageProcesses: 0,
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.brand ||
    !!filters.state.numberOfDownloads ||
    !!filters.state.numberOfUsers ||
    !!filters.state.numberOfSessions ||
    !!filters.state.usageProcesses ||
    !!filters.state.visits;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      // show put code here
    },
    [router]
  );

  return (
    <>
      <Card>
        <Box
          sx={{ p: 2.5 }}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography variant="h6">Applications</Typography>
          <Button
            component={RouterLink}
            href={'#'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add new app
          </Button>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
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
                    dataFiltered.map((row) => row.id)
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
                    <DashboardApplicationsTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IApplicationItem[];
  filters: IApplicationTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const {
    brand,
    numberOfDownloads,
    numberOfSessions,
    numberOfUsers,
    usageProcesses,
    visits,
    avatarUrl,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (brand) {
    inputData = inputData.filter(
      (user) => user.brand.toLowerCase().indexOf(brand.toLowerCase()) !== -1
    );
  }

  if (numberOfDownloads) {
    inputData = inputData.filter(
      (application) => application.numberOfDownloads === numberOfDownloads
    );
  }
  if (numberOfSessions) {
    inputData = inputData.filter(
      (application) => application.numberOfSessions === numberOfSessions
    );
  }
  if (numberOfUsers) {
    inputData = inputData.filter((application) => application.numberOfUsers === numberOfUsers);
  }
  if (usageProcesses) {
    inputData = inputData.filter((application) => application.usageProcesses === usageProcesses);
  }
  if (visits) {
    inputData = inputData.filter((application) => application.visits === visits);
  }

  return inputData;
}
