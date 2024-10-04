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

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _brandFilter, _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

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

import { UserTableRow } from '../user-table-row';
import { BrandTableToolbar } from '../brand-table-toolbar';
import { BrandTableFiltersResult } from '../brand-table-filters-result';
import { IBrandItem, IBrandTableFilters } from 'src/types/brand';
import { _brandList } from 'src/_mock/_brand';
import { BrandTableRow } from '../brand-table-row';
import { AddBrandFormDialog } from '../add-brand-form-dialog';
import { useGetBrands } from 'src/actions/brands';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'brand', label: 'Brand' },
  { id: 'description', label: 'Description', width: 180 },
  { id: 'websiteLink', label: 'Website link', width: 220 },
  { id: 'applicationLink', label: 'Application link', width: 180 },
  { id: 'visits', label: 'Visits', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function BrandListView() {
  const { brands, brandsLoading } = useGetBrands();

  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IBrandItem[]>([]);

  const filters = useSetState<IBrandTableFilters>({
    name: '',
    link: '',
    category: {},
    filter: [],
    description: '',
    status: false,
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    !!filters.state.link ||
    !!filters.state.description ||
    !!filters.state.category?.name ||
    // filters.state.filter.includes() ||
    filters.state.status !== false;

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
      // router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  React.useEffect(() => {
    if (brands) {
      setTableData(brands);
    }
  }, [brands]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Brand', href: paths.dashboard.brand.root },
            { name: 'List' },
          ]}
          action={<AddBrandFormDialog />}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <BrandTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ filters: _brandFilter }}
          />

          {canReset && (
            <BrandTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

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
                      <BrandTableRow
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
      </DashboardContent>

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
  inputData: IBrandItem[];
  filters: IBrandTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, description, category, filter } = filters;

  // Sort data using the comparator
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  // Apply the name filter
  if (name) {
    inputData = inputData.filter(
      (brand) => brand.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // Apply the description filter
  if (description) {
    inputData = inputData.filter(
      (brand) => brand.description.toLowerCase().indexOf(description.toLowerCase()) !== -1
    );
  }

  // Apply the status filter
  if (status) {
    inputData = inputData.filter((brand) => brand.status === status);
  }

  // Apply the filter from the Select menu
  if (filter.length) {
    inputData = inputData.filter((brand) =>
      filter.some((f) => {
        const isActiveFilter = f.toLowerCase() === 'active ✅';
        const isInactiveFilter = f.toLowerCase() === 'inactive 😴';

        console.log('filter: ', f.toLowerCase());

        return (
          brand.name.toLowerCase().includes(f.toLowerCase()) ||
          brand.description.toLowerCase().includes(f.toLowerCase()) ||
          brand.category?.name.toLowerCase().includes(f.toLowerCase()) ||
          (isActiveFilter && brand.status === 1) || // Check if the brand is active
          (isInactiveFilter && brand.status === 0) // Check if the brand is inactive
        );
      })
    );
  }

  return inputData;
}
