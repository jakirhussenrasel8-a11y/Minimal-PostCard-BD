import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initTelegramWebApp } from './lib/telegram';

// Initialize Telegram WebApp if running inside Telegram
try {
  initTelegramWebApp();
} catch (e) {
  console.warn('Telegram WebApp setup notice:', e);
}

// Intercept background network & ad fetch rejections so they never crash the UI
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = String(reason?.message || reason || '');
    if (
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError') ||
      msg.includes('Load failed') ||
      msg.includes('libtl') ||
      msg.includes('show_11850821') ||
      msg.includes('Telegram') ||
      msg.includes('CloudStorage') ||
      msg.includes('WebAppMethodUnsupported')
    ) {
      console.warn('Silently handled unhandled rejection:', msg);
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = String(event?.message || '');
    if (
      msg.includes('CloudStorage') ||
      msg.includes('WebAppMethodUnsupported') ||
      msg.includes('libtl') ||
      msg.includes('show_11850821')
    ) {
      console.warn('Silently handled window error:', msg);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

