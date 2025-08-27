import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { RegisterData } from '@/types';
import apiService from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'tenant',
    phone: '',
    address: '',
    // optional selected kostan id for tenants
    kostan_id: undefined,
  });
  const [kostans, setKostans] = useState<Array<any>>([]);
  const [kostansLoading, setKostansLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'owner' | 'tenant') || 'tenant';

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, role: defaultRole }));
  }, [defaultRole]);

  // Fetch kostans when role is tenant
  React.useEffect(() => {
    let mounted = true;
    const loadKostans = async () => {
      if (formData.role !== 'tenant') {
        setKostans([]);
        return;
      }

      setKostansLoading(true);
      try {
        const res = await apiService.getKostans({ per_page: 100 });
        if (mounted && res?.data) {
          // API may return paginated shape { data: [...], current_page, ... }
          const payload = res.data;
          if (Array.isArray(payload)) {
            setKostans(payload as Array<any>);
          } else if (payload.data && Array.isArray(payload.data)) {
            setKostans(payload.data as Array<any>);
          } else {
            // unknown shape: try to coerce to empty array
            setKostans([]);
          }
        }
      } catch (e) {
        // ignore: kost list is optional for registration
      }
      finally {
        setKostansLoading(false);
      }
    };

    loadKostans();

    return () => {
      mounted = false;
    };
  }, [formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  const parsedValue: any = name === 'kostan_id' ? (value === '' ? undefined : Number(value)) : value;
  setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: [err.response?.data?.message || t('error.registrationFailed')] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName]?.[0];
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('auth.signUp')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.or')}{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('auth.signInHere')}
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {errors.general[0]}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t('auth.role')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tenant">{t('auth.tenant')}</option>
                <option value="owner">{t('auth.owner')}</option>
              </select>
              {getFieldError('role') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('role')}</p>
              )}
            </div>

            {formData.role === 'tenant' && (
              <div>
                <label htmlFor="kostan_id" className="block text-sm font-medium text-gray-700">
                  {t('auth.selectKostanLabel')}
                </label>

                {kostansLoading ? (
                  <div className="mt-2 flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-600">{t('ui.loading')}</span>
                  </div>
                ) : (
                  <>
                    {kostans.length === 0 ? (
                      <div className="mt-2 text-sm text-gray-500">
                        {t('auth.noKostans')}
                      </div>
                    ) : (
                      <select
                        id="kostan_id"
                        name="kostan_id"
                        value={formData.kostan_id ?? ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">{t('auth.selectKostanPlaceholder')}</option>
                        {kostans.map(k => (
                          <option key={k.id} value={k.id}>{k.name}</option>
                        ))}
                      </select>
                    )}
                  </>
                )}

                {getFieldError('kostan_id') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('kostan_id')}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('auth.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.enterName')}
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.emailAddress')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.enterEmail')}
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('auth.phoneOptional')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.enterPhone')}
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.enterPassword')}
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.confirmPasswordPlaceholder')}
              />
              {getFieldError('password_confirmation') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password_confirmation')}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : t('auth.createAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
