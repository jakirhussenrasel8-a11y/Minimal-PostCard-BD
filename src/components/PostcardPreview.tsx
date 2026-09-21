import React, { forwardRef, useState } from 'react';
import { PostcardTemplate, GeneratorState, BorderStyleType, FontFamilyType } from '../types';
import { PostcardArtwork } from './PostcardArtwork';
import { PostcardStamp } from './PostcardStamp';
import { ASPECT_RATIOS } from '../data/aspectRatios';
import { shareToWhatsApp, shareToTelegram, shareToFacebook, shareToMessenger, copyPostcardLink, ShareData } from '../lib/shareUtils';
import { MessageCircle, Facebook, Send, Share2, Check } from 'lucide-react';

interface PostcardPreviewProps {
  template: PostcardTemplate;
  state: GeneratorState;
  className?: string;
  isExporting?: boolean;
  showShareButtons?: boolean;
}

export const PostcardPreview = forwardRef<HTMLDivElement, PostcardPreviewProps>(
  ({ template, state, className = '', isExporting = false, showShareButtons = true }, ref) => {
    const currentRatio = ASPECT_RATIOS.find(r => r.id === state.exportSize) || ASPECT_RATIOS[0];
    const [shareFeedback, setShareFeedback] = useState<string | null>(null);

    const getShareData = (): ShareData => ({
      title: 'Minimal PostCard BD',
      quote: state.selectedQuoteText,
      recipient: state.recipient,
      sender: state.sender,
      templateTitle: template.titleBn || template.title,
    });

    const handleShareWhatsApp = (e: React.MouseEvent) => {
      e.stopPropagation();
      shareToWhatsApp(getShareData());
      showToast('WhatsApp ওপেন হচ্ছে...');
    };

    const handleShareFacebook = (e: React.MouseEvent) => {
      e.stopPropagation();
      shareToFacebook(getShareData());
      showToast('Facebook ওপেন হচ্ছে...');
    };

    const handleShareTelegram = (e: React.MouseEvent) => {
      e.stopPropagation();
      shareToTelegram(getShareData());
      showToast('Telegram ওপেন হচ্ছে...');
    };

    const handleShareMessenger = (e: React.MouseEvent) => {
      e.stopPropagation();
      const success = shareToMessenger(getShareData());
      if (success) {
        showToast('Messenger ওপেন হচ্ছে...');
      } else {
        copyPostcardLink(getShareData());
        showToast('লিংক কপি হয়েছে! মেসেঞ্জারে পেস্ট করুন');
      }
    };

    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();
      const ok = await copyPostcardLink(getShareData());
      if (ok) {
        showToast('পোস্টকার্ড কপি হয়েছে!');
      }
    };

    const showToast = (msg: string) => {
      setShareFeedback(msg);
      setTimeout(() => {
        setShareFeedback(null);
      }, 3000);
    };

    // Resolve font inline style to guarantee html-to-image and html2canvas preserve the font on download
    const getFontFamilyStyle = (font: FontFamilyType): string => {
      switch (font) {
        case 'Handwritten':
          return "'Galada', cursive, 'Noto Serif Bengali', serif";
        case 'Calligraphy':
        case 'ArtisticCursive':
          return "'Great Vibes', 'Galada', cursive, 'Noto Serif Bengali', serif";
        case 'VintageSerif':
          return "'Playfair Display', 'Cinzel', 'Noto Serif Bengali', serif";
        case 'Typewriter':
          return "'Special Elite', 'Courier Prime', monospace";
        case 'OldNewspaper':
        case 'RetroSign':
          return "'Cinzel', 'Playfair Display', 'Noto Serif Bengali', serif";
        case 'RoyalBengali':
        case 'PoeticBengali':
          return "'Tiro Bangla', 'Noto Serif Bengali', serif";
        case 'ModernMinimal':
          return "'Mina', 'Hind Siliguri', 'Anek Bangla', sans-serif";
        case 'Classic':
          return "'Hind Siliguri', 'Anek Bangla', sans-serif";
        case 'BengaliElegant':
        default:
          return "'Noto Serif Bengali', 'Cormorant Garamond', serif";
      }
    };

    // Resolve font class
    const getFontClass = (font: FontFamilyType): string => {
      switch (font) {
        case 'Handwritten':
          return 'font-bengali-handwritten';
        case 'Calligraphy':
        case 'ArtisticCursive':
          return 'font-artistic-cursive';
        case 'VintageSerif':
          return 'font-vintage-serif';
        case 'Typewriter':
          return 'font-typewriter';
        case 'OldNewspaper':
        case 'RetroSign':
          return 'font-vintage-serif';
        case 'RoyalBengali':
        case 'PoeticBengali':
          return 'font-bengali-tiro';
        case 'ModernMinimal':
          return 'font-bengali-mina';
        case 'Classic':
          return 'font-bengali-sans';
        case 'BengaliElegant':
        default:
          return 'font-bengali-serif';
      }
    };

    // Border styling
    const renderBorders = (borderType: BorderStyleType) => {
      switch (borderType) {
        case 'ornate':
          return (
            <div className="absolute inset-2.5 sm:inset-3.5 border border-[#d4af37]/60 pointer-events-none z-20">
              <div className="absolute inset-1 border border-[#d4af37]/30" />
              {/* Ornate corner squares */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#d4af37] rotate-45" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d4af37] rotate-45" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#d4af37] rotate-45" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#d4af37] rotate-45" />
            </div>
          );
        case 'double':
          return (
            <div className="absolute inset-2.5 sm:inset-4 border-2 border-[#d4af37]/70 pointer-events-none z-20">
              <div className="absolute inset-1.5 border border-[#d4af37]/40" />
            </div>
          );
        case 'stamp':
          return (
            <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-[#d4af37]/50 pointer-events-none z-20" />
          );
        case 'postcard-split':
          return (
            <div className="absolute inset-2 sm:inset-3 border border-[#d4af37]/40 pointer-events-none z-20">
              {/* Vertical divider in the middle for vintage postcard feel */}
              <div className="absolute top-8 bottom-8 left-1/2 w-[1px] bg-[#d4af37]/25 -translate-x-1/2 hidden sm:block" />
            </div>
          );
        case 'minimal':
          return (
            <div className="absolute inset-2 border border-[#d4af37]/20 pointer-events-none z-20" />
          );
        case 'classic':
        default:
          return (
            <div className="absolute inset-3 sm:inset-4 border border-[#d4af37]/50 pointer-events-none z-20" />
          );
      }
    };

    // Text position classes
    const getPositionClass = () => {
      switch (state.textPosition) {
        case 'top':
          return 'justify-start pt-10 sm:pt-14';
        case 'bottom':
          return 'justify-end pb-10 sm:pb-14';
        case 'split':
          return 'justify-between py-8 sm:py-12';
        case 'center':
        default:
          return 'justify-center py-6 sm:py-10';
      }
    };

    // Text alignment classes
    const getAlignClass = () => {
      switch (state.textAlign) {
        case 'left':
          return 'text-left items-start';
        case 'right':
          return 'text-right items-end';
        case 'center':
        default:
          return 'text-center items-center';
      }
    };

    return (
      <div
        ref={ref}
        id="minimal-postcard-export-node"
        className={`relative overflow-hidden select-none bg-[#171412] text-[#f7ecd5] shadow-2xl transition-all duration-300 ${className}`}
        style={{
          aspectRatio: currentRatio.ratio,
          width: '100%',
          maxWidth: state.exportSize === 'story' || state.exportSize === 'status' ? '400px' : '720px',
        }}
      >
        {/* Background Artwork */}
        <div className="absolute inset-0 z-0">
          <PostcardArtwork type={template.image} effect={state.effect} className="w-full h-full" />
        </div>

        {/* Vintage Paper Gradient Veil for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120f0d]/90 via-[#181411]/75 to-[#120f0d]/80 z-10 pointer-events-none" />

        {/* Borders */}
        {renderBorders(state.borderStyle)}

        {/* Vintage Stamp / Postmark in top right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 scale-75 sm:scale-90 origin-top-right">
          <PostcardStamp type={template.stampType} />
        </div>

        {/* Vintage Postcard Watermark Header (very subtle) */}
        <div className="absolute top-4 left-5 sm:top-6 sm:left-7 z-20 flex items-center gap-2 opacity-50">
          <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-serif text-[#d4af37]">
            POST CARD / ডাকটিকিট
          </span>
        </div>

        {/* Main Content Area */}
        <div className={`relative z-20 w-full h-full px-7 sm:px-12 flex flex-col ${getPositionClass()} ${getAlignClass()}`}>
          {/* Recipient / প্রাপক */}
          {state.recipient && (
            <div className="mb-2 sm:mb-3 opacity-90 transition-all">
              <span
                className="text-xs sm:text-sm font-bengali-serif tracking-wide border-b border-[#d4af37]/30 pb-0.5"
                style={{
                  color: state.textColor,
                  fontFamily: getFontFamilyStyle(state.fontFamily),
                }}
              >
                {state.recipient.startsWith('প্রিয়') ? state.recipient : `প্রিয় ${state.recipient}`}
              </span>
            </div>
          )}

          {/* Main Quote / মূল লেখা */}
          <div
            className={`max-w-xl my-2 leading-relaxed transition-all ${getFontClass(state.fontFamily)}`}
            style={{
              fontFamily: getFontFamilyStyle(state.fontFamily),
              fontSize: `${Math.max(16, Math.min(state.fontSize, 42))}px`,
              color: state.textColor,
              fontWeight: state.fontWeight,
              fontStyle: state.fontStyle,
              textAlign: state.textAlign,
              letterSpacing: `${state.letterSpacing}em`,
              lineHeight: state.lineHeight,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
            }}
          >
            {state.selectedQuoteText ? (
              <span>“{state.selectedQuoteText.replace(/^“|”$/g, '')}”</span>
            ) : (
              <span className="italic opacity-60">এখানে আপনার প্রেমের কথামালা ফুটে উঠবে...</span>
            )}
          </div>

          {/* Sender & Date / প্রেরক ও তারিখ */}
          {(state.sender || state.date) && (
            <div className={`mt-3 sm:mt-4 flex flex-col gap-1 transition-all ${state.textAlign === 'left' ? 'items-start' : state.textAlign === 'right' ? 'items-end' : 'items-center'}`}>
              {state.sender && (
                <span
                  className="text-xs sm:text-sm font-bengali-handwritten italic tracking-wide"
                  style={{
                    color: state.textColor,
                    fontFamily: getFontFamilyStyle('Handwritten'),
                  }}
                >
                  {state.sender}
                </span>
              )}
              {state.date && (
                <span className="text-[10px] sm:text-xs font-mono text-[#d4af37]/75">
                  {state.date}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Vintage Bottom Brand Signature */}
        <div className="absolute bottom-3 left-0 right-0 text-center z-20 pointer-events-none opacity-40">
          <span className="text-[8px] font-mono tracking-widest uppercase text-[#d4af37]">
            MINIMAL POSTCARD BD • VINTAGE ARCHIVE
          </span>
        </div>

        {/* Social Media Share Actions (Excluded from Export) */}
        {!isExporting && showShareButtons && (
          <div
            className="no-export absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-40 flex items-center gap-1 sm:gap-1.5 bg-[#171310]/90 backdrop-blur-md px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border border-[#d4af37]/40 shadow-xl transition-all hover:border-[#d4af37]"
            data-no-export="true"
            data-html2canvas-ignore="true"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] font-serif text-[#d4af37] hidden xs:inline-block pr-1 border-r border-[#d4af37]/30">
              শেয়ার:
            </span>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-1 sm:p-1.5 rounded-full hover:bg-[#25D366]/20 text-[#25D366] transition transform active:scale-90"
              title="WhatsApp-এ শেয়ার করুন"
              aria-label="WhatsApp-এ শেয়ার করুন"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Telegram */}
            <button
              type="button"
              onClick={handleShareTelegram}
              className="p-1 sm:p-1.5 rounded-full hover:bg-[#0088cc]/20 text-[#29b6f6] transition transform active:scale-90"
              title="Telegram-এ শেয়ার করুন"
              aria-label="Telegram-এ শেয়ার করুন"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-[-20deg]" />
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleShareFacebook}
              className="p-1 sm:p-1.5 rounded-full hover:bg-[#1877F2]/20 text-[#1877F2] transition transform active:scale-90"
              title="Facebook-এ শেয়ার করুন"
              aria-label="Facebook-এ শেয়ার করুন"
            >
              <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Messenger */}
            <button
              type="button"
              onClick={handleShareMessenger}
              className="p-1 sm:p-1.5 rounded-full hover:bg-[#00B2FF]/20 text-[#00B2FF] transition transform active:scale-90"
              title="Messenger-এ শেয়ার করুন"
              aria-label="Messenger-এ শেয়ার করুন"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Copy / Native Share */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 sm:p-1.5 rounded-full hover:bg-[#d4af37]/20 text-[#e6d8c3] hover:text-[#ffd875] transition transform active:scale-90"
              title="লিংক ও লেখা কপি করুন"
              aria-label="লিংক ও লেখা কপি করুন"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Toast notification pill inside preview */}
            {shareFeedback && (
              <div className="absolute -top-8 right-0 bg-[#251d18] text-[#ffd875] border border-[#d4af37]/50 text-[10px] font-serif px-2.5 py-1 rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                {shareFeedback}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PostcardPreview.displayName = 'PostcardPreview';
