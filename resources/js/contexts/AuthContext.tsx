import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '@/types';
import apiService from '@/services/api';
import { useNotification } from './NotificationContext';
import { useTranslation } from './TranslationContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotification();
  const { t } = useTranslation();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Verify token is still valid
        apiService.getProfile()
          .then((response) => {
            if (response.success && response.data) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          })
          .catch(() => {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        // Invalid stored user data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        showToast('success', t('success.loginSuccess'));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      // Clear any existing data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        
        // Store token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setUser(newUser);
        showToast('success', t('success.registrationSuccess'));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      // Clear any existing data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      
      throw error;
    }
  };

  const logout = (): void => {
    // Call logout API (don't wait for response)
    apiService.logout().catch(() => {
      // Ignore errors during logout
    });
    
    // Clear local storage and state
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    
    showToast('info', t('auth.login.logout'));
    
    // Redirect to home
    window.location.href = '/';
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const response = await apiService.updateProfile(userData);
      
      if (response.success && response.data) {
        const updatedUser = response.data.user;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showToast('success', t('success.profileUpdated'));
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
