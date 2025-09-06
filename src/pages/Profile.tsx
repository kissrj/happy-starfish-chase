"use client";

import { MadeWithDyad } from '@/components/made-with-dyad';
import { useAuth } from '@/context/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileForm from '@/components/ProfileForm';

const Profile = () => {
  const { user } = useAuth();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    loading,
    isUpdating,
    handleUpdateProfile,
  } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <ProfileForm
          user={user}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          loading={loading}
          isUpdating={isUpdating}
          onSubmit={handleUpdateProfile}
        />
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Profile;