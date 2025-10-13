import { useState } from 'react'
import { Card, CardBody, CardHeader, Input, Button, Avatar, Divider } from '@nextui-org/react'
import { FiSave, FiUpload } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../services/api'

export default function ProfileSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  })

  const [uploading, setUploading] = useState(false)

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.put(`/api/users/${user?.id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      alert('Profil berjaya dikemaskini!')
    },
  })

  const handleSave = () => {
    updateProfileMutation.mutate(formData)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axiosInstance.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setFormData((prev) => ({
        ...prev,
        profilePicture: response.data.url,
      }))
    } catch (error) {
      alert('Gagal upload gambar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tetapan Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kemaskini maklumat profil anda
          </p>
        </div>

        {/* Profile Picture */}
        <Card>
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gambar Profil</h3>
            <div className="flex items-center gap-6">
              <Avatar
                src={formData.profilePicture}
                name={formData.name}
                className="w-24 h-24"
                isBordered
                color="primary"
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <label htmlFor="profile-upload">
                  <Button
                    as="span"
                    color="primary"
                    variant="flat"
                    startContent={<FiUpload />}
                    isLoading={uploading}
                  >
                    Upload Gambar
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG atau GIF. Maksimum 2MB.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-lg font-semibold">Maklumat Peribadi</h3>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <Input
              label="Nama"
              placeholder="Nama penuh anda"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              isReadOnly
              description="Email tidak boleh ditukar"
            />
            <Input
              label="Bio"
              placeholder="Tulis sedikit tentang diri anda"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </CardBody>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-lg font-semibold">Maklumat Akaun</h3>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Peranan</p>
                <p className="text-sm text-gray-500">{user?.role?.name}</p>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Status Akaun</p>
                <p className="text-sm text-gray-500">
                  {user?.isActive ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Tarikh Daftar</p>
                <p className="text-sm text-gray-500">
                  {new Date(user?.createdAt || '').toLocaleDateString('ms-MY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="light"
            onClick={() => window.history.back()}
          >
            Batal
          </Button>
          <Button
            color="primary"
            startContent={<FiSave />}
            onClick={handleSave}
            isLoading={updateProfileMutation.isPending}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  )
}
