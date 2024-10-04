import type { TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  rows?: number; // Optionally, you can add a rows prop to specify textarea height
};

export function RHFTextAreaField({ name, helperText, type, rows = 3, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          multiline // This makes it a textarea
          rows={rows} // Specify number of rows (height)
          inputProps={{
            autoComplete: 'off',
          }}
          {...other}
        />
      )}
    />
  );
}
