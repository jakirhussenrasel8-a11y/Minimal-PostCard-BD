import React, { useState } from 'react';
import { Download, Share2, ExternalLink, Check, Copy, Sparkles, X, MessageCircle, Info, Bot, Send } from 'lucide-react';
import { isTelegram, openSafeLink, triggerHaptic, sendPostcardToTelegramBot } from '../lib/telegram';
import { SITE_CONFIG } from '../config/site';

interface ImageDownloadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  filename: string;
  format: 'png' | 'jpg';
  onShareTelegram?: () => void;
  onSendToBot?: () => void;
  botDetails?: {
    templateId: string;
    recipient?: string;
    sender?: string;
    quote?: string;
    fontFamily?: string;
    date?: string;
  };
}

export const ImageDownloadSuccessModal: React.FC<ImageDownloadSuccessModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  filename,
  format,
  onShareTelegram,
  onSendToBot,
  botDetails,
}) => {
  const [sharingDirect, setSharingDirect] = useState(false);
  const [botSent, setBotSent] = useState(false);
  const inTg = isTelegram();

  if (!isOpen || !imageUrl) return null;

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  // Attempt Web Share API with actual image file
  const handleShareFile = async () => {
    if (typeof navigator === 'undefined') return;
    try {
      setSharingDirect(true);
      triggerHaptic('light');

      // Convert dataUrl to blob
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: format === 'jpg' ? 'image/jpeg' : 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Minimal PostCard BD',
          text: 'আমার তৈরি করা ভিন্টেজ পোস্টকার্ড 💌',
        });
        triggerHaptic('heavy');
      } else {
        // Fallback: open image in new window / tab
        window.open(imageUrl, '_blank');
      }
    } catch (err) {
      console.warn('Share file notice:', err);
    } finally {
      setSharingDirect(false);
    }
  };

  const handleDownloadDirect = () => {
    triggerHaptic('light');
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendToBot = () => {
    triggerHaptic('medium');
    setBotSent(true);

    if (onSendToBot) {
      onSendToBot();
      return;
    }

    if (botDetails) {
      sendPostcardToTelegramBot({
        botUsername: SITE_CONFIG.telegramBotUsername,
        templateId: botDetails.templateId,
        recipient: botDetails.recipient,
        sender: botDetails.sender,
        quote: botDetails.quote,
        fontFamily: botDetails.fontFamily,
        date: botDetails.date,
      });
    } else {
      const botUrl = `https://t.me/${SITE_CONFIG.telegramBotUsername}?start=postcard_${Date.now()}`;
      openSafeLink(botUrl);
    }
  };

  const handleOpenInBrowser = () => {
    triggerHaptic('medium');
    const currentUrl = window.location.href;
    // Attempt Telegram external link or new window
    openSafeLink(currentUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#181310] border border-[#d4af37]/40 rounded-2xl shadow-2xl p-5 sm:p-7 text-[#f7eed9] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#2a1d17] hover:bg-[#38261e] text-[#c5b59d] hover:text-white transition cursor-pointer border border-[#d4af37]/30"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a1e16] border border-[#d4af37]/40 text-[#ffd875] text-xs font-serif mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd875]" />
            <span>পোস্টকার্ড প্রস্তুত!</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#f7eed9]">
            {inTg ? 'টেলিগ্রাম সেভ ও ডাউনলোড গাইড' : 'HD পোস্টকার্ড প্রস্তুত'}
          </h3>
          <p className="text-xs sm:text-sm text-[#baa990] font-bengali-sans mt-1">
            {inTg
              ? 'টেলিগ্রাম ইন-অ্যাপ ব্রাউজারে নিচের ছবিটিতে চেপে ধরে "Save to Gallery" অথবা শেয়ার অপশন ব্যবহার করুন।'
              : 'আপনার পোস্টকার্ড সফলভাবে তৈরি হয়েছে। নিচের যেকোনো অপশনে সংরক্ষণ করুন।'}
          </p>
        </div>

        {/* Image Preview Box with Tap & Hold Notice */}
        <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1">
          <div className="relative group bg-[#0e0c0b] p-2 rounded-xl border border-[#d4af37]/30 flex flex-col items-center">
            <img
              src={imageUrl}
              alt="Generated Postcard"
              className="max-h-64 sm:max-h-72 w-auto object-contain rounded-lg shadow-lg"
            />
            {inTg && (
              <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#271b14] border border-[#d4af37]/35 text-center text-xs text-[#ffd875] font-serif flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-[#d4af37]" />
                <span>ছবির ওপর লং-প্রেস (চেপে ধরে) সরাসরি গ্যালারিতে Save করুন</span>
              </div>
            )}
          </div>

          {/* Action Options */}
          <div className="space-y-2.5">
            {/* Telegram Bot Delivery Option (Directly send to bot so user can download from Telegram chat) */}
            {inTg && (
              <button
                type="button"
                onClick={handleSendToBot}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#173852] via-[#205277] to-[#173852] hover:from-[#1b4363] hover:to-[#1b4363] text-[#ebf7ff] text-xs sm:text-sm font-serif font-bold border border-[#2ea6ff]/60 shadow-lg cursor-pointer active:scale-98 transition"
              >
                <Bot className="w-4 h-4 text-[#54beff]" />
                <span>{botSent ? '✓ বটে পাঠানো হয়েছে — বটের চ্যাট খুলুন' : '🤖 টেলিগ্রাম বটে পাঠান ও ডাউনলোড করুন'}</span>
              </button>
            )}

            {/* Direct Save / Native Share */}
            {hasNativeShare && (
              <button
                type="button"
                onClick={handleShareFile}
                disabled={sharingDirect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#7b2c28] via-[#94352f] to-[#7b2c28] hover:from-[#9c3730] hover:to-[#9c3730] text-[#fff8ee] text-xs sm:text-sm font-serif font-bold border border-[#d4af37]/50 shadow-lg cursor-pointer active:scale-98 transition"
              >
                <Share2 className="w-4 h-4 text-[#ffd875]" />
                <span>গ্যালারিতে পাঠান বা শেয়ার করুন (Share Image)</span>
              </button>
            )}

            {/* Standard Download Button */}
            <button
              type="button"
              onClick={handleDownloadDirect}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#261c16] hover:bg-[#35261e] border border-[#d4af37]/40 text-[#ffd875] text-xs sm:text-sm font-serif font-bold cursor-pointer active:scale-98 transition"
            >
              <Download className="w-4 h-4" />
              <span>ফাইল হিসেবে ডাউনলোড করুন (.{(format || 'png').toUpperCase()})</span>
            </button>

            {/* Telegram specific: Share directly to chats */}
            {onShareTelegram && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onShareTelegram();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#142333] hover:bg-[#1a2f44] border border-[#0088cc]/40 text-[#54b8ff] text-xs sm:text-sm font-serif font-medium cursor-pointer active:scale-98 transition"
              >
                <MessageCircle className="w-4 h-4 text-[#0088cc]" />
                <span>টেলিগ্রাম চ্যাটে পোস্টকার্ড লিংক পাঠান</span>
              </button>
            )}

            {/* In Telegram: Option to open in external Chrome/Safari for direct file downloads */}
            {inTg && (
              <button
                type="button"
                onClick={handleOpenInBrowser}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1f1a16] hover:bg-[#2d241e] border border-[#d4af37]/25 text-[#baa990] hover:text-[#f7eed9] text-xs font-serif cursor-pointer active:scale-98 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>ক্রোম বা সাফারি ব্রাউজারে খুলুন (Open in Browser)</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-[11px] text-[#8e7e69] font-mono">
          <span>{filename}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#d4af37] hover:underline font-serif cursor-pointer"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
