import { Card, CardBody, CardHeader, Input, Textarea, Switch, Button, Divider } from '@nextui-org/react'
import { useLanguage } from '../common/LanguageToggle'
import { useState } from 'react'
import { FiSave } from 'react-icons/fi'

export default function Settings() {
  const { language } = useLanguage()

  const [settings, setSettings] = useState({
    siteName: 'Qalam Al-Ilm',
    siteDescription: 'A platform for Islamic knowledge and articles',
    seoTitle: 'Qalam Al-Ilm - Knowledge and Guidance',
    seoDescription: 'Explore authentic Islamic articles covering Aqidah, Fiqh, Seerah, and more.',
    seoKeywords: 'Islamic articles, Islamic knowledge, Aqidah, Fiqh, Seerah',
    googleAnalyticsId: '',
    enableComments: true,
    enableGuestReading: true,
    maintenanceMode: false,
  })

  const handleSave = () => {
    // TODO: Implement save to backend API
    alert(language === 'EN' ? 'Settings saved successfully!' : 'Tetapan berjaya disimpan!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {language === 'EN' ? 'System Settings' : 'Tetapan Sistem'}
      </h2>

      {/* General Settings */}
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">
            {language === 'EN' ? 'General Settings' : 'Tetapan Umum'}
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <Input
            label={language === 'EN' ? 'Site Name' : 'Nama Laman'}
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
          />
          <Textarea
            label={language === 'EN' ? 'Site Description' : 'Penerangan Laman'}
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            minRows={3}
          />
        </CardBody>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">
            {language === 'EN' ? 'SEO Settings' : 'Tetapan SEO'}
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <Input
            label={language === 'EN' ? 'SEO Title' : 'Tajuk SEO'}
            description={language === 'EN' ? 'Appears in search engine results' : 'Paparan di hasil carian'}
            value={settings.seoTitle}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
          />
          <Textarea
            label={language === 'EN' ? 'SEO Description' : 'Penerangan SEO'}
            description={language === 'EN' ? 'Meta description for search engines' : 'Meta penerangan untuk enjin carian'}
            value={settings.seoDescription}
            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
            minRows={3}
            maxLength={160}
          />
          <Input
            label={language === 'EN' ? 'SEO Keywords' : 'Kata Kunci SEO'}
            description={language === 'EN' ? 'Comma-separated keywords' : 'Kata kunci dipisahkan dengan koma'}
            value={settings.seoKeywords}
            onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
          />
        </CardBody>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">
            {language === 'EN' ? 'Analytics' : 'Analitik'}
          </h3>
        </CardHeader>
        <CardBody className="p-6">
          <Input
            label="Google Analytics ID"
            placeholder="G-XXXXXXXXXX"
            value={settings.googleAnalyticsId}
            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
          />
        </CardBody>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-0 pt-6 px-6">
          <h3 className="text-lg font-semibold">
            {language === 'EN' ? 'Features' : 'Ciri-ciri'}
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {language === 'EN' ? 'Enable Comments' : 'Aktifkan Komen'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'EN'
                  ? 'Allow users to comment on articles'
                  : 'Benarkan pengguna mengomen artikel'}
              </p>
            </div>
            <Switch
              isSelected={settings.enableComments}
              onValueChange={(val) => setSettings({ ...settings, enableComments: val })}
            />
          </div>

          <Divider />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {language === 'EN' ? 'Guest Reading' : 'Bacaan Tetamu'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'EN'
                  ? 'Allow non-logged-in users to read articles'
                  : 'Benarkan pengguna tanpa log masuk membaca artikel'}
              </p>
            </div>
            <Switch
              isSelected={settings.enableGuestReading}
              onValueChange={(val) => setSettings({ ...settings, enableGuestReading: val })}
            />
          </div>

          <Divider />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-danger">
                {language === 'EN' ? 'Maintenance Mode' : 'Mod Penyelenggaraan'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'EN'
                  ? 'Disable public access to the site'
                  : 'Tutup akses awam ke laman'}
              </p>
            </div>
            <Switch
              color="danger"
              isSelected={settings.maintenanceMode}
              onValueChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
            />
          </div>
        </CardBody>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          color="primary"
          size="lg"
          startContent={<FiSave />}
          onClick={handleSave}
        >
          {language === 'EN' ? 'Save Settings' : 'Simpan Tetapan'}
        </Button>
      </div>
    </div>
  )
}
