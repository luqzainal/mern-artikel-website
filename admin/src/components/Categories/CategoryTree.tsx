import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../services/api';
import { Spinner, Card, CardBody } from '@nextui-org/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';

// Define the Category type
interface Category {
  id: string;
  nameEn: string;
  nameMy: string;
  parentId: string | null;
  children?: Category[];
  _count?: {
    articles: number;
  };
}

type CategoryNode = Omit<Category, 'children'> & { children: CategoryNode[] };

// Function to build the category tree
const buildTree = (categories: Category[]): CategoryNode[] => {
  const categoryMap = new Map<string, CategoryNode>(
    categories.map(cat => [cat.id, { ...cat, children: [] }])
  );
  const tree: CategoryNode[] = [];

  for (const category of categoryMap.values()) {
    if (category.parentId && categoryMap.has(category.parentId)) {
      const parent = categoryMap.get(category.parentId)!;
      parent.children.push(category);
    } else {
      tree.push(category);
    }
  }

  return tree;
};

const CategoryItem = ({ category, index }: { category: CategoryNode; index: number }) => {
  return (
    <Draggable draggableId={category.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-3 mb-2 bg-white rounded-lg shadow-sm border"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{category.nameEn}</p>
              <p className="text-sm text-gray-500">{category.nameMy}</p>
            </div>
            <div className="text-sm text-gray-600">
              Articles: {category._count?.articles || 0}
            </div>
          </div>
          {category.children && category.children.length > 0 && (
            <div className="pl-4 mt-2 border-l-2">
              {category.children.map((child, childIndex) => (
                <CategoryItem key={child.id} category={child} index={childIndex} />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

const CategoryTree = () => {
  const { data: flatCategories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);

  useEffect(() => {
    if (flatCategories && flatCategories.length > 0) {
      setCategoryTree(buildTree(flatCategories));
    }
  }, [flatCategories]);

  const onDragEnd = (result: any) => {
    // Drag and drop logic needs to be updated to handle nested lists
    console.log(result);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Loading categories..." />
      </div>
    );
  }

  return (
    <Card>
      <CardBody>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="category-tree">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {categoryTree.map((category, index) => (
                  <CategoryItem key={category.id} category={category} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardBody>
    </Card>
  );
};

export default CategoryTree;
