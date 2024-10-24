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

import { UserQuickEditForm } from './user-quick-edit-form';
import { IUsersItem } from 'src/types/users';
import { convertTextToAppleEmoji } from 'src/lib/convert-to-apple-emoji';

// ----------------------------------------------------------------------

type Props = {
  row: IUsersItem;
  selected: boolean;
  // onEditRow: () => void;
  onSelectRow: () => void;
  // onDeleteRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: Props) {
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id as any} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>#{row.id}</TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.image} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {convertTextToAppleEmoji(row.name)}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone_number}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.age}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{'Hands'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{'Hands 2'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{'not set'}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.open ? popover.onClose : popover.onOpen}
            >
              <Iconify icon="mdi:eye" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
