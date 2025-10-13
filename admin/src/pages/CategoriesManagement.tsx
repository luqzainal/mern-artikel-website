import CategoryTree from '../components/Categories/CategoryTree';
import CategoryForm from '../components/Categories/CategoryForm';
import { Button } from '@nextui-org/react';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';

export default function CategoriesManagement() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
          <p className="text-gray-600 mt-2">
            Organize articles by creating and managing a hierarchical category structure.
          </p>
        </div>
        <Button
          className="bg-green-500 text-white"
          startContent={<FiPlus />}
          onPress={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Hide Form' : 'Add New Category'}
        </Button>
      </div>
      
      {isFormVisible && (
        <div className="mb-8">
          <CategoryForm />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Category Structure</h2>
          <CategoryTree />
        </div>
        <div>
          {/* This area can be used for displaying details of a selected category */}
        </div>
      </div>
    </div>
  );
}
