import { Card, CardBody, CardHeader, Image, Input, Button } from '@nextui-org/react';
import { FiX, FiCopy } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

interface MediaDetailsProps {
  media: MediaItem;
  onClose: () => void;
}

const MediaDetails = ({ media, onClose }: MediaDetailsProps) => {
  const { showToast } = useToast();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.url);
    showToast('URL copied to clipboard!', 'success');
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Media Details</h3>
        <Button isIconOnly size="sm" variant="light" onPress={onClose}>
          <FiX />
        </Button>
      </CardHeader>
      <CardBody className="space-y-4">
        <Image src={media.url} alt={media.filename} className="w-full h-48 object-cover rounded-lg" />
        <Input
          isReadOnly
          label="File URL"
          value={media.url}
          endContent={
            <Button isIconOnly size="sm" variant="flat" onPress={handleCopyUrl}>
              <FiCopy />
            </Button>
          }
        />
        <Input isReadOnly label="Filename" value={media.filename} />
        <Input isReadOnly label="File Type" value={media.mimetype} />
        <Input isReadOnly label="File Size" value={`${(media.size / 1024).toFixed(2)} KB`} />
        <Input isReadOnly label="Uploaded On" value={new Date(media.createdAt).toLocaleString()} />
      </CardBody>
    </Card>
  );
};

export default MediaDetails;
