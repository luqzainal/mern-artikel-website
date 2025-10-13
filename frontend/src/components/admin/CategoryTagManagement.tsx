import { Card, CardBody, CardHeader, Chip, Button, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import { useLanguage } from '../common/LanguageToggle'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, getTags, deleteCategory, deleteTag } from '../../services/api'

export default function CategoryTagManagement() {
  const { language } = useLanguage()
  const queryClient = useQueryClient()

  // Fetch categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories,
  })

  // Fetch tags from API
  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: getTags,
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
  })

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] })
    },
  })

  const handleAddCategory = () => {
    alert(language === 'EN' ? 'Add Category form - To be implemented' : 'Borang Tambah Kategori - Akan dilaksanakan')
  }

  const handleEditCategory = (id: string) => {
    alert(`Edit Category ${id} - To be implemented`)
  }

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`${language === 'EN' ? 'Delete category' : 'Padam kategori'} "${name}"?`)) {
      deleteCategoryMutation.mutate(id)
    }
  }

  const handleAddTag = () => {
    alert(language === 'EN' ? 'Add Tag form - To be implemented' : 'Borang Tambah Tag - Akan dilaksanakan')
  }

  const handleDeleteTag = (id: string, name: string) => {
    if (confirm(`${language === 'EN' ? 'Delete tag' : 'Padam tag'} "${name}"?`)) {
      deleteTagMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'EN' ? 'Categories & Tags' : 'Kategori & Tag'}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6 flex justify-between">
            <h3 className="text-lg font-semibold">{language === 'EN' ? 'Categories' : 'Kategori'}</h3>
            <Button size="sm" color="primary" startContent={<FiPlus />} onClick={handleAddCategory}>
              {language === 'EN' ? 'Add' : 'Tambah'}
            </Button>
          </CardHeader>
          <CardBody className="p-6">
            {categoriesLoading ? (
              <div className="flex justify-center py-8">
                <Spinner color="primary" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {language === 'EN' ? 'No categories found' : 'Tiada kategori dijumpai'}
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{language === 'EN' ? cat.nameEn : cat.nameMy}</span>
                      <Chip size="sm" variant="flat">
                        {cat._count?.articles || 0} {language === 'EN' ? 'articles' : 'artikel'}
                      </Chip>
                    </div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" className="opacity-0 group-hover:opacity-100">
                          <FiMoreVertical />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Category actions">
                        <DropdownItem
                          key="edit"
                          startContent={<FiEdit />}
                          onClick={() => handleEditCategory(cat.id)}
                        >
                          {language === 'EN' ? 'Edit' : 'Edit'}
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<FiTrash2 />}
                          onClick={() => handleDeleteCategory(cat.id, language === 'EN' ? cat.nameEn : cat.nameMy)}
                        >
                          {language === 'EN' ? 'Delete' : 'Padam'}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6 flex justify-between">
            <h3 className="text-lg font-semibold">{language === 'EN' ? 'Tags' : 'Tag'}</h3>
            <Button size="sm" color="primary" startContent={<FiPlus />} onClick={handleAddTag}>
              {language === 'EN' ? 'Add' : 'Tambah'}
            </Button>
          </CardHeader>
          <CardBody className="p-6">
            {tagsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner color="primary" />
              </div>
            ) : tags.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {language === 'EN' ? 'No tags found' : 'Tiada tag dijumpai'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <div key={tag.id} className="group relative">
                    <Chip
                      variant="flat"
                      color="primary"
                      onClose={() => handleDeleteTag(tag.id, language === 'EN' ? tag.nameEn : tag.nameMy)}
                    >
                      {language === 'EN' ? tag.nameEn : tag.nameMy} ({tag._count?.articles || 0})
                    </Chip>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
