import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button, Avatar } from '@nextui-org/react';
import { useAuth } from '../../hooks/useAuth';
import { FiSave, FiCamera } from 'react-icons/fi';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ProfileSettings = () => {
  const { user } = useAuth();
  
  const { control: profileControl, handleSubmit: handleProfileSubmit } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const { control: passwordControl, handleSubmit: handlePasswordSubmit } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSave = (data: any) => console.log('Update Profile:', data);
  const onPasswordSave = (data: any) => console.log('Update Password:', data);

  return (
    <div className="space-y-8">
      {/* Profile Info Form */}
      <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
        <h3 className="text-lg font-semibold">Profile Information</h3>
        <div className="flex items-center gap-4">
          <Avatar src={user?.profilePicture} className="w-20 h-20 text-large" />
          <Button startContent={<FiCamera />}>Change Picture</Button>
        </div>
        <Controller name="name" control={profileControl} render={({ field }) => <Input {...field} label="Full Name" />} />
        <Controller name="email" control={profileControl} render={({ field }) => <Input {...field} label="Email Address" />} />
        <Button type="submit" color="primary" startContent={<FiSave />}>Save Profile</Button>
      </form>
      
      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <Controller name="currentPassword" control={passwordControl} render={({ field }) => <Input {...field} label="Current Password" type="password" />} />
        <Controller name="newPassword" control={passwordControl} render={({ field }) => <Input {...field} label="New Password" type="password" />} />
        <Controller name="confirmPassword" control={passwordControl} render={({ field }) => <Input {...field} label="Confirm New Password" type="password" />} />
        <Button type="submit" color="secondary" startContent={<FiSave />}>Change Password</Button>
      </form>
    </div>
  );
};

export default ProfileSettings;
