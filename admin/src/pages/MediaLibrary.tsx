import { useState } from 'react';
import MediaGrid from '../components/Media/MediaGrid';
import MediaUploader from '../components/Media/MediaUploader';
import MediaDetails from '../components/Media/MediaDetails';
import MediaFilter from '../components/Media/MediaFilter';
import MediaBulkActions from '../components/Media/MediaBulkActions';
import { AnimatePresence, motion } from 'framer-motion';

// Define the MediaItem type to be shared
export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export default function MediaLibrary() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectionChange = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'delete' | 'download') => {
    console.log(`Performing bulk ${action} on items:`, selectedItems);
    // Logic for bulk actions
    setSelectedItems([]);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Media Library</h1>
          <p className="text-gray-600 mt-2">
            Manage all your uploaded images and media assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={selectedMedia ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="mb-8">
            <MediaUploader />
          </div>
          <div className="mb-8">
            <MediaFilter onSearchChange={setSearchTerm} onTypeChange={setFilterType} />
          </div>
          <div className="mb-8">
            <MediaBulkActions selectedCount={selectedItems.length} onBulkAction={handleBulkAction} />
          </div>
          <div>
            <MediaGrid
              onMediaSelect={setSelectedMedia}
              searchTerm={searchTerm}
              filterType={filterType}
              selectedItems={selectedItems}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <MediaDetails media={selectedMedia} onClose={() => setSelectedMedia(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
