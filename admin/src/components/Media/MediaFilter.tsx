import { Input, Select, SelectItem } from '@nextui-org/react';
import { FiSearch } from 'react-icons/fi';

interface MediaFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onTypeChange: (type: string) => void;
}

const fileTypes = [
  { key: 'all', label: 'All Types' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'document', label: 'Documents' },
];

const MediaFilter = ({ onSearchChange, onTypeChange }: MediaFilterProps) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Input
        isClearable
        placeholder="Search media..."
        startContent={<FiSearch />}
        onValueChange={onSearchChange}
        className="flex-grow"
      />
      <Select
        placeholder="Filter by type"
        onChange={(e) => onTypeChange(e.target.value)}
        className="max-w-xs"
      >
        {fileTypes.map((type) => (
          <SelectItem key={type.key} value={type.key}>
            {type.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default MediaFilter;
