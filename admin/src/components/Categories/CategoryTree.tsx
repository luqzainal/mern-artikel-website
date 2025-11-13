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
          className="p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-teal-400 transition-colors"
          style={{
            ...provided.draggableProps.style,
            color: '#1f2937', // Ensure text color is dark
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold" style={{ color: '#1f2937' }}>
                {category.nameEn}
              </p>
              <p className="text-sm" style={{ color: '#4b5563' }}>
                {category.nameMy}
              </p>
            </div>
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-full" style={{ color: '#374151' }}>
              Articles: {category._count?.articles || 0}
            </div>
          </div>
          {category.children && category.children.length > 0 && (
            <div className="pl-4 mt-2 border-l-2 border-teal-400">
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

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in same position
    if (destination.index === source.index) {
      return;
    }

    // Create a flat array of all categories with their new order
    const reorderedCategories = Array.from(flatCategories);
    const [removed] = reorderedCategories.splice(source.index, 1);
    reorderedCategories.splice(destination.index, 0, removed);

    // Update local state immediately for better UX
    setCategoryTree(buildTree(reorderedCategories));

    // Prepare updates for backend
    const updates = reorderedCategories.map((cat, index) => ({
      id: cat.id,
      order: index,
      parentId: cat.parentId,
    }));

    try {
      // Send to backend
      const response = await fetch('http://localhost:3000/api/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder categories');
      }

      // Refetch categories to get updated data
      window.location.reload();
    } catch (error) {
      console.error('Error reordering categories:', error);
      // Revert on error
      setCategoryTree(buildTree(flatCategories));
      alert('Failed to save category order. Please try again.');
    }
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
