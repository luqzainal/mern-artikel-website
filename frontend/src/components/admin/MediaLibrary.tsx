import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Spinner, Image } from '@nextui-org/react'
import { FiUpload, FiTrash2, FiCopy } from 'react-icons/fi'
import { useLanguage } from '../common/LanguageToggle'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMedia, uploadImage, deleteMedia } from '../../services/api'
import { useState, useRef } from 'react'

export default function MediaLibrary() {
  const { language } = useLanguage()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch media from API
  const { data: mediaFiles = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => getMedia(),
  }) as { data: any[]; isLoading: boolean }

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, altText }: { file: File; altText: string }) =>
      uploadImage(file, altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      handleCloseModal()
    },
  })

  // Delete media mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUploadClick = () => {
    setSelectedFile(null)
    setAltText('')
    setPreviewUrl('')
    onOpen()
  }

  const handleCloseModal = () => {
    setSelectedFile(null)
    setAltText('')
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      alert(language === 'EN' ? 'Please select a file' : 'Sila pilih fail')
      return
    }
    uploadMutation.mutate({ file: selectedFile, altText })
  }

  const handleDelete = (id: string, filename: string) => {
    if (confirm(`${language === 'EN' ? 'Delete' : 'Padam'} "${filename}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert(language === 'EN' ? 'URL copied to clipboard' : 'URL disalin ke papan klip')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{language === 'EN' ? 'Media Library' : 'Perpustakaan Media'}</h2>
        <Button color="primary" startContent={<FiUpload />} onClick={handleUploadClick}>
          {language === 'EN' ? 'Upload Image' : 'Muat Naik Gambar'}
        </Button>
      </div>

      <Card>
        <CardBody className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="primary" />
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <FiUpload className="mx-auto mb-4" size={48} />
              <p>{language === 'EN' ? 'No media files yet' : 'Tiada fail media lagi'}</p>
              <p className="text-sm mt-2">
                {language === 'EN'
                  ? 'Upload images to use in your articles'
                  : 'Muat naik gambar untuk digunakan dalam artikel'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaFiles.map((media: any) => (
                <Card key={media.id} className="group relative">
                  <CardBody className="p-0">
                    <Image
                      src={media.url}
                      alt={media.altText || media.filename}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{media.filename}</p>
                      <p className="text-xs text-gray-500">{(media.fileSize / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => handleCopyUrl(media.url)}
                      >
                        <FiCopy />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => handleDelete(media.id, media.filename)}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Upload Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
        <ModalContent>
          <ModalHeader>
            {language === 'EN' ? 'Upload Image' : 'Muat Naik Gambar'}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              {previewUrl && (
                <div className="border rounded-lg p-2">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-64 object-contain"
                  />
                </div>
              )}
              <Input
                label={language === 'EN' ? 'Alt Text (Optional)' : 'Teks Alt (Pilihan)'}
                placeholder={language === 'EN' ? 'Describe this image...' : 'Huraikan gambar ini...'}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={handleCloseModal}>
              {language === 'EN' ? 'Cancel' : 'Batal'}
            </Button>
            <Button
              color="primary"
              onPress={handleUploadSubmit}
              isLoading={uploadMutation.isPending}
              isDisabled={!selectedFile}
            >
              {language === 'EN' ? 'Upload' : 'Muat Naik'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
