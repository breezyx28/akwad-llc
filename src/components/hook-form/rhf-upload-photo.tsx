import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { Upload, UploadBox } from '../upload';

import type { UploadProps } from '../upload';
import { UploadPhoto } from '../upload/upload-photo';
import { uploadImage } from 'src/actions/users';
import React from 'react';

// ----------------------------------------------------------------------

type Props = UploadProps & {
  name: string;
};

// ----------------------------------------------------------------------

export function RHFUploadPhoto({ name, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const [uploaded, setUploaded] = React.useState<any>(null);

  React.useEffect(() => {
    if (uploaded) {
      console.log('uploaded-status: ', uploaded);
    }
  }, [uploaded]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = async (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });

          // upload image to the server
          const response = await uploadImage({
            image: value,
          });

          if (response) {
            setUploaded(response);
            setValue(name, value, { shouldValidate: true });
          }
        };

        return (
          <div>
            <UploadPhoto value={field.value} error={!!error} onDrop={onDrop} {...other} />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
