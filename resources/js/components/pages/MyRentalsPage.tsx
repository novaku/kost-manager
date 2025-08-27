import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Rental } from '@/types';
import apiService from '@/services/api';
import { 
  CalendarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const MyRentalsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.role === 'tenant') {
      fetchMyRentals();
    }
  }, [user]);

  const fetchMyRentals = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyRentals();
      
      if (response.success && response.data) {
        setRentals(response.data.data || []);
      } else {
        setError(response.message || 'Failed to fetch rentals');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching rentals');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'terminated':
        return <XCircleIcon className="h-5 w-5 text-gray-600" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredRentals = statusFilter === 'all' 
    ? rentals 
    : rentals.filter(rental => rental.status === statusFilter);

  const statusOptions = [
    { value: 'all', label: t('all') },
    { value: 'active', label: t('rental.status.active') },
    { value: 'pending', label: t('rental.status.pending') },
    { value: 'expired', label: t('rental.status.expired') },
    { value: 'terminated', label: t('rental.status.terminated') },
    { value: 'rejected', label: t('rental.status.rejected') }
  ];

  if (user?.role !== 'tenant') {
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            {t('rental.myRentals')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('rental.myRentalsDesc')}
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="min-w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {filteredRentals.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {statusFilter === 'all' ? t('rental.empty.title') : t('rental.empty.filtered')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">
            {statusFilter === 'all' ? t('rental.empty.description') : t('rental.empty.filteredDesc')}
          </p>
          {statusFilter === 'all' && (
            <Link
              to="/kostans"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              {t('rental.browseRooms')}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRentals.map((rental) => (
            <div key={rental.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {rental.room?.kostan?.name} - {t('room')} {rental.room?.room_number}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                        {getStatusIcon(rental.status)}
                        <span className="ml-1 capitalize">{rental.status}</span>
                      </span>
                    </div>
                    
                    {rental.room?.kostan && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {rental.room.kostan.address}, {rental.room.kostan.city}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {formatPrice(rental.monthly_rent)} {t('per')} {t('month')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Link
                      to={`/rentals/${rental.id}`}
                      className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {t('view')} {t('details')}
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{t('rental.startDate')}</span>
                    </div>
                    <p className="font-medium">{formatDate(rental.start_date)}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{t('rental.endDate')}</span>
                    </div>
                    <p className="font-medium">{formatDate(rental.end_date)}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>{t('rental.deposit')}</span>
                    </div>
                    <p className="font-medium">{formatPrice(rental.deposit_paid)}</p>
                  </div>
                </div>
                
                {/* Status specific information */}
                {rental.status === 'active' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {t('rental.activeRental')}
                        </p>
                        <p className="text-sm text-green-600">
                          {getDaysUntilExpiry(rental.end_date) > 0 
                            ? `${getDaysUntilExpiry(rental.end_date)} ${t('rental.daysUntilExpiry')}`
                            : t('rental.expired')
                          }
                        </p>
                      </div>
                      {rental.next_payment_due && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-800">
                            {t('rental.nextPayment')}
                          </p>
                          <p className="text-sm text-green-600">
                            {formatDate(rental.next_payment_due)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {rental.status === 'pending' && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">
                      {t('rental.pendingApproval')}
                    </p>
                    <p className="text-sm text-yellow-600">
                      {t('rental.pendingDesc')}
                    </p>
                  </div>
                )}
                
                {rental.status === 'rejected' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      {t('rental.rejected')}
                    </p>
                    {rental.termination_reason && (
                      <p className="text-sm text-red-600">
                        {t('reason')}: {rental.termination_reason}
                      </p>
                    )}
                  </div>
                )}
                
                {rental.status === 'expired' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      {t('rental.expired')}
                    </p>
                    <p className="text-sm text-red-600">
                      {t('rental.expiredOn')} {formatDate(rental.end_date)}
                    </p>
                  </div>
                )}
                
                {rental.status === 'terminated' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">
                      {t('rental.terminated')}
                    </p>
                    {rental.terminated_at && (
                      <p className="text-sm text-gray-600">
                        {t('rental.terminatedOn')} {formatDate(rental.terminated_at)}
                      </p>
                    )}
                    {rental.termination_reason && (
                      <p className="text-sm text-gray-600">
                        {t('reason')}: {rental.termination_reason}
                      </p>
                    )}
                  </div>
                )}
                
                {rental.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {t('notes')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {rental.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentalsPage;
