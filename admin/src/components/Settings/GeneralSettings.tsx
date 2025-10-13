import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Input, Textarea, Switch, Button, Spinner } from '@nextui-org/react';
import { FiSave } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const GeneralSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({ siteName: '', siteDescription: '', maintenanceMode: false });
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['settings-general'],
    queryFn: async () => {
      // Hypothetical endpoint
      const { data } = await api.get('/api/settings/general');
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);
  
  const mutation = useMutation({
      mutationFn: (updatedSettings: any) => api.put('/api/settings/general', updatedSettings),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['settings-general'] });
          showToast('General settings saved successfully!', 'success');
      },
      onError: () => {
          showToast('Error saving general settings.', 'error');
      }
  });

  const handleSave = () => {
    mutation.mutate(settings);
  };

  if (isLoading) {
    return <Spinner label="Loading general settings..." />;
  }

  return (
    <div className="space-y-4">
      <Input
        label="Site Name"
        value={settings.siteName}
        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
      />
      <Textarea
        label="Site Description"
        value={settings.siteDescription}
        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
      />
      <Switch
        isSelected={settings.maintenanceMode}
        onValueChange={(value) => setSettings({ ...settings, maintenanceMode: value })}
      >
        Maintenance Mode
      </Switch>
      <Button 
        color="primary" 
        startContent={<FiSave />}
        onPress={handleSave}
        isLoading={mutation.isPending}
      >
        Save General Settings
      </Button>
    </div>
  );
};

export default GeneralSettings;
