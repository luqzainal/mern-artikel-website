import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const tagSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameMy: z.string().min(1, 'Malay name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

type TagFormData = z.infer<typeof tagSchema>;

const TagForm = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
  });

  const mutation = useMutation({
    mutationFn: (newTag: TagFormData) => api.post('/api/tags', newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      reset();
      showToast('Tag created successfully!', 'success');
    },
    onError: () => {
      showToast('Error creating tag.', 'error');
    }
  });

  const onSubmit = (data: TagFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">Add New Tag</h3>
      </CardHeader>
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
          <Button type="submit" className="bg-green-500 text-white" isLoading={mutation.isPending}>
            Add Tag
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default TagForm;
