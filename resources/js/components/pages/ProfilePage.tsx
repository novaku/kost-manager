import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import Avatar from '@/components/ui/Avatar';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.profile')}</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Data profil pengguna */}
        <div className="flex flex-col items-center">
          <Avatar
            name="Nama Pengguna"
            src={null}
            size={96}
            className="mb-4 border"
            alt="Avatar"
          />
          <h2 className="text-xl font-semibold mb-2">Nama Pengguna</h2>
          <p className="text-gray-600 mb-1">Email: pengguna@email.com</p>
          <p className="text-gray-600 mb-1">Nomor Telepon: 08123456789</p>
          <p className="text-gray-600 mb-1">Peran: Pemilik</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profil</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
