import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { RouterLink } from 'src/routes/components';
import { useBoolean, UseBooleanReturn } from 'src/hooks/use-boolean';
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
import { updateBrand } from 'src/actions/brands';
import { IBrandItem } from 'src/types/brand';

// ----------------------------------------------------------------------

export type UpdateBandSchemaType = zod.infer<typeof UpdateBrandSchema>;

export const UpdateBrandSchema: any = zod.object({
  name: zod.string().nullable(),
  description: zod.string().nullable(),
  category_id: zod.number().nullable(),
  keywords: zod.string().nullable(),
  link: zod.string().nullable(),
  image: schemaHelper.file().nullable(),
});

// ---------------------------------------------------------------------

type UpdateBrandDialogProps = {
  currentData: IBrandItem | any;
  dialog: {
    open: boolean;
    onClose: () => void;
  };
};

export function UpdateBrandFormDialog({ currentData, dialog }: UpdateBrandDialogProps) {
  // const dialog = useBoolean();
  const { categories, categoriesLoading } = useGetCategories();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name,
      image: currentData?.image ?? null,
      description: currentData?.description ?? '',
      category_id: currentData?.category_id ?? 0,
      keywords: currentData?.keywords ?? '',
      link: currentData?.link ?? '',
    }),
    []
  );

  const methods = useForm<UpdateBandSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(UpdateBrandSchema),
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
      const response = await updateBrand(currentData?.id, data);
      if (response.status === 200) {
        dialog.onClose();
      }
    } catch (error) {
      toast.error((error.message || error.error) ?? 'Something went wrong');
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth={true} maxWidth={'md'} open={dialog.open} onClose={dialog.onClose}>
      <DialogTitle>Update Brands</DialogTitle>

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
                <Field.Text name="name" label="Brand name" defaultValue={defaultValues.name} />
                <Field.Text
                  name="description"
                  label="Description"
                  defaultValue={defaultValues.description}
                />

                <Field.Select
                  name="category_id"
                  label="Category"
                  disabled={categoriesLoading}
                  defaultValue={defaultValues.category_id}
                >
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Field.Select>

                <Field.Text name="link" label="Link" defaultValue={defaultValues.link} />
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
            id="update-brand-submit-btn"
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
            document.getElementById('update-brand-submit-btn')?.click();
          }}
        >
          {'Edit Brand'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
