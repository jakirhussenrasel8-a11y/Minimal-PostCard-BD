/**
 * Telegram Web App and In-App Browser integration helper
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: Record<string, any>;
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
          show(): void;
          hide(): void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText(text: string): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          showProgress(leaveActive?: boolean): void;
          hideProgress(): void;
        };
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
          notificationOccurred(type: 'error' | 'success' | 'warning'): void;
          selectionChanged(): void;
        };
        isVersionAtLeast?(version: string): boolean;
        CloudStorage?: {
          setItem(key: string, value: string, callback?: (err: Error | null, success?: boolean) => void): any;
          getItem(key: string, callback: (err: Error | null, result?: string | null) => void): any;
          getItems(keys: string[], callback: (err: Error | null, result?: Record<string, string | null>) => void): any;
          removeItem(key: string, callback?: (err: Error | null, success?: boolean) => void): any;
          removeItems(keys: string[], callback?: (err: Error | null, success?: boolean) => void): any;
          getKeys(callback: (err: Error | null, keys?: string[]) => void): any;
        };
        ready(): void;
        expand(): void;
        close(): void;
        setHeaderColor(color: string): void;
        setBackgroundColor(color: string): void;
        enableClosingConfirmation(): void;
        openLink(url: string, options?: { try_instant_view?: boolean }): void;
        openTelegramLink(url: string): void;
        downloadFile?(params: { url: string; file_name: string }): void;
      };
    };
  }
}

/**
 * Checks if current runtime is inside Telegram (WebApp or In-App Browser)
 */
export function isTelegram(): boolean {
  if (typeof window === 'undefined') return false;

  // Telegram WebApp detection
  if (window.Telegram?.WebApp?.initData) return true;
  if (typeof window.location !== 'undefined') {
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    if (
      search.includes('tgWebAppData') ||
      hash.includes('tgWebAppData') ||
      search.includes('tgWebAppPlatform') ||
      hash.includes('tgWebAppPlatform')
    ) {
      return true;
    }
  }

  // Telegram User Agent check
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  return /Telegram/i.test(ua);
}

/**
 * Specifically checks if running as a Telegram Mini App / WebApp
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.Telegram?.WebApp?.initData ||
    window.location.search.includes('tgWebAppData') ||
    window.location.hash.includes('tgWebAppData')
  );
}

/**
 * Initializes Telegram WebApp if available
 */
export function initTelegramWebApp(): void {
  if (typeof window === 'undefined') return;

  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      // Guard CloudStorage on older WebApp clients (e.g. version 6.0)
      if (typeof tg.isVersionAtLeast === 'function' && !tg.isVersionAtLeast('6.9')) {
        const memoryFallbackPrefix = 'tg_cloud_fallback_';
        const safeCloudStorage = {
          setItem: (key: string, value: string, callback?: (err: Error | null, success?: boolean) => void) => {
            try {
              localStorage.setItem(memoryFallbackPrefix + key, value);
              callback?.(null, true);
            } catch (e) {
              callback?.(e as Error);
            }
            return safeCloudStorage;
          },
          getItem: (key: string, callback: (err: Error | null, result?: string | null) => void) => {
            try {
              const val = localStorage.getItem(memoryFallbackPrefix + key);
              callback(null, val);
            } catch (e) {
              callback(e as Error);
            }
            return safeCloudStorage;
          },
          getItems: (keys: string[], callback: (err: Error | null, result?: Record<string, string | null>) => void) => {
            try {
              const res: Record<string, string | null> = {};
              keys.forEach((k) => {
                res[k] = localStorage.getItem(memoryFallbackPrefix + k);
              });
              callback(null, res);
            } catch (e) {
              callback(e as Error);
            }
            return safeCloudStorage;
          },
          removeItem: (key: string, callback?: (err: Error | null, success?: boolean) => void) => {
            try {
              localStorage.removeItem(memoryFallbackPrefix + key);
              callback?.(null, true);
            } catch (e) {
              callback?.(e as Error);
            }
            return safeCloudStorage;
          },
          removeItems: (keys: string[], callback?: (err: Error | null, success?: boolean) => void) => {
            try {
              keys.forEach((k) => {
                localStorage.removeItem(memoryFallbackPrefix + k);
              });
              callback?.(null, true);
            } catch (e) {
              callback?.(e as Error);
            }
            return safeCloudStorage;
          },
          getKeys: (callback: (err: Error | null, keys?: string[]) => void) => {
            try {
              const keys: string[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(memoryFallbackPrefix)) {
                  keys.push(k.substring(memoryFallbackPrefix.length));
                }
              }
              callback(null, keys);
            } catch (e) {
              callback(e as Error);
            }
            return safeCloudStorage;
          },
        };

        try {
          Object.defineProperty(tg, 'CloudStorage', {
            value: safeCloudStorage,
            writable: true,
            configurable: true,
            enumerable: true,
          });
        } catch {
          (tg as any).CloudStorage = safeCloudStorage;
        }
      }

      // Signal Telegram that WebApp is ready and can be displayed
      if (typeof tg.ready === 'function') {
        tg.ready();
      }
      // Expand to maximum available screen height
      if (typeof tg.expand === 'function') {
        tg.expand();
      }

      // Configure visual themes to match vintage dark gold look
      try {
        if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor('#0e0c0b');
        if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor('#0e0c0b');
      } catch {
        // Some older Telegram clients don't support color setting
      }
    }
  } catch (err) {
    console.warn('Telegram WebApp init notice:', err);
  }
}

/**
 * Open external URL safely, handling Telegram in-app restrictions
 */
export function openSafeLink(url: string): void {
  if (typeof window === 'undefined') return;

  try {
    const tg = window.Telegram?.WebApp;
    if (tg && typeof tg.openLink === 'function') {
      tg.openLink(url);
      return;
    }
  } catch {
    // Fallback
  }

  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    window.location.href = url;
  }
}

/**
 * Trigger light haptic feedback if running in Telegram
 */
export function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light'): void {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  } catch {
    // Ignore
  }
}
