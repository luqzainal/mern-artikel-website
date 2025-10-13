import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tabs,
  Tab,
  Chip,
} from '@nextui-org/react';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Breadcrumb from '../components/Layout/Breadcrumb';
import ArticlePreview from '../components/Articles/ArticlePreview';
import {
  createArticle,
  updateArticle,
  getArticle,
  getCategories,
  getTags,
  ArticleFormData,
} from '../services/api';
import { QUILL_MODULES } from '../utils/constants';
import { useToast } from '../context/ToastContext';

export default function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  // State
  const [activeTab, setActiveTab] = useState('content');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch data
  const { data: article, isLoading: loadingArticle } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticle(id!),
    enabled: isEdit,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  // Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    defaultValues: {
      categoryId: '',
      tagIds: [],
      status: 'DRAFT',
      featuredImageUrl: '',
      translations: [
        {
          language: 'MY',
          title: '',
          content: '',
          excerpt: '',
          metaTitle: '',
          metaDescription: '',
        },
        {
          language: 'EN',
          title: '',
          content: '',
          excerpt: '',
          metaTitle: '',
          metaDescription: '',
        },
      ],
    },
  });

  // Load article data if editing
  useEffect(() => {
    if (article) {
      setValue('categoryId', article.categoryId);
      setValue('status', article.status);
      setValue('featuredImageUrl', article.featuredImageUrl || '');
      setValue('tagIds', article.tags?.map((t: any) => t.id) || []);
      
      if (article.translations) {
        setValue('translations', article.translations as any);
      }

      if (article.tags) {
        setSelectedTags(new Set(article.tags.map((t: any) => t.id)));
      }
    }
  }, [article, setValue]);

  const { showToast } = useToast();

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      showToast('Article created successfully!', 'success');
      navigate('/articles');
    },
    onError: () => {
      showToast('Error creating article.', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: ArticleFormData) => updateArticle(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      showToast('Article updated successfully!', 'success');
      navigate('/articles');
    },
    onError: () => {
      showToast('Error updating article.', 'error');
    }
  });

  const onSubmit = (data: ArticleFormData) => {
    const formData = {
      ...data,
      tagIds: Array.from(selectedTags),
    };

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleSaveDraft = () => {
    setValue('status', 'DRAFT');
    handleSubmit(onSubmit)();
  };

  if (isEdit && loadingArticle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const msTranslation = watch('translations.0');
  const enTranslation = watch('translations.1');

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Article' : 'Add New Article'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEdit ? 'Update article details' : 'Create a new article'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            startContent={<ArrowLeft size={18} />}
            onPress={() => navigate('/articles')}
          >
            Back
          </Button>
          <Button
            variant="flat"
            startContent={<Eye size={18} />}
            onPress={() => setPreviewOpen(true)}
          >
            Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Content Card */}
        <Card>
          <CardBody className="p-6">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              color="primary"
              variant="underlined"
            >
              {/* Content Tab */}
              <Tab
                key="content"
                title={
                  <div className="flex items-center gap-2">
                    <span>Content</span>
                    {(errors.translations?.[0]?.title || errors.translations?.[0]?.content) && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                }
              >
                <div className="space-y-6 py-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      placeholder="Select category"
                      {...register('categoryId', { required: 'Category is required' })}
                      errorMessage={errors.categoryId?.message}
                      isInvalid={!!errors.categoryId}
                      isRequired
                    >
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nameEn}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Status"
                      placeholder="Select status"
                      {...register('status')}
                    >
                      <SelectItem key="DRAFT" value="DRAFT">
                        Draft
                      </SelectItem>
                      <SelectItem key="PENDING_REVIEW" value="PENDING_REVIEW">
                        Pending Review
                      </SelectItem>
                      <SelectItem key="PUBLISHED" value="PUBLISHED">
                        Published
                      </SelectItem>
                    </Select>
                  </div>

                  {/* Featured Image */}
                  <Input
                    label="Featured Image URL"
                    placeholder="https://example.com/image.jpg"
                    {...register('featuredImageUrl')}
                  />

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: any) => (
                        <Chip
                          key={tag.id}
                          variant={selectedTags.has(tag.id) ? 'solid' : 'flat'}
                          color={selectedTags.has(tag.id) ? 'primary' : 'default'}
                          onClick={() => {
                            const newTags = new Set(selectedTags);
                            if (newTags.has(tag.id)) {
                              newTags.delete(tag.id);
                            } else {
                              newTags.add(tag.id);
                            }
                            setSelectedTags(newTags);
                          }}
                          className="cursor-pointer"
                        >
                          {tag.name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab>

              {/* Translations Tab */}
              <Tab
                key="translations"
                title={
                  <div className="flex items-center gap-2">
                    <span>Translations</span>
                    {(errors.translations?.[0] || errors.translations?.[1]) && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                }
              >
                <div className="space-y-8 py-4">
                  {/* Malay Translation */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🇲🇾</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Bahasa Melayu
                      </h3>
                    </div>

                    <Input
                      label="Title (Malay)"
                      placeholder="Enter article title in Malay"
                      {...register('translations.0.title', {
                        required: 'Malay title is required',
                      })}
                      errorMessage={errors.translations?.[0]?.title?.message}
                      isInvalid={!!errors.translations?.[0]?.title}
                      isRequired
                    />

                    <Textarea
                      label="Excerpt (Malay)"
                      placeholder="Brief summary of the article"
                      {...register('translations.0.excerpt')}
                      minRows={3}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content (Malay) *
                      </label>
                      <Controller
                        name="translations.0.content"
                        control={control}
                        rules={{ required: 'Malay content is required' }}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={QUILL_MODULES}
                            className="bg-white dark:bg-gray-800"
                          />
                        )}
                      />
                      {errors.translations?.[0]?.content && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.translations[0].content.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                  {/* English Translation */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🇬🇧</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        English
                      </h3>
                    </div>

                    <Input
                      label="Title (English)"
                      placeholder="Enter article title in English"
                      {...register('translations.1.title', {
                        required: 'English title is required',
                      })}
                      errorMessage={errors.translations?.[1]?.title?.message}
                      isInvalid={!!errors.translations?.[1]?.title}
                      isRequired
                    />

                    <Textarea
                      label="Excerpt (English)"
                      placeholder="Brief summary of the article"
                      {...register('translations.1.excerpt')}
                      minRows={3}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content (English) *
                      </label>
                      <Controller
                        name="translations.1.content"
                        control={control}
                        rules={{ required: 'English content is required' }}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={QUILL_MODULES}
                            className="bg-white dark:bg-gray-800"
                          />
                        )}
                      />
                      {errors.translations?.[1]?.content && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.translations[1].content.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Tab>

              {/* SEO Tab */}
              <Tab key="seo" title="SEO">
                <div className="space-y-6 py-4">
                  {/* Malay SEO */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🇲🇾</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        SEO - Bahasa Melayu
                      </h3>
                    </div>

                    <Input
                      label="Meta Title (Malay)"
                      placeholder="SEO optimized title"
                      {...register('translations.0.metaTitle')}
                      description="Recommended: 50-60 characters"
                    />

                    <Textarea
                      label="Meta Description (Malay)"
                      placeholder="SEO description"
                      {...register('translations.0.metaDescription')}
                      minRows={3}
                      description="Recommended: 150-160 characters"
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                  {/* English SEO */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🇬🇧</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        SEO - English
                      </h3>
                    </div>

                    <Input
                      label="Meta Title (English)"
                      placeholder="SEO optimized title"
                      {...register('translations.1.metaTitle')}
                      description="Recommended: 50-60 characters"
                    />

                    <Textarea
                      label="Meta Description (English)"
                      placeholder="SEO description"
                      {...register('translations.1.metaDescription')}
                      minRows={3}
                      description="Recommended: 150-160 characters"
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="flat"
                  onPress={() => navigate('/articles')}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="flat"
                  onPress={handleSaveDraft}
                  isLoading={isSubmitting && watch('status') === 'DRAFT'}
                  isDisabled={isSubmitting}
                >
                  Save as Draft
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  startContent={<Save size={18} />}
                  isLoading={isSubmitting && watch('status') !== 'DRAFT'}
                  isDisabled={isSubmitting}
                >
                  {isEdit ? 'Update Article' : 'Publish Article'}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </form>

      {/* Preview Modal */}
      <ArticlePreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        article={
          msTranslation && enTranslation
            ? {
                id: id || 'preview',
                categoryId: watch('categoryId'),
                createdBy: '1',
                status: watch('status') as any,
                views: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                translations: [
                  {
                    ...msTranslation,
                    id: '1',
                    articleId: id || 'preview',
                    langCode: 'ms',
                  },
                  {
                    ...enTranslation,
                    id: '2',
                    articleId: id || 'preview',
                    langCode: 'en',
                  },
                ],
                category: categories.find((c: any) => c.id === watch('categoryId')),
                tags: tags.filter((t: any) => selectedTags.has(t.id)),
              }
            : null
        }
      />
    </div>
  );
}

