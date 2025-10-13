import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Select, SelectItem, Button, Spinner, Chip, Input } from '@nextui-org/react';
import { FiSave, FiPlus } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const LanguageSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({ defaultLanguage: 'en', supportedLanguages: ['en', 'my'] });
  const [newLang, setNewLang] = useState('');
  const { showToast } = useToast();

  // Hypothetical query to fetch language settings
  const { data, isLoading } = useQuery({
    queryKey: ['settings-language'],
    queryFn: async () => (await api.get('/api/settings/language')).data,
  });

  useEffect(() => { if (data) setSettings(data); }, [data]);
  
  const mutation = useMutation({
    mutationFn: (updatedSettings: any) => api.put('/api/settings/language', updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-language'] });
      showToast('Language settings saved successfully!', 'success');
    },
    onError: () => {
      showToast('Error saving language settings.', 'error');
    }
  });

  const handleSave = () => mutation.mutate(settings);
  
  const addLanguage = () => {
    if (newLang && !settings.supportedLanguages.includes(newLang)) {
      setSettings(prev => ({ ...prev, supportedLanguages: [...prev.supportedLanguages, newLang] }));
      setNewLang('');
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.filter(lang => lang !== langToRemove),
    }));
  };

  if (isLoading) return <Spinner label="Loading language settings..." />;

  return (
    <div className="space-y-6">
      <Select
        label="Default Site Language"
        selectedKeys={[settings.defaultLanguage]}
        onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
      >
        {settings.supportedLanguages.map(lang => (
          <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
        ))}
      </Select>
      
      <div>
        <h4 className="mb-2 font-semibold">Supported Languages</h4>
        <div className="flex flex-wrap gap-2">
          {settings.supportedLanguages.map(lang => (
            <Chip key={lang} onClose={() => removeLanguage(lang)}>{lang.toUpperCase()}</Chip>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add language code (e.g., ar)"
          value={newLang}
          onValueChange={setNewLang}
        />
        <Button onPress={addLanguage} isIconOnly><FiPlus /></Button>
      </div>

      <Button color="primary" startContent={<FiSave />} onPress={handleSave} isLoading={mutation.isPending}>
        Save Language Settings
      </Button>
    </div>
  );
};

export default LanguageSettings;
