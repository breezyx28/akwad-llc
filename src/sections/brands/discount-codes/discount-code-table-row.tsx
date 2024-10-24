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

import { IDiscountCodeItem } from 'src/types/discount-code';
import { UpdateDiscountCodeFormDialog } from './update-discount-code-form-dialog';
import { deleteDiscountCode } from 'src/actions/discount-codes';
import { toast } from 'sonner';
import { convertTextToAppleEmoji } from 'src/lib/convert-to-apple-emoji';

// ----------------------------------------------------------------------

type Props = {
  row: IDiscountCodeItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function DiscountCodeTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const editDialog = useBoolean();

  const popover = usePopover();

  // Function to handle the status change
  const handleDeleteBrand = async () => {
    onDeleteRow();

    await deleteDiscountCode(row.id);
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.brand?.image} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.brand?.name}
              </Link>
              {/* <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.category}
              </Box> */}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{convertTextToAppleEmoji(row.name)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.coupon}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {convertTextToAppleEmoji(row.description)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.status === 0 ? 'Non-Varibale' : 'Variable'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.uses}</TableCell>

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

      <UpdateDiscountCodeFormDialog
        currentData={row}
        dialog={{
          open: editDialog.value,
          onClose: editDialog.onFalse,
        }}
      />
    </>
  );
}
