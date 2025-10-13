import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import GeneralSettings from '../components/Settings/GeneralSettings';
import LanguageSettings from '../components/Settings/LanguageSettings';
import SEOSettings from '../components/Settings/SEOSettings';
import ProfileSettings from '../components/Settings/ProfileSettings';
import { FiSettings, FiGlobe, FiTrendingUp, FiUser } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure system, profile, and display settings for the application.
        </p>
      </div>

      <div className="flex w-full flex-col">
        <Tabs aria-label="Settings Options">
          <Tab
            key="general"
            title={
              <div className="flex items-center space-x-2">
                <FiSettings />
                <span>General</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <GeneralSettings />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="language"
            title={
              <div className="flex items-center space-x-2">
                <FiGlobe />
                <span>Language</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <LanguageSettings />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="seo"
            title={
              <div className="flex items-center space-x-2">
                <FiTrendingUp />
                <span>SEO</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <SEOSettings />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="profile"
            title={
              <div className="flex items-center space-x-2">
                <FiUser />
                <span>Profile</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <ProfileSettings />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
