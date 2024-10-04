import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';
import { Card, FormControlLabel, MenuItem, Stack, Switch } from '@mui/material';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import { Label } from 'src/components/label';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useGetBrands } from 'src/actions/brands';
import { addDiscountCode } from 'src/actions/discount-codes';

// ----------------------------------------------------------------------

export type NewDiscountCodeSchemaType = zod.infer<typeof NewDiscountCodeSchema>;

export const NewDiscountCodeSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  brand_id: zod.number().min(1, { message: 'Brand is required!' }),
  status: zod.number(),
  coupon: zod.string().min(1, { message: 'coupon is required!' }),
  keywords: zod.string().min(1, { message: 'keywords is required!' }),
});

// ---------------------------------------------------------------------

export function AddDiscountCodeFormDialog() {
  const dialog = useBoolean();
  const { brands, brandsLoading } = useGetBrands();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      brand_id: 0,
      status: 0,
      coupon: '',
      keywords: '',
    }),
    []
  );

  const methods = useForm<NewDiscountCodeSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewDiscountCodeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await addDiscountCode(data);
      reset();
      response.status === 200 && toast.success('Create success!');
      console.info('DATA', response.data);
    } catch (error) {
      console.error('discount-code-error: ', error);
      toast.error('Soething went wrong');
    }
  });

  return (
    <div>
      <Button
        component={RouterLink}
        href="#"
        onClick={dialog.onTrue}
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        Add Code
      </Button>

      <Dialog fullWidth={true} maxWidth={'md'} open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>Add Code</DialogTitle>

        <DialogContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack display={'flex'} spacing={3} sx={{ pt: 3 }}>
              <Grid xs={12} md={8}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <Field.Select name="brand_id" label="Brand" disabled={brandsLoading}>
                    {brands &&
                      brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                  </Field.Select>

                  <Field.Text name="name" label="Code name" />
                  <Field.Text name="keywords" label="Keywords" />

                  <Field.Text name="coupon" label="Coupon" />
                  <Field.Select name="status" label="Status" disabled={brandsLoading}>
                    <MenuItem key={0} value={0}>
                      {'Non-Variable'}
                    </MenuItem>
                    <MenuItem key={1} value={1}>
                      {'Variable'}
                    </MenuItem>
                  </Field.Select>

                  <Field.TextArea name="description" label="Description" rows={5} />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}></Stack>
              </Grid>
            </Stack>
            <Button
              type="submit"
              sx={{
                visibility: 'hidden',
              }}
              id="code-submit-btn"
            >
              submit
            </Button>
          </Form>
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={() => {
              document.getElementById('code-submit-btn')?.click();
            }}
          >
            {'Add Code'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
