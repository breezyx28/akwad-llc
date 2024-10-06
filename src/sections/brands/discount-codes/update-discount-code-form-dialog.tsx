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
import { updateDiscountCode } from 'src/actions/discount-codes';
import { IDiscountCodeItem } from 'src/types/discount-code';

// ----------------------------------------------------------------------

export type UpdateDiscountCodeSchemaType = zod.infer<typeof UpdateDiscountCodeSchema>;

export const UpdateDiscountCodeSchema: any = zod.object({
  name: zod.string().nullable(),
  description: zod.string().nullable(),
  brand_id: zod.number().nullable(),
  keywords: zod.string().nullable(),
  coupon: zod.string().nullable(),
});

// ---------------------------------------------------------------------

type UpdateDiscountCodeDialogProps = {
  currentData: IDiscountCodeItem | any;
  dialog: {
    open: boolean;
    onClose: () => void;
  };
};

export function UpdateDiscountCodeFormDialog({
  currentData,
  dialog,
}: UpdateDiscountCodeDialogProps) {
  const { brands, brandsLoading } = useGetBrands();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name,
      description: currentData?.description ?? '',
      brand_id: currentData?.brand_id ?? 0,
      keywords: currentData?.keywords ?? '',
      coupon: currentData?.coupon ?? '',
    }),
    []
  );

  const methods = useForm<UpdateDiscountCodeSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(UpdateDiscountCodeSchema),
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
      const response = await updateDiscountCode(currentData?.id, data);
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
      <DialogTitle>Update Discount Code</DialogTitle>

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
                <Field.Text name="name" label="Code name" defaultValue={defaultValues.name} />
                <Field.Text
                  name="description"
                  label="Description"
                  defaultValue={defaultValues.description}
                />

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

                <Field.Text name="coupon" label="Coupon" defaultValue={defaultValues.coupon} />
                <Field.Text
                  name="keywords"
                  label="Keywords"
                  defaultValue={defaultValues.keywords}
                />
              </Box>
            </Grid>
          </Stack>
          <Button
            type="submit"
            sx={{
              visibility: 'hidden',
            }}
            id="update-discount-code-submit-btn"
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
            document.getElementById('update-discount-code-submit-btn')?.click();
          }}
        >
          {'Edit Discount Code'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
