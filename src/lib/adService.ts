// Ad Service integration for Monetization SDK (Zone: 11850821)
import { isTelegramWebApp } from './telegram';

declare global {
  interface Window {
    show_11850821?: (options?: any) => Promise<void>;
  }
}

let inAppInitialized = false;

/**
 * Initialize the In-App Interstitial configuration:
 * - 2 ads automatically within 0.1 hours (6 minutes)
 * - 30-second interval between them
 * - 5-second initial timeout delay
 * - Session preserved across navigation (everyPage: false)
 */
export const initInAppInterstitial = (): void => {
  if (typeof window === 'undefined') return;
  if (inAppInitialized) return;

  // In Telegram WebApp, skip aggressive automatic pop-ins to prevent webview interruption
  if (isTelegramWebApp()) {
    console.info('Telegram WebApp detected: in-app interstitial suppressed to maintain stability.');
    return;
  }

  const tryInit = () => {
    if (typeof window.show_11850821 === 'function') {
      try {
        const result = window.show_11850821({
          type: 'inApp',
          inAppSettings: {
            frequency: 2,
            capping: 0.1,
            interval: 30,
            timeout: 5,
            everyPage: false,
          },
        });

        // Ensure promise rejection is caught so it doesn't trigger unhandled 'Failed to fetch'
        if (result && typeof result.catch === 'function') {
          result.catch((err: any) => {
            console.warn('In-app ad notice caught:', err);
          });
        }
        inAppInitialized = true;
      } catch (err) {
        console.warn('Notice: In-App Interstitial ad init deferred/caught:', err);
      }
    }
  };

  // Immediate attempt
  tryInit();

  // If script is still loading asynchronously, retry with a small delay
  if (!inAppInitialized) {
    setTimeout(() => {
      tryInit();
    }, 2000);
  }
};

/**
 * Show a Rewarded Popup Ad:
 * Calls show_11850821('pop').
 * Returns true if watched/closed successfully, false if failed or blocked.
 */
export const triggerRewardedPopup = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  if (typeof window.show_11850821 === 'function') {
    try {
      const res = window.show_11850821('pop');
      if (res && typeof res.then === 'function') {
        await res.catch((e: any) => {
          console.warn('Popup ad catch:', e);
          return null;
        });
      }
      return true;
    } catch (err) {
      console.warn('Rewarded popup notice:', err);
      return false;
    }
  } else {
    // SDK not loaded or ad-blocker active
    return false;
  }
};

/**
 * Show a Rewarded Interstitial Ad:
 * Calls show_11850821().
 * Returns true if watched/completed successfully, false if failed or blocked.
 */
export const triggerRewardedInterstitial = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  if (typeof window.show_11850821 === 'function') {
    try {
      const res = window.show_11850821();
      if (res && typeof res.then === 'function') {
        await res.catch((e: any) => {
          console.warn('Rewarded interstitial notice:', e);
          return null;
        });
      }
      return true;
    } catch (err) {
      console.warn('Rewarded interstitial notice:', err);
      return false;
    }
  } else {
    // SDK not loaded or ad-blocker active
    return false;
  }
};
