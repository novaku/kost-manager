import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/components/App';
import { AuthProvider } from '@/contexts/AuthContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ToastContainer from '@/components/ui/ToastContainer';

// Get the root element
const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <TranslationProvider>
                    <NotificationProvider>
                        <AuthProvider>
                            <App />
                            <ToastContainer />
                        </AuthProvider>
                    </NotificationProvider>
                </TranslationProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}
