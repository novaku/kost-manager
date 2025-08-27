import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'owner' 
            ? t('dashboard.owner.welcomeText')
            : t('dashboard.tenant.welcomeText')
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.role === 'owner' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.owner.myKostans')}</h3>
              <p className="text-gray-600 mb-4">{t('dashboard.owner.myKostansDesc')}</p>
              <a
                href="/my-kostans"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                {t('button.view')} {t('nav.kostans')}
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.owner.rentalApplications')}</h3>
              <p className="text-gray-600 mb-4">{t('dashboard.owner.rentalApplicationsDesc')}</p>
              <a
                href="/rental-applications"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                {t('button.view')} {t('rental.application')}
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.tenant.browseKostans')}</h3>
              <p className="text-gray-600 mb-4">{t('dashboard.tenant.browseKostansDesc')}</p>
              <a
                href="/kostans"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                {t('button.browseKostans')}
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.tenant.myRentals')}</h3>
              <p className="text-gray-600 mb-4">{t('dashboard.tenant.myRentalsDesc')}</p>
              <a
                href="/my-rentals"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                {t('button.view')} {t('nav.myRentals')}
              </a>
            </div>
          </>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.tenant.payments')}</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === 'owner' ? t('dashboard.owner.monthlyRevenue') : t('dashboard.tenant.paymentHistory')}
          </p>
          <a
            href="/payments"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
          >
            {t('button.view')} {t('nav.payments')}
          </a>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.quickOverview')}</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">12</div>
              <div className="text-gray-600 mt-1">{t('dashboard.owner.totalKostans')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">48</div>
              <div className="text-gray-600 mt-1">{t('dashboard.owner.totalRooms')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">36</div>
              <div className="text-gray-600 mt-1">{t('dashboard.owner.occupiedRooms')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">Rp 12.000.000</div>
              <div className="text-gray-600 mt-1">{t('dashboard.owner.monthlyRevenue')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
