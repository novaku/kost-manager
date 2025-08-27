import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/', icon: HomeIcon },
    { name: t('nav.kostans'), href: '/kostans', icon: BuildingOfficeIcon },
  ];

  const userNavigation = isAuthenticated ? [
  { name: t('nav.dashboard'), href: '/dashboard' },
    ...(user?.role === 'owner' ? [{ name: t('nav.myKostans'), href: '/my-kostans' }] : []),
    ...(user?.role === 'tenant' ? [{ name: t('nav.myRentals'), href: '/my-rentals' }] : []),
    { name: t('nav.payments'), href: '/payments' },
  ] : [
    { name: t('nav.login'), href: '/login' },
    { name: t('nav.register'), href: '/register' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile-first header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between sm:px-6 sm:py-4">
        <Link to="/" className="text-lg font-bold text-blue-600 sm:text-xl">KostManager</Link>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher className="mr-1" />
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-700 p-2 sm:hidden"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Desktop navigation */}
      <nav className="hidden sm:flex bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
            <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {userNavigation.filter(item => item.href !== '/profile').map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <UserIcon className="w-5 h-5 mr-1" />
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      item.name === t('nav.register')
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 sm:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 border-t border-gray-200 pt-3">
              {isAuthenticated ? (
                <>
                  <div className="mb-2">
                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-base font-medium ${
                        item.name === t('nav.register')
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 py-2 sm:px-6 sm:py-6">
        {children}
      </main>

      {/* Mobile bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex sm:hidden">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 ${
                isActive
                  ? 'text-blue-600 border-t-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-2 text-xs text-gray-500 sm:py-4 sm:text-sm mt-auto">
        © 2025 KostManager. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
