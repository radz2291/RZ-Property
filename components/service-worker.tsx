'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        // In development, use a different scope for the service worker
        // This prevents issues with Next.js hot reloading
        const swScope = process.env.NODE_ENV === 'production' ? '/' : '/sw/';
        
        navigator.serviceWorker.register('/sw.js', { scope: swScope })
          .then(
            function(registration) {
              console.log('🚀 ServiceWorker registration successful with scope: ', registration.scope);
            },
            function(err) {
              console.error('⚠️ ServiceWorker registration failed: ', err);
            }
          );
      });
    }
  }, []);

  return null;
}
