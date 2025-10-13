import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Image, Button, Card, CardBody, Checkbox } from '@nextui-org/react';
import { FiTrash2, FiCopy } from 'react-icons/fi';
import { MediaItem } from '../../pages/MediaLibrary';
import { useToast } from '../../context/ToastContext';
import GridSkeleton from '../ui/GridSkeleton';

interface MediaGridProps {
  onMediaSelect: (media: MediaItem) => void;
  searchTerm: string;
  filterType: string;
  selectedItems: string[];
  onSelectionChange: (id: string) => void;
}

const MediaGrid = ({ onMediaSelect, searchTerm, filterType, selectedItems, onSelectionChange }: MediaGridProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: media = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['media'],
    queryFn: async () => {
      const { data } = await api.get('/api/media');
      return Array.isArray(data) ? data : [];
    },
  });

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.mimetype.startsWith(filterType);
    return matchesSearch && matchesType;
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      showToast('Media item deleted successfully.', 'success');
    },
    onError: () => {
      showToast('Failed to delete media item.', 'error');
    }
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Consider using a toast notification for better UX
    alert('URL copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    // We can add a confirmation modal here later
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <GridSkeleton />;
  }

  if (filteredMedia.length === 0 && !isLoading) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500">No media found matching your criteria.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredMedia.map((item) => (
        <div key={item.id} className="relative group">
          <Checkbox
            isSelected={selectedItems.includes(item.id)}
            onValueChange={() => onSelectionChange(item.id)}
            className="absolute top-2 right-2 z-10"
          />
          <div className="cursor-pointer" onClick={() => onMediaSelect(item)}>
            <Image
              src={item.url}
              alt={item.filename}
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="text-white"
                  onPress={() => handleCopyUrl(item.url)}
                >
                  <FiCopy />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleDelete(item.id)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
