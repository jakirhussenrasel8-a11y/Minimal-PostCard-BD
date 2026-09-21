import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { isTelegram, openSafeLink } from '../lib/telegram';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleOpenInBrowser = () => {
    openSafeLink(window.location.href);
  };

  public render() {
    if (this.state.hasError) {
      const inTelegram = isTelegram();

      return (
        <div className="min-h-screen bg-[#0e0c0b] text-[#f5ebd7] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#181412] border border-[#d4af37]/30 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#7b2c28]/20 border border-[#7b2c28]/50 flex items-center justify-center text-[#ffd875]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-serif font-bold text-[#ffd875]">
              সাময়িক বিঘ্ন ঘটেছে
            </h1>

            <p className="text-sm text-[#d8c8b4] leading-relaxed">
              অ্যাপ্লিকেশনটি লোড হতে সমস্যা হয়েছে।
              {inTelegram ? ' টেলিগ্রাম ইন-অ্যাপ ব্রাউজারের সীমাবদ্ধতার কারণে এটি ঘটতে পারে।' : ''}
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7b2c28] to-[#9c3730] text-[#fff8ee] font-serif font-semibold text-sm border border-[#d4af37]/40 shadow hover:brightness-110 active:scale-98 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পুনরায় লোড করুন (Reload)</span>
              </button>

              {inTelegram && (
                <button
                  type="button"
                  onClick={this.handleOpenInBrowser}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#261d19] text-[#ffd875] font-serif text-sm border border-[#d4af37]/30 hover:bg-[#322621] active:scale-98 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>বাহিরের ব্রাউজারে ওপেন করুন (Open in Chrome/Safari)</span>
                </button>
              )}
            </div>

            <p className="text-xs text-[#8c7e73] pt-2">
              Minimal PostCard BD • Vintage Bengali Postcard
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
