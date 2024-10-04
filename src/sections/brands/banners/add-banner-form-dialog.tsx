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
import { fData } from 'src/utils/format-number';
import { useGetCategories } from 'src/actions/categories';
import { useGetBrands } from 'src/actions/brands';
import { addBanner } from 'src/actions/banners';

// ----------------------------------------------------------------------

export type NewBannerSchemaType = zod.infer<typeof NewBannerSchema>;

export const NewBannerSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  type: zod.string().min(1, { message: 'Type is required!' }),
  brand_id: zod.number().min(1, { message: 'Brand is required!' }),
  link: zod.string().min(1, { message: 'Link is required!' }),
  expiry_date: zod.string().min(1, { message: 'Expiry date is required!' }),
  image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
});

// ---------------------------------------------------------------------

export function AddBannerFormDialog() {
  const dialog = useBoolean();
  const { brands, brandsLoading } = useGetBrands();

  const defaultValues = useMemo(
    () => ({
      image: null,
      name: '',
      type: '',
      brand_id: 0,
      link: '',
      expiry_date: '',
    }),
    []
  );

  const methods = useForm<NewBannerSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewBannerSchema),
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
      const response = await addBanner(data);

      if (response.status === 200) {
        reset();
        toast.success('Create success!');
      }
      console.info('DATA', data);
    } catch (error) {
      toast.error((error.message || error.error) ?? 'Something went wrong');
      console.error(error);
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
        Add Banner
      </Button>

      <Dialog fullWidth={true} maxWidth={'md'} open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>Add Banner</DialogTitle>

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
                  <Field.Text name="name" label="Banner name" />
                  <Field.Text name="type" label="Type" />

                  <Field.Text name="link" label="Website Link" />
                  <Field.Select name="brand_id" label="Brand" disabled={brandsLoading}>
                    {brands &&
                      brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                  </Field.Select>

                  <Field.DatePicker format="YYYY/MM/DD" name="expiry_date" label="Expiry Date" />
                </Box>
              </Grid>
            </Stack>
            <Button
              id="brand-banner-submit-btn"
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
          <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={() => {
              document.getElementById('brand-banner-submit-btn')?.click();
            }}
          >
            {'Add Banner'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
