import { useQuery } from '@tanstack/react-query';
import { getTags } from '../../services/api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody, CardHeader, Chip, Input } from '@nextui-org/react';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import TableSkeleton from '../ui/TableSkeleton';

interface Tag {
  id: string;
  nameEn: string;
  nameMy: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

const TagList = () => {
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTags = tags.filter(tag =>
    tag.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.nameMy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Tag Usage Statistics</h3>
        <Input
          isClearable
          placeholder="Search tags..."
          startContent={<FiSearch />}
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="max-w-xs"
        />
      </CardHeader>
      <CardBody>
        <Table aria-label="Tags usage table">
          <TableHeader>
            <TableColumn>NAME (EN)</TableColumn>
            <TableColumn>NAME (MY)</TableColumn>
            <TableColumn>SLUG</TableColumn>
            <TableColumn>ARTICLE COUNT</TableColumn>
          </TableHeader>
          <TableBody items={filteredTags} emptyContent="No tags found.">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nameEn}</TableCell>
                <TableCell>{item.nameMy}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">{item.slug}</Chip>
                </TableCell>
                <TableCell>{item._count?.articles || 0}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default TagList;
