import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { ISearchLogsItem } from 'src/types/search-logs';
import { convertTextToAppleEmoji } from 'src/lib/convert-to-apple-emoji';

// ----------------------------------------------------------------------

type Props = {
  row: ISearchLogsItem;
  selected: boolean;
  onSelectRow: () => void;
};

export function SearchLogsTableRow({ row, selected, onSelectRow }: Props) {
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.name} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{convertTextToAppleEmoji(row.name)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.count}</TableCell>
      </TableRow>
    </>
  );
}
