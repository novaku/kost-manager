import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Payment } from '@/types';
import apiService from '@/services/api';
import { 
  CurrencyDollarIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;

    if (user.role === 'tenant') {
      fetchMyPayments();
    } else if (user.role === 'owner') {
      fetchOwnerPayments();
    }
  }, [user]);

  const fetchMyPayments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyPayments();
      
      if (response.success && response.data) {
        // API returns paginated response
        setPayments(response.data.data || []);
      } else {
        setError(response.message || 'Failed to fetch payments');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerPayments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPayments();

      if (response.success && response.data) {
        setPayments(response.data.data || []);
      } else {
        setError(response.message || 'Failed to fetch payments');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching payments');
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-gray-600" />;
      case 'refunded':
        return <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'monthly_rent':
        return 'bg-blue-100 text-blue-800';
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'late_fee':
        return 'bg-red-100 text-red-800';
      case 'utility':
        return 'bg-yellow-100 text-yellow-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'credit_card':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'e_wallet':
        return <CurrencyDollarIcon className="h-4 w-4" />;
      case 'virtual_account':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'cash':
        return <BanknotesIcon className="h-4 w-4" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'completed') return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPayments = payments.filter(payment => {
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    const typeMatch = typeFilter === 'all' || payment.payment_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const statusOptions = [
    { value: 'all', label: t('all') },
    { value: 'completed', label: t('payment.status.completed') },
    { value: 'pending', label: t('payment.status.pending') },
    { value: 'processing', label: t('payment.status.processing') },
    { value: 'failed', label: t('payment.status.failed') },
    { value: 'cancelled', label: t('payment.status.cancelled') },
    { value: 'refunded', label: t('payment.status.refunded') }
  ];

  const typeOptions = [
    { value: 'all', label: t('all') },
    { value: 'monthly_rent', label: t('payment.type.monthlyRent') },
    { value: 'deposit', label: t('payment.type.deposit') },
    { value: 'late_fee', label: t('payment.type.lateFee') },
    { value: 'utility', label: t('payment.type.utility') },
    { value: 'other', label: t('payment.type.other') }
  ];

  // language selector removed from UI

  // Allow both tenants and owners to access this page.
  // Only block access when there's no authenticated user.
  if (!user) {
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
            {t('payment.myPayments')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('payment.myPaymentsDesc')}
          </p>
        </div>

  {/* language switcher removed */}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('payment.filterByStatus')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('payment.filterByType')}
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {typeOptions.map((option) => (
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

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('payment.empty.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('payment.empty.description')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {payment.payment_reference}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.payment_type)}`}>
                        <span className="capitalize">{payment.payment_type.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatPrice(payment.amount)}
                      {payment.late_fee > 0 && (
                        <span className="text-sm font-normal text-red-600 ml-2">
                          (+{formatPrice(payment.late_fee)} {t('payment.lateFee')})
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {t('payment.for')} {payment.payment_for_month}
                      </span>
                      {payment.rental?.room && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-sm">
                            {payment.rental.room.kostan?.name} - {t('room')} {payment.rental.room.room_number}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <span className="ml-1 text-sm capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </span>
                      {payment.payment_gateway && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-sm capitalize">{payment.payment_gateway}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {payment.receipt_url && (
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors mb-2"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                        {t('payment.downloadReceipt')}
                      </a>
                    )}
                    
                    <Link
                      to={`/payments/${payment.id}`}
                      className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors block"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {t('view')} {t('details')}
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-gray-200 pt-4">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{t('payment.dueDate')}</span>
                    </div>
                    <p className={`font-medium ${
                      isOverdue(payment.due_date, payment.status) 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {formatDate(payment.due_date)}
                      {isOverdue(payment.due_date, payment.status) && (
                        <span className="ml-1 text-xs">
                          ({getDaysOverdue(payment.due_date)} {t('payment.daysOverdue')})
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{t('payment.createdAt')}</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(payment.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {payment.paid_at ? t('payment.paidAt') : t('payment.status')}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                        {payment.paid_at 
                        ? formatDateTime(payment.paid_at)
                        : t('payment.statusLabel')
                      }
                    </p>
                  </div>
                </div>
                
                {/* Status specific information */}
                {payment.status === 'pending' && isOverdue(payment.due_date, payment.status) && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          {t('payment.overdue')}
                        </p>
                        <p className="text-sm text-red-600">
                          {t('payment.overdueDesc', { days: getDaysOverdue(payment.due_date) })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {payment.status === 'failed' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      {t('payment.failed')}
                    </p>
                    <p className="text-sm text-red-600">
                      {t('payment.failedDesc')}
                    </p>
                  </div>
                )}
                
                {payment.status === 'processing' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      {t('payment.processing')}
                    </p>
                    <p className="text-sm text-blue-600">
                      {t('payment.processingDesc')}
                    </p>
                  </div>
                )}
                
                {payment.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {t('notes')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {payment.notes}
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

export default PaymentsPage;
