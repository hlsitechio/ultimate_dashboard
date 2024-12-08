import React from 'react';
import { Card, CardBody, Button, Input, Avatar, Divider, Switch } from '@nextui-org/react';
import { 
  Camera, 
  Mail, 
  Github, 
  Calendar, 
  Linkedin, 
  Twitter, 
  Upload, 
  Bell,
  Shield,
  Key,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signInWithProvider } = useAuthStore();
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [bio, setBio] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const connections = [
    {
      name: 'Google Calendar',
      icon: Calendar,
      connected: false,
      color: 'text-blue-500',
      provider: 'google',
      description: 'Sync your calendar events'
    },
    {
      name: 'GitHub',
      icon: Github,
      connected: false,
      color: 'text-gray-400',
      provider: 'github',
      description: 'Connect for code integration'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      connected: false,
      color: 'text-blue-600',
      provider: 'linkedin',
      description: 'Professional networking'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      connected: false,
      color: 'text-blue-400',
      provider: 'twitter',
      description: 'Social media integration'
    }
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;

    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      // Convert image to base64 for local storage
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        localStorage.setItem('profileImage', base64String);
        window.location.reload();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      localStorage.setItem('displayName', displayName);
      localStorage.setItem('bio', bio);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      await signInWithProvider(provider as 'google' | 'github');
    } catch (error) {
      console.error('Error connecting account:', error);
      alert('Failed to connect account');
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      localStorage.clear();
      navigate('/signin');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      {/* Profile Information */}
      <Card className="bg-background border-none">
        <CardBody className="gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                src={localStorage.getItem('profileImage') || user?.photoURL || undefined}
                name={displayName?.charAt(0) || user?.email?.charAt(0)}
                className="w-24 h-24 text-large"
              />
              <Button
                isIconOnly
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-8 h-8 min-w-0"
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploading}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{displayName || 'Set your name'}</h3>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <Divider />

          <div className="grid gap-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              classNames={{
                input: "bg-background/50",
                inputWrapper: "bg-background/50"
              }}
            />

            <Input
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              classNames={{
                input: "bg-background/50",
                inputWrapper: "bg-background/50"
              }}
            />

            <div className="flex justify-end">
              <Button
                color="primary"
                onPress={handleUpdateProfile}
                isLoading={saving}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Rest of the profile sections remain unchanged */}
      {/* Security Settings */}
      <Card className="bg-background border-none">
        <CardBody className="gap-6">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Security Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch
                isSelected={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
              />
            </div>

            <Button
              startContent={<Key className="h-4 w-4" />}
              color="primary"
              variant="flat"
              className="w-full justify-start"
            >
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Connected Services */}
      <Card className="bg-background border-none">
        <CardBody className="gap-6">
          <div className="flex items-center gap-4">
            <Upload className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Connected Services</h2>
          </div>
          
          <p className="text-sm text-gray-400">Connect your accounts to enable additional features</p>

          <div className="space-y-4">
            {connections.map((connection) => {
              const Icon = connection.icon;
              return (
                <div key={connection.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className={`h-6 w-6 ${connection.color}`} />
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <p className="text-sm text-gray-400">
                        {connection.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    color={connection.connected ? "danger" : "primary"}
                    variant={connection.connected ? "light" : "solid"}
                    onPress={() => handleConnect(connection.provider)}
                  >
                    {connection.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Account Management */}
      <Card className="bg-background border-none">
        <CardBody className="gap-6">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Account Management</h2>
          </div>

          <div className="space-y-4">
            <Button
              startContent={<Download className="h-4 w-4" />}
              color="primary"
              variant="flat"
              className="w-full justify-start"
            >
              Export Account Data
            </Button>

            <Button
              startContent={<Trash2 className="h-4 w-4" />}
              color="danger"
              variant="flat"
              className="w-full justify-start"
              onPress={handleDeleteAccount}
            >
              Delete Account
            </Button>

            <div className="text-sm text-gray-400 flex items-start gap-2 mt-4">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-1" />
              <p>
                Deleting your account will permanently remove all your data, including notes,
                calendar events, and preferences. This action cannot be undone.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;