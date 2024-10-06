import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MenuItem, Stack } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useGetBrands } from 'src/actions/brands';
import { IBannerItem } from 'src/types/banner';
import { updateBanner } from 'src/actions/banners';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export type UpdateBannerSchemaType = zod.infer<typeof UpdateBannerSchema>;

export const UpdateBannerSchema: any = zod.object({
  brand_id: zod.number().nullable(),
  expiry_date: zod.string().nullable(),
  type: zod.string().nullable(),
  link: zod.string().nullable(),
  image: zod.string().nullable(),
});

// ---------------------------------------------------------------------

type UpdateBannerDialogProps = {
  currentData: IBannerItem | any;
  dialog: {
    open: boolean;
    onClose: () => void;
  };
};

export function UpdateBannerFormDialog({ currentData, dialog }: UpdateBannerDialogProps) {
  const { brands, brandsLoading } = useGetBrands();

  const defaultValues = useMemo(
    () => ({
      type: currentData?.type,
      expiry_date: currentData?.description ?? '',
      brand_id: currentData?.brand_id ?? 0,
      link: currentData?.link ?? '',
      image: currentData?.image ?? '',
    }),
    []
  );

  const methods = useForm<UpdateBannerSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(UpdateBannerSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await updateBanner(currentData?.id, data);
      if (response.status === 200) {
        toast.success('Create success!');
        dialog.onClose();
      }
    } catch (error) {
      toast.error((error.message || error.error) ?? 'Something went wrong');
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth={true} maxWidth={'md'} open={dialog.open} onClose={dialog.onClose}>
      <DialogTitle>Update Banner</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack display={'flex'} direction={'column'} spacing={3} sx={{ pt: 3 }}>
            <Grid xs={12} md={4}>
              <Box sx={{ mb: 5 }}>
                <Field.UploadPhoto
                  sx={{
                    borderRadius: '20%',
                  }}
                  name="image"
                  maxSize={3145728}
                />
              </Box>
            </Grid>

            <Grid xs={12} md={8}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <Field.Text name="type" label="Type" defaultValue={defaultValues.type} />

                <Field.Text name="link" label="Website Link" defaultValue={defaultValues.link} />
                <Field.Select
                  name="brand_id"
                  label="Brand"
                  disabled={brandsLoading}
                  defaultValue={defaultValues.brand_id}
                >
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                </Field.Select>

                <Field.DatePicker
                  format={'YYYY-MM-DD'}
                  name="expiry_date"
                  label="Expiry Date"
                  defaultValue={
                    defaultValues.expiry_date
                      ? dayjs(defaultValues.expiry_date, 'YYYY-MM-DD')
                      : null
                  }
                />
              </Box>
            </Grid>
          </Stack>
          <Button
            id={`update-banner-submit-btn`}
            type="submit"
            sx={{
              visibility: 'hidden',
            }}
          >
            submit
          </Button>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={dialog.onClose} variant="outlined" color="inherit">
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={() => {
            document.getElementById('update-banner-submit-btn')?.click();
          }}
        >
          {'Edit Banner'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
