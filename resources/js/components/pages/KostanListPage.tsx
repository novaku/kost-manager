import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';
import { Kostan, PaginationData } from '@/types';
import apiService from '@/services/api';
import { 
  MapPinIcon, 
  StarIcon, 
  BuildingOfficeIcon,
  WifiIcon,
  TruckIcon,
  AcademicCapIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import ImageWithFallback from '@/components/common/ImageWithFallback';

const KostanListPage: React.FC = () => {
  const { t } = useTranslation();
  const [kostans, setKostans] = useState<Kostan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    fetchKostans();
  }, [searchTerm, cityFilter]);

  const fetchKostans = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        ...(searchTerm && { search: searchTerm }),
        ...(cityFilter && { city: cityFilter }),
        per_page: 12
      };
      
      const response = await apiService.getKostans(params);
      
      if (response.success && response.data) {
        setKostans(response.data.data || []);
        setPagination(response.data);
      } else {
        setError(response.message || 'Failed to fetch kostans');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching kostans');
    } finally {
      setLoading(false);
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi':
      case 'wi-fi':
        return <WifiIcon className="h-4 w-4" />;
      case 'parking':
      case 'parkir':
        return <TruckIcon className="h-4 w-4" />;
      case 'laundry':
        return <AcademicCapIcon className="h-4 w-4" />;
      case 'security':
      case 'keamanan':
        return <ShieldCheckIcon className="h-4 w-4" />;
      default:
        return <BuildingOfficeIcon className="h-4 w-4" />;
    }
  };

  // Safely format rating values that may be null, string, or number.
  const formatRating = (value: unknown) => {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(1) : '0.0';
  };


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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('kostans.browse.title')}
        </h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('kostans.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('kostans.filter.allCities')}</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Yogyakarta">Yogyakarta</option>
              <option value="Semarang">Semarang</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {kostans.length === 0 && !loading ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('kostans.empty.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('kostans.empty.description')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kostans.map((kostan) => (
              <Link
                key={kostan.id}
                to={`/kostans/${kostan.id}`}
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
                    {formatRating(kostan.average_rating)}
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
                  
                  {/* Facilities */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {kostan.facilities?.slice(0, 3).map((facility, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs">
                        {getFacilityIcon(facility)}
                        <span className="ml-1 capitalize">{facility}</span>
                      </div>
                    ))}
                    {kostan.facilities && kostan.facilities.length > 3 && (
                      <div className="bg-gray-100 rounded-full px-2 py-1 text-xs">
                        +{kostan.facilities.length - 3} {t('more')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {kostan.total_rooms} {t('kostans.rooms')}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {t('kostans.viewDetails')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => fetchKostans(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('pagination.previous')}
                </button>
                
                {[...Array(pagination.last_page)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchKostans(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.current_page === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => fetchKostans(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('pagination.next')}
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KostanListPage;
