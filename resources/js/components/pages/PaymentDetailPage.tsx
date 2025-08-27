import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useNotification } from '@/contexts/NotificationContext';
import apiService from '@/services/api';
import { Payment } from '@/types';
import { CurrencyDollarIcon, DocumentArrowDownIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

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
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-gray-600" />;
      case 'refunded':
        return <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useNotification();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const resp = await apiService.getPayment(Number(id));
        if (resp.success && resp.data) {
          setPayment(resp.data);
        } else {
          setError(resp.message || t('error.notFound'));
        }
      } catch (err: any) {
        setError(err.message || t('error.server'));
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id, t]);

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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{t('payment.empty.title')}</h3>
        <p className="mt-1 text-sm text-gray-500">{t('payment.empty.description')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('payment.payment')} #{payment.id}</h1>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-600 mr-3">{payment.payment_reference}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
              {getStatusIcon(payment.status)}
              <span className="ml-1">{t(`payment.statuses.${payment.status}`) || payment.status}</span>
            </span>
          </div>
        </div>
        <div className="space-x-2 text-right">
          {payment.receipt_url && (
            <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100">
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              {t('payment.downloadReceipt')}
            </a>
          )}
          <Link to="/payments" className="inline-flex items-center px-3 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100">
            {t('payment.backToList') || t('back')}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-2xl font-bold text-gray-900 mb-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(payment.amount)}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">{t('payment.for')}</div>
            <div className="font-medium text-gray-900">{payment.payment_for_month}</div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">{t('payment.dueDate')}</div>
            <div className="font-medium text-gray-900">{new Date(payment.due_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">{t('payment.createdAt')}</div>
            <div className="font-medium text-gray-900">{new Date(payment.created_at).toLocaleString('id-ID')}</div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">{t('payment.paidAt')}</div>
            <div className="font-medium text-gray-900">{payment.paid_at ? new Date(payment.paid_at).toLocaleString('id-ID') : (t(`payment.statuses.${payment.status}`) || payment.status)}</div>
          </div>

          {payment.notes && (
            <div className="md:col-span-2">
              <div className="text-gray-600 mb-1">{t('notes')}</div>
              <div className="font-medium text-gray-900">{payment.notes}</div>
            </div>
          )}
        </div>

        {/* Step-by-step for pending payments (Menunggu) - tenant flow */}
        {payment.status === 'pending' && user?.role === 'tenant' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-md p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">{t('payment.statuses.pending')} - {t('payment.messages.paymentPending')}</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
              <li>
                <div className="font-medium">{t('payment.date')}</div>
                <div>{new Date(payment.due_date).toLocaleDateString('id-ID')} {new Date(payment.due_date).toLocaleTimeString('id-ID')}</div>
              </li>

              <li>
                <div className="font-medium">{t('payment.for')}</div>
                <div>{payment.payment_for_month} • {payment.rental?.room?.kostan?.name || ''}</div>
                <div className="text-xs text-gray-600 mt-1">{t('payment.reference')}: <span className="font-mono">{payment.payment_reference}</span></div>
              </li>

              <li>
                <div className="font-medium">{t('button.upload')} {t('payment.receipt')}</div>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !id) return;
                      // basic client-side validation
                      if (file.size > 5 * 1024 * 1024) {
                        showToast('error', t('form.validation.fileTooLarge'));
                        return;
                      }

                      try {
                        setUploading(true);
                        setUploadProgress(0);
                        const form = new FormData();
                        form.append('receipt', file);

                        // Use the new API method that accepts multipart and reports progress
                        const resp = await apiService.processPaymentWithReceipt(Number(id), form, (progressEvent) => {
                          if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percent);
                          }
                        });
                        if (resp.success) {
                          showToast('success', resp.message || t('success.uploaded'));
                          // refresh payment
                          const refreshed = await apiService.getPayment(Number(id));
                          if (refreshed.success && refreshed.data) setPayment(refreshed.data);
                        } else {
                          showToast('error', resp.message || t('error.fileUpload'));
                        }
                      } catch (err: any) {
                        showToast('error', err?.response?.data?.message || err?.message || t('error.fileUpload'));
                      } finally {
                        setUploading(false);
                        setTimeout(() => setUploadProgress(0), 800);
                      }
                    }}
                    className="block w-full text-sm text-gray-700"
                  />
                  {uploading && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <div className="mt-1 text-sm text-gray-600">{uploadProgress}%</div>
                    </div>
                  )}
                  {payment.receipt_url && (
                    <div className="mt-2 text-sm">
                      <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{t('payment.downloadReceipt')}</a>
                    </div>
                  )}
                </div>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailPage;
