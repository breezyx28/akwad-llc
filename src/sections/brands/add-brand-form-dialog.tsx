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
import { addBrand } from 'src/actions/brands';

// ----------------------------------------------------------------------

export type NewBandSchemaType = zod.infer<typeof NewBrandSchema>;

export const NewBrandSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  category_id: zod.number().min(1, { message: 'Category is required!' }),
  keywords: zod.string().min(1, { message: 'Keywords is required!' }),
  link: zod.string().min(1, { message: 'Link is required!' }),
  image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
});

// ---------------------------------------------------------------------

export function AddBrandFormDialog() {
  const dialog = useBoolean();
  const { categories, categoriesLoading } = useGetCategories();

  const defaultValues = useMemo(
    () => ({
      image: null,
      name: '',
      description: '',
      category_id: 0,
      keywords: '',
      link: '',
    }),
    []
  );

  const methods = useForm<NewBandSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewBrandSchema),
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

  if (values?.image) {
    console.log('watching-image: ', values?.image);
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await addBrand(data);
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
        Add Brands
      </Button>

      <Dialog fullWidth={true} maxWidth={'md'} open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>Add Brands</DialogTitle>

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
                  <Field.Text name="name" label="Brand name" />
                  <Field.Text name="description" label="Description" />

                  <Field.Select name="category_id" label="Category" disabled={categoriesLoading}>
                    {categories &&
                      categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Field.Select>

                  <Field.Text name="link" label="Link" />
                  <Field.Text name="keywords" label="Keywords" />
                </Box>
              </Grid>
            </Stack>
            <Button
              type="submit"
              sx={{
                visibility: 'hidden',
              }}
              id="brand-submit-btn"
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
              document.getElementById('brand-submit-btn')?.click();
            }}
          >
            {'Add Brand'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
