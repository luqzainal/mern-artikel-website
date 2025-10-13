import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Input, Textarea, Button, Spinner } from '@nextui-org/react';
import { FiSave } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const SEOSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({ seoTitle: '', seoDescription: '', seoKeywords: '' });
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['settings-seo'],
    queryFn: async () => (await api.get('/api/settings/seo')).data,
  });

  useEffect(() => {
    if (data) setSettings(data);
  }, [data]);
  
  const mutation = useMutation({
    mutationFn: (updatedSettings: any) => api.put('/api/settings/seo', updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-seo'] });
      showToast('SEO settings saved successfully!', 'success');
    },
    onError: () => {
      showToast('Error saving SEO settings.', 'error');
    }
  });

  const handleSave = () => mutation.mutate(settings);

  if (isLoading) return <Spinner label="Loading SEO settings..." />;

  return (
    <div className="space-y-4">
      <Input
        label="Global Meta Title"
        value={settings.seoTitle}
        onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
      />
      <Textarea
        label="Global Meta Description"
        value={settings.seoDescription}
        onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
      />
      <Textarea
        label="Global Keywords"
        placeholder="e.g.,islamic articles, quran, hadith"
        value={settings.seoKeywords}
        onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
      />
      <Button 
        color="primary" 
        startContent={<FiSave />}
        onPress={handleSave}
        isLoading={mutation.isPending}
      >
        Save SEO Settings
      </Button>
    </div>
  );
};

export default SEOSettings;
