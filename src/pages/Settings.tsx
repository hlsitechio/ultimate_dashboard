import React from 'react';
import { Card, CardBody, Switch, Button, Select, SelectItem, Input } from '@nextui-org/react';
import { Bell, Moon, Sun, Globe, Shield, Key, Palette, Monitor, Volume2, Eye, Edit3 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import EmojiPicker from 'emoji-picker-react';

const Settings = () => {
  const { signOut } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { dashboardTitle, dashboardTitleColor, setDashboardTitle, setDashboardTitleColor } = useSettingsStore();
  const [notifications, setNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [language, setLanguage] = React.useState('en');
  const [timezone, setTimezone] = React.useState('UTC');
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState(dashboardTitle);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
  ];

  const timezones = [
    { label: 'UTC', value: 'UTC' },
    { label: 'EST (UTC-5)', value: 'EST' },
    { label: 'PST (UTC-8)', value: 'PST' },
    { label: 'GMT (UTC+0)', value: 'GMT' },
  ];

  const themes = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  const titleColors = [
    { label: 'White', value: 'text-white' },
    { label: 'Blue', value: 'text-blue-500' },
    { label: 'Green', value: 'text-green-500' },
    { label: 'Purple', value: 'text-purple-500' },
    { label: 'Orange', value: 'text-orange-500' },
    { label: 'Yellow', value: 'text-yellow-500' },
    { label: 'Pink', value: 'text-pink-500' },
  ];

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      setDashboardTitle(tempTitle);
      setEditingTitle(false);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setTempTitle(prevTitle => prevTitle + emojiObject.emoji);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Dashboard Settings */}
      <Card className="bg-background border-none">
        <CardBody className="gap-6">
          <div className="flex items-center gap-4">
            <Edit3 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Dashboard Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dashboard Title</p>
                <p className="text-sm text-gray-400">Customize your dashboard title</p>
              </div>
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    😊
                  </Button>
                  <Button color="primary" onPress={handleTitleSave}>Save</Button>
                  <Button variant="light" onPress={() => setEditingTitle(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`${dashboardTitleColor}`}>{dashboardTitle}</span>
                  <Button variant="light" onPress={() => setEditingTitle(true)}>Edit</Button>
                </div>
              )}
            </div>

            {showEmojiPicker && (
              <div className="absolute z-10 mt-2">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Title Color</p>
                <p className="text-sm text-gray-400">Choose the color for your dashboard title</p>
              </div>
              <Select
                defaultSelectedKeys={[dashboardTitleColor]}
                onChange={(e) => setDashboardTitleColor(e.target.value)}
                className="max-w-xs"
              >
                {titleColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <span className={color.value}>{color.label}</span>
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Rest of the settings components */}
      {/* Appearance */}
      <Card className="bg-background border-none">
        <CardBody className="gap-6">
          <div className="flex items-center gap-4">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-gray-400">Choose your preferred theme</p>
              </div>
              <Select
                defaultSelectedKeys={[theme]}
                onChange={(e) => setTheme(e.target.value as 'system' | 'light' | 'dark')}
                className="max-w-xs"
              >
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Rest of the existing settings cards */}
    </div>
  );
};

export default Settings;