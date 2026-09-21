import React, { useState, useEffect, useRef } from 'react';
import { SITE_CONFIG } from '../config/site';
import { X, ExternalLink, Download, CheckCircle2, Lock, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadConfirmed: () => void;
  isDownloading?: boolean;
}

export const DownloadGateModal: React.FC<DownloadGateModalProps> = ({
  isOpen,
  onClose,
  onDownloadConfirmed,
  isDownloading = false,
}) => {
  const [sponsorOpened, setSponsorOpened] = useState(false);
  const [countdown, setCountdown] = useState(SITE_CONFIG.downloadCountdown);
  const [isReady, setIsReady] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSponsorOpened(false);
      setCountdown(SITE_CONFIG.downloadCountdown);
      setIsReady(false);
      setPopupBlocked(false);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onClose();
  };

  const handleOpenSponsor = () => {
    setPopupBlocked(false);

    try {
      const newTab = window.open(SITE_CONFIG.sponsorUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Popup might have been blocked
        setPopupBlocked(true);
      }
    } catch {
      setPopupBlocked(true);
    }

    setSponsorOpened(true);
    setCountdown(SITE_CONFIG.downloadCountdown);
    setIsReady(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let remaining = SITE_CONFIG.downloadCountdown;
    timerRef.current = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);

      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsReady(true);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#7b2c28', '#f5ebd7'],
          });
        } catch {
          // Ignore
        }
      }
    }, 1000);
  };

  const handleTriggerDownload = () => {
    if (isReady && !isDownloading) {
      onDownloadConfirmed();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-gate-title"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#161311] border border-[#d4af37]/40 rounded-xl p-6 sm:p-8 shadow-2xl text-[#f5ebd7] gold-glow">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#d4af37]/70 hover:text-[#d4af37] hover:bg-[#251f1a] transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Top Icon & Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2a1f18] border border-[#d4af37]/30 mb-3 text-[#d4af37]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 id="download-gate-title" className="text-xl sm:text-2xl font-serif font-bold text-[#f8eed1] tracking-wide">
            💌 আপনার পোস্টকার্ড প্রস্তুত
          </h2>
          <p className="text-xs sm:text-sm text-[#cbbba0] mt-1.5 font-bengali-sans">
            ডাউনলোড চালু করার আগে Sponsor Page দেখুন।
          </p>
        </div>

        {/* Popup blocker warning notice */}
        {popupBlocked && (
          <div className="mb-4 p-3 rounded-lg bg-[#3a1b1a] border border-[#7b2c28] text-xs text-[#ffcfcb] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff8d85]" />
            <div>
              <p className="font-semibold">পপআপ ব্লক হয়েছে</p>
              <p className="text-[11px] mt-0.5">
                আপনার ব্রাউজার Sponsor Page খুলতে বাধা দিয়েছে। নতুন ট্যাব খোলার অনুমতি দিন এবং আবার চেষ্টা করুন।
              </p>
              <a
                href={SITE_CONFIG.sponsorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block underline font-medium text-[#ffd099] mt-1 hover:text-white"
              >
                এখানে ক্লিক করে সরাসরি খুলুন &rarr;
              </a>
            </div>
          </div>
        )}

        {/* Action Steps Box */}
        <div className="bg-[#1e1915] border border-[#d4af37]/20 rounded-lg p-5 mb-6 text-center">
          {!sponsorOpened ? (
            <div className="space-y-4">
              <div className="text-sm text-[#e8dac1]">
                পোস্টকার্ডটি বিনামূল্যে হাই-রেজোলিউশন (HD) ডাউনলোড করতে নিচের বাটনে ক্লিক করে স্পনসর পেজটি খুলুন:
              </div>
              <button
                type="button"
                onClick={handleOpenSponsor}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#7b2c28] via-[#8c3530] to-[#7b2c28] hover:from-[#923530] hover:to-[#923530] text-[#fff8ee] font-serif font-semibold text-sm sm:text-base border border-[#d4af37]/50 shadow-lg hover:shadow-red-950/50 transition-all cursor-pointer active:scale-98"
              >
                <span>👁️ Sponsor দেখুন</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>
            </div>
          ) : !isReady ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                {/* Countdown Dial */}
                <div className="relative w-20 h-20 rounded-full border-2 border-[#d4af37]/40 flex items-center justify-center bg-[#130f0d] mb-3">
                  <span className="text-3xl font-mono font-bold text-[#d4af37]">
                    0{countdown}
                  </span>
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#d4af37]/30 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <p className="text-sm font-serif text-[#f2e6cb]">Download প্রস্তুত হচ্ছে...</p>
                <p className="text-xs text-[#a9977e] mt-1">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন</p>
              </div>

              {/* Disabled locked button */}
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#27211c] text-[#7d705f] border border-[#3f352c] text-sm font-serif cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>🔒 Download Locked ({countdown}s)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#1b3323] border border-[#38a169] text-[#48bb78] flex items-center justify-center mb-2 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-base font-serif font-bold text-[#e6f4ea]">✅ Download Ready</p>
                <p className="text-xs text-[#a9c9b5] mt-0.5">আপনার HD ভিন্টেজ পোস্টকার্ডটি প্রস্তুত!</p>
              </div>

              {/* Ready Download Button */}
              <button
                type="button"
                onClick={handleTriggerDownload}
                disabled={isDownloading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#216e39] to-[#2e854b] hover:from-[#2a8345] hover:to-[#389e5a] text-[#ffffff] font-serif font-bold text-base border border-[#52c41a]/60 shadow-xl transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>{isDownloading ? 'তৈরি হচ্ছে...' : '⬇️ DOWNLOAD NOW'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Vintage Footer Note */}
        <div className="text-center text-[11px] text-[#8e7e69] font-bengali-sans flex items-center justify-center gap-1.5">
          <span>💌 Minimal PostCard BD</span>
          <span>•</span>
          <span>উচ্চ রেজোলিউশন (HD) রেন্ডার</span>
        </div>
      </div>
    </div>
  );
};
