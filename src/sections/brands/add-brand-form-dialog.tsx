import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box , Grid , Stack, MenuItem } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { addBrand } from 'src/actions/brands';
import { useGetCategories } from 'src/actions/categories';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

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
        Add Brand
      </Button>

      <Dialog fullWidth maxWidth="md" open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle>Add Brand</DialogTitle>

        <DialogContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack display="flex" direction="column" spacing={3} sx={{ pt: 3 }}>
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
            Add Brand
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
