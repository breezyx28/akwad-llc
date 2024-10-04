'use client';

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
import { _discountCodesFilter, _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

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

import { DiscountCodeTableRow } from '../discount-code-table-row';
import { DiscountCodeTableToolbar } from '../discount-table-toolbar';
import { DiscountCodesTableFiltersResult } from '../discount-codes-table-filters-result';
import { AddDiscountCodeFormDialog } from '../add-discount-code-form-dialog';
import { IDiscountCodeItem, IDiscountCodeTableFilters } from 'src/types/discount-code';
import { useGetDiscountCodes } from 'src/actions/discount-codes';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'brand', label: 'Brand', width: 180 },
  { id: 'name', label: 'Name' },
  { id: 'coupon', label: 'Coupon', width: 220 },
  { id: 'description', label: 'Description', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'usage', label: 'Usage' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function DiscountCodesListView() {
  const { discountCodes, discountCodesLoading } = useGetDiscountCodes();

  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IDiscountCodeItem[]>([]);

  const filters = useSetState<IDiscountCodeTableFilters>({
    name: '',
    coupon: '',
    category: {},
    filter: [],
    description: '',
    uses: null,
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
    !!filters.state.coupon ||
    !!filters.state.description ||
    !!filters.state.brand?.name ||
    // filters.state.filter.includes() ||
    filters.state.uses !== null;
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
    if (discountCodes) {
      setTableData(discountCodes);
    }
  }, [discountCodes]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Discount Codes"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Users', href: paths.dashboard.users.root },
            { name: 'discount Codes' },
          ]}
          action={<AddDiscountCodeFormDialog />}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <DiscountCodeTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ filters: _discountCodesFilter }}
          />

          {canReset && (
            <DiscountCodesTableFiltersResult
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
                      <DiscountCodeTableRow
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
  inputData: IDiscountCodeItem[];
  filters: IDiscountCodeTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, description, uses, filter } = filters;

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
      (discountCode) => discountCode.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // Apply the description filter
  if (description) {
    inputData = inputData.filter(
      (discountCode) =>
        discountCode.description.toLowerCase().indexOf(description.toLowerCase()) !== -1
    );
  }

  // Apply the status filter
  if (status) {
    inputData = inputData.filter((discountCode) => discountCode.status === status);
  }

  if (uses) {
    inputData = inputData.filter((discountCode) => discountCode.uses === uses);
  }

  // Apply the filter from the Select menu
  if (filter.length) {
    inputData = inputData.filter((discountCode) =>
      filter.some((f) => {
        const isActiveFilter = f.toLowerCase() === 'variable ✅';
        const isInactiveFilter = f.toLowerCase() === 'none-variable 😴';

        console.log('filter: ', f.toLowerCase());

        return (
          discountCode.name.toLowerCase().includes(f.toLowerCase()) ||
          discountCode.description.toLowerCase().includes(f.toLowerCase()) ||
          discountCode.brand?.name.toLowerCase().includes(f.toLowerCase()) ||
          (isActiveFilter && discountCode.status === 1) || // Check if the discountCode is active
          (isInactiveFilter && discountCode.status === 0) // Check if the discountCode is inactive
        );
      })
    );
  }

  return inputData;
}
