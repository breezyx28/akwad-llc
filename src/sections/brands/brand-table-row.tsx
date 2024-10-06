import type { IUserItem } from 'src/types/user';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { BrandQuickEditForm } from './brand-quick-edit-form';
import { IBrandItem } from 'src/types/brand';
import { FormControlLabel, Switch } from '@mui/material';
import { deleteBrand, updateBrandStatus } from 'src/actions/brands';
import { useState } from 'react';
import { UpdateBrandFormDialog } from './update-brand-form-dialog';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

type Props = {
  row: IBrandItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function BrandTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const [statusChecked, setStatusChecked] = useState<Boolean>(row.status as Boolean);

  const confirm = useBoolean();

  const editDialog = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  // Function to handle the status change
  const handleStatusChange = async () => {
    const newStatus = row.status === 1 ? 0 : 1;
    setStatusChecked(Boolean(newStatus));
    const res = await updateBrandStatus(row.id, {
      name: row.name,
      description: row.description,
      status: newStatus,
    });

    if (res.status === 200) {
      toast.success(`${row.name} status changed`);
    } else {
      toast.error(`something went wrong`);
    }
    console.log('brands-response: ', res);
  };

  // Function to handle the status change
  const handleDeleteBrand = async () => {
    onDeleteRow();

    const res = await deleteBrand(row.id);

    if (res.status === 200) {
      toast.success(`${row.name} status deleted`);
    } else {
      toast.error(`something went wrong`);
    }
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.image} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.category?.name}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell
          title={row.description}
          sx={{
            maxWidth: '200px', // Define a max width
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.description}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <a href="#">{row.link}</a>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <a href="#">{'not-set'}</a>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.opend}</TableCell>

        <TableCell>
          <FormControlLabel
            label={row.status ? 'Active' : 'Inactive'}
            control={
              <Switch
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'black', // Set track color when checked
                  },
                }}
                name="status"
                checked={statusChecked as any}
                onChange={handleStatusChange}
              />
            }
          />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => {
              editDialog.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteBrand}>
            Delete
          </Button>
        }
      />

      <UpdateBrandFormDialog
        currentData={row}
        dialog={{
          open: editDialog.value,
          onClose: editDialog.onFalse,
        }}
      />
    </>
  );
}
