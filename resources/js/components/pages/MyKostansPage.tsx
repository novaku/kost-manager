import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Kostan } from '@/types';
import apiService from '@/services/api';
import { 
  PlusIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import ImageWithFallback from '@/components/common/ImageWithFallback';

const MyKostansPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [kostans, setKostans] = useState<Kostan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchMyKostans();
    }
  }, [user]);

  const fetchMyKostans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyKostans();
      
      if (response.success && response.data) {
        setKostans(response.data.data || []);
      } else {
        setError(response.message || 'Failed to fetch kostans');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching kostans');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKostan = async (id: number) => {
    if (!confirm(t('kostans.delete.confirm'))) {
      return;
    }

    try {
      const response = await apiService.deleteKostan(id);
      
      if (response.success) {
        setKostans(kostans.filter(kostan => kostan.id !== id));
      } else {
        alert(response.message || 'Failed to delete kostan');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred while deleting kostan');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getMinPrice = (kostan: Kostan) => {
    if (!kostan.rooms || kostan.rooms.length === 0) return 0;
    return Math.min(...kostan.rooms.map(room => room.monthly_price));
  };

  const getMaxPrice = (kostan: Kostan) => {
    if (!kostan.rooms || kostan.rooms.length === 0) return 0;
    return Math.max(...kostan.rooms.map(room => room.monthly_price));
  };

  const getAvailableRooms = (kostan: Kostan) => {
    if (!kostan.rooms) return 0;
    return kostan.rooms.filter(room => room.status === 'available').length;
  };

  const getOccupiedRooms = (kostan: Kostan) => {
    if (!kostan.rooms) return 0;
    return kostan.rooms.filter(room => room.status === 'occupied').length;
  };

  if (user?.role !== 'owner') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{t('auth.unauthorized')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('kostans.myKostans')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('kostans.myKostansDesc')}
          </p>
        </div>
        <Link
          to="/kostans/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('kostans.create')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {kostans.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('kostans.empty.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">
            {t('kostans.empty.ownerDescription')}
          </p>
          <Link
            to="/kostans/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('kostans.create')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kostans.map((kostan) => (
            <div
              key={kostan.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="relative h-48 bg-gray-200">
                {kostan.images && kostan.images.length > 0 ? (
                  <ImageWithFallback
                    src={kostan.images[0]}
                    alt={kostan.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithFallback
                    src={undefined}
                    alt={kostan.name}
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                  <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                  {typeof kostan.average_rating === 'number' ? kostan.average_rating.toFixed(1) : (kostan.average_rating ? String(kostan.average_rating) : '-')}
                </div>
                
                <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                  kostan.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {kostan.is_active ? t('active') : t('inactive')}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {kostan.name}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{kostan.city}, {kostan.province}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {kostan.description}
                </p>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">
                      {kostan.total_rooms} {t('rooms')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">
                      {getOccupiedRooms(kostan)}/{kostan.total_rooms} {t('occupied')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">
                      {kostan.rooms && kostan.rooms.length > 0 ? (
                        getMinPrice(kostan) === getMaxPrice(kostan) 
                          ? formatPrice(getMinPrice(kostan))
                          : `${formatPrice(getMinPrice(kostan))} - ${formatPrice(getMaxPrice(kostan))}`
                      ) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      getAvailableRooms(kostan) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getAvailableRooms(kostan)} {t('available')}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    to={`/kostans/${kostan.id}`}
                    className="flex-1 bg-blue-50 text-blue-600 text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {t('view')}
                  </Link>
                  <Link
                    to={`/kostans/${kostan.id}/edit`}
                    className="flex-1 bg-yellow-50 text-yellow-600 text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    {t('edit')}
                  </Link>
                  <button
                    onClick={() => handleDeleteKostan(kostan.id)}
                    className="bg-red-50 text-red-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyKostansPage;
