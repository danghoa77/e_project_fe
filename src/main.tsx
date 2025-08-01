// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthLoader } from './features/auth/AuthLoader.tsx'; // Import AuthLoader


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthLoader>
        <App />
      </AuthLoader>
    </QueryClientProvider>
  </React.StrictMode>
);