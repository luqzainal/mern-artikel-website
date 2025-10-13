import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, Textarea, Select, SelectItem, Card, CardBody } from '@nextui-org/react';
import { api, getCategories } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const categorySchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameMy: z.string().min(1, 'Malay name is required'),
  slug: z.string().min(1, 'Slug is required'),
  descriptionEn: z.string().optional(),
  descriptionMy: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
    id: string;
    nameEn: string;
}

const CategoryForm = () => {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: getCategories,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (newCategory: CategoryFormData) => api.post('/api/categories', newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset();
      showToast('Category created successfully!', 'success');
    },
    onError: () => {
      showToast('Error creating category.', 'error');
    }
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="nameEn"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Name (English)"
                isInvalid={!!errors.nameEn}
                errorMessage={errors.nameEn?.message}
              />
            )}
          />
          <Controller
            name="nameMy"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Name (Malay)"
                isInvalid={!!errors.nameMy}
                errorMessage={errors.nameMy?.message}
              />
            )}
          />
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Slug"
                isInvalid={!!errors.slug}
                errorMessage={errors.slug?.message}
              />
            )}
          />
          <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                  <Select
                      {...field}
                      label="Parent Category"
                      placeholder="Select a parent category (optional)"
                  >
                      {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                              {cat.nameEn}
                          </SelectItem>
                      ))}
                  </Select>
              )}
          />
          <Controller
            name="descriptionEn"
            control={control}
            render={({ field }) => (
              <Textarea {...field} label="Description (English)" />
            )}
          />
          <Controller
            name="descriptionMy"
            control={control}
            render={({ field }) => (
              <Textarea {...field} label="Description (Malay)" />
            )}
          />
          <Button type="submit" color="primary" isLoading={mutation.isPending}>
            Add Category
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CategoryForm;
