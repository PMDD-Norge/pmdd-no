'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW: Registration successful', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('SW: Update found');
          });
        })
        .catch((error) => {
          console.log('SW: Registration failed', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}