import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  PostcardTemplate,
  GeneratorState,
  FontFamilyType,
  VintageEffect,
  TextPositionType,
  TextAlignmentType,
  BorderStyleType,
  RomanticQuote,
} from '../types';
import { POSTCARD_TEMPLATES } from '../data/postcards';
import { ROMANTIC_QUOTES } from '../data/quotes';
import { ASPECT_RATIOS } from '../data/aspectRatios';
import { PostcardPreview } from './PostcardPreview';
import { PostcardArtwork } from './PostcardArtwork';
import { DownloadGateModal } from './DownloadGateModal';
import { exportPostcardNode } from '../lib/exportPostcard';
import {
  shareToWhatsApp,
  shareToTelegram,
  shareToFacebook,
  shareToMessenger,
  copyPostcardLink,
} from '../lib/shareUtils';
import {
  getSmartShuffleSuggestion,
  getTopRelevantQuotes,
  SmartShuffleContext,
  SmartShuffleResult,
} from '../lib/smartShuffle';
import { useUserActivityHistory, UserActivityHistory } from '../hooks/useUserActivityHistory';
import {
  Sparkles,
  Dices,
  RotateCcw,
  Download,
  Check,
  Search,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
  Type,
  Palette,
  Maximize2,
  FileImage,
  Share2,
  MessageCircle,
  Facebook,
  Send,
  Copy,
  Compass,
  Shuffle,
  Wand2,
  Zap,
} from 'lucide-react';
import { triggerRewardedInterstitial } from '../lib/adService';

interface PostcardGeneratorProps {
  initialPostcard?: PostcardTemplate;
  initialQuote?: RomanticQuote;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  activeSearchQuery?: string;
  activeCategoryFilter?: string;
  userHistory?: UserActivityHistory;
  favoriteQuoteIds?: string[];
  favoritePostcardIds?: string[];
}

export const PostcardGenerator: React.FC<PostcardGeneratorProps> = ({
  initialPostcard,
  initialQuote,
  isFavorite,
  onToggleFavorite,
  activeSearchQuery = '',
  activeCategoryFilter = 'all',
  userHistory,
  favoriteQuoteIds = [],
  favoritePostcardIds = [],
}) => {
  const defaultTemplate = initialPostcard || POSTCARD_TEMPLATES[0];

  const [state, setState] = useState<GeneratorState>({
    selectedPostcard: defaultTemplate,
    selectedQuoteText: initialQuote ? initialQuote.text : defaultTemplate.defaultQuote,
    recipient: defaultTemplate.defaultRecipient || 'প্রিয়তমা',
    sender: defaultTemplate.defaultSender || 'ইতি, তোমার...',
    date: defaultTemplate.defaultDate || 'বসন্তদিন',
    fontFamily: defaultTemplate.style.fontFamily,
    fontSize: defaultTemplate.style.fontSize,
    fontWeight: defaultTemplate.style.fontWeight || 'normal',
    fontStyle: defaultTemplate.style.fontStyle || 'normal',
    textAlign: defaultTemplate.style.alignment,
    letterSpacing: defaultTemplate.style.letterSpacing || 0.02,
    lineHeight: defaultTemplate.style.lineHeight || 1.6,
    textColor: defaultTemplate.style.textColor || '#f7edd9',
    textPosition: defaultTemplate.style.position,
    effect: 'original',
    borderStyle: defaultTemplate.style.border || 'ornate',
    exportFormat: 'png',
    exportSize: 'postcard',
  });

  // Activity history fallback/recorder
  const { history: localHistory, recordQuoteView, recordPostcardView } = useUserActivityHistory();
  const effectiveHistory = userHistory || localHistory;

  // Smart Shuffle state & feedback
  const [smartShuffleFeedback, setSmartShuffleFeedback] = useState<SmartShuffleResult | null>(null);
  const [isSmartShuffling, setIsSmartShuffling] = useState<boolean>(false);

  // Sync if initial props change (e.g. when navigating from Library or Quotes tabs)
  useEffect(() => {
    if (initialPostcard) {
      setState(prev => ({
        ...prev,
        selectedPostcard: initialPostcard,
        borderStyle: initialPostcard.style.border,
        fontFamily: initialPostcard.style.fontFamily,
        textColor: initialPostcard.style.textColor,
        selectedQuoteText: initialQuote ? initialQuote.text : (prev.selectedQuoteText || initialPostcard.defaultQuote),
      }));
      if (initialQuote) {
        setCustomTextDraft(initialQuote.text);
      }
    }
  }, [initialPostcard, initialQuote]);

  // Local editor input states
  const [customTextDraft, setCustomTextDraft] = useState(state.selectedQuoteText);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState('all');
  const [quoteCategoryFilter, setQuoteCategoryFilter] = useState('all');
  const [isDownloadGateOpen, setIsDownloadGateOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [shareStatusMessage, setShareStatusMessage] = useState<string | null>(null);

  // Ref to the actual live postcard DOM node
  const previewRef = useRef<HTMLDivElement>(null);

  // Smart Shuffle Context based on current postcard, active search query, and user activity history
  const smartContext: SmartShuffleContext = useMemo(() => ({
    currentPostcard: state.selectedPostcard,
    currentQuoteText: state.selectedQuoteText,
    currentSearchQuery: activeSearchQuery,
    searchHistory: effectiveHistory.searches || [],
    navigationHistory: [
      ...(activeCategoryFilter && activeCategoryFilter !== 'all' ? [activeCategoryFilter] : []),
      ...(effectiveHistory.categories || []),
    ],
    favoriteQuoteIds,
    favoritePostcardIds,
  }), [
    state.selectedPostcard,
    state.selectedQuoteText,
    activeSearchQuery,
    activeCategoryFilter,
    effectiveHistory,
    favoriteQuoteIds,
    favoritePostcardIds,
  ]);

  // Top smart recommended quotes for the current context
  const topSmartQuotes = useMemo(() => {
    return getTopRelevantQuotes(smartContext, 8);
  }, [smartContext]);

  // Template categories
  const templateCategories = ['all', 'বৃষ্টি', 'প্রেমপত্র', 'রোমান্টিক', 'রাতের অনুভূতি', 'বিরহ', 'Bengali Vintage', 'Classic Vintage', 'প্রপোজ', 'স্মৃতি'];

  // Filtered templates
  const filteredTemplates = POSTCARD_TEMPLATES.filter(tpl => {
    const matchesCategory = templateCategoryFilter === 'all' || tpl.category === templateCategoryFilter;
    const matchesSearch =
      tpl.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.titleBn.includes(templateSearch) ||
      tpl.category.includes(templateSearch) ||
      tpl.tags.some(t => t.toLowerCase().includes(templateSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered quotes (with 'smart' recommendation support)
  const filteredQuotes = useMemo(() => {
    if (quoteCategoryFilter === 'smart') {
      return topSmartQuotes.map(item => item.quote);
    }
    if (quoteCategoryFilter === 'all') return ROMANTIC_QUOTES;
    return ROMANTIC_QUOTES.filter(q => q.category === quoteCategoryFilter);
  }, [quoteCategoryFilter, topSmartQuotes]);

  // Color palette presets (Warm Vintage & Antique tones)
  const colorPresets = [
    { label: 'Warm Cream', value: '#f7edd9' },
    { label: 'Antique Gold', value: '#ffd875' },
    { label: 'Parchment White', value: '#ffffff' },
    { label: 'Soft Ivory', value: '#fff4e0' },
    { label: 'Sepia Rose', value: '#faeee2' },
    { label: 'Amber Tint', value: '#fde5b4' },
    { label: 'Crimson Wine', value: '#fca5a5' },
  ];

  // Font options
  const fontOptions: { label: string; value: FontFamilyType }[] = [
    { label: 'Elegant Bengali (সেরিফ)', value: 'BengaliElegant' },
    { label: 'Handwritten (হাতের লেখা)', value: 'Handwritten' },
    { label: 'Typewriter (টাইপরাইটার)', value: 'Typewriter' },
    { label: 'Vintage Serif (ভিন্টেজ)', value: 'VintageSerif' },
    { label: 'Classic (ক্লাসিক)', value: 'Classic' },
    { label: 'Calligraphy (ক্যালিগ্রাফি)', value: 'Calligraphy' },
    { label: 'Old Newspaper (সংবাদপত্র)', value: 'OldNewspaper' },
  ];

  // Vintage effect options
  const effectOptions: { id: VintageEffect; nameBn: string; desc: string }[] = [
    { id: 'original', nameBn: 'আসল (Original)', desc: 'খাঁটি রূপ' },
    { id: 'sepia', nameBn: 'সিপিয়া (Sepia)', desc: 'উষ্ণ বাদামি আভা' },
    { id: 'old-paper', nameBn: 'পুরনো কাগজ (Old Paper)', desc: 'হলুদ খামের অনুভূতি' },
    { id: 'faded', nameBn: 'ফেডেড (Faded)', desc: 'স্মৃতির ধূসরতা' },
    { id: 'bw', nameBn: 'ব্ল্যাক & হোয়াইট', desc: 'চিরন্তন ক্লাসিক' },
    { id: 'film-grain', nameBn: 'ফিল্ম গ্রেইন', desc: 'নস্টালজিক দানাদার' },
    { id: 'dust', nameBn: 'ধুলোবালি (Dust)', desc: 'পুরনো অ্যালবামের মতো' },
    { id: 'scratch', nameBn: 'স্ক্র্যাচ (Scratch)', desc: 'ঐতিহাসিক দাগ' },
    { id: 'coffee-stain', nameBn: 'কফির দাগ (Stain)', desc: 'রোমান্টিক কফির ছাপ' },
    { id: 'warm-vintage', nameBn: 'উষ্ণ ভিন্টেজ (Warm)', desc: 'সান্ধ্য রোদের আভা' },
  ];

  // Handle template switch
  const handleSelectTemplate = (tpl: PostcardTemplate) => {
    setState(prev => ({
      ...prev,
      selectedPostcard: tpl,
      borderStyle: tpl.style.border,
      fontFamily: tpl.style.fontFamily,
      textColor: tpl.style.textColor,
    }));
    recordPostcardView(tpl.id, tpl.category);
  };

  // Handle quote switch
  const handleSelectQuote = (quoteText: string) => {
    setState(prev => ({ ...prev, selectedQuoteText: quoteText }));
    setCustomTextDraft(quoteText);
    const foundQuote = ROMANTIC_QUOTES.find(q => q.text === quoteText);
    if (foundQuote) {
      recordQuoteView(foundQuote.id, foundQuote.categoryBn);
    }
  };

  // Smart Shuffle Handler: Picks quotes contextually matching the selected postcard and search/navigation history
  const handleSmartShuffle = () => {
    setIsSmartShuffling(true);
    const suggestion = getSmartShuffleSuggestion(smartContext);

    setState(prev => ({
      ...prev,
      selectedQuoteText: suggestion.quote.text,
    }));
    setCustomTextDraft(suggestion.quote.text);
    setSmartShuffleFeedback(suggestion);
    recordQuoteView(suggestion.quote.id, suggestion.quote.categoryBn);

    setTimeout(() => {
      setIsSmartShuffling(false);
    }, 350);
  };

  // Surprise Me Handler (Randomizes everything)
  const handleSurpriseMe = () => {
    const randomTemplate = POSTCARD_TEMPLATES[Math.floor(Math.random() * POSTCARD_TEMPLATES.length)];
    const randomQuote = ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)];
    const fonts: FontFamilyType[] = ['BengaliElegant', 'Handwritten', 'Typewriter', 'VintageSerif'];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const effects: VintageEffect[] = ['original', 'sepia', 'old-paper', 'film-grain', 'warm-vintage'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];

    setState(prev => ({
      ...prev,
      selectedPostcard: randomTemplate,
      selectedQuoteText: randomQuote.text,
      fontFamily: randomFont,
      effect: randomEffect,
      textColor: randomTemplate.style.textColor,
      borderStyle: randomTemplate.style.border,
    }));
    setCustomTextDraft(randomQuote.text);
  };

  // Reset text style
  const handleResetTextStyle = () => {
    setState(prev => ({
      ...prev,
      fontFamily: prev.selectedPostcard.style.fontFamily,
      fontSize: prev.selectedPostcard.style.fontSize,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: prev.selectedPostcard.style.alignment,
      letterSpacing: 0.02,
      lineHeight: 1.6,
      textColor: prev.selectedPostcard.style.textColor || '#f7edd9',
      textPosition: prev.selectedPostcard.style.position,
      effect: 'original',
      borderStyle: prev.selectedPostcard.style.border,
    }));
  };

  // Trigger export after countdown completes
  const handlePerformDownload = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    setIsDownloadGateOpen(false);

    try {
      await exportPostcardNode(previewRef.current, {
        format: state.exportFormat,
        quality: 0.98,
        filename: `MinimalPostCardBD_${state.selectedPostcard.title.replace(/\s+/g, '_')}`,
        pixelRatio: 2.5,
      });
      setExportSuccessMessage('🎉 আপনার HD পোস্টকার্ডটি সফলভাবে ডাউনলোড হয়েছে!');
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Export failure:', err);
      alert('পোস্টকার্ড রেন্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsExporting(false);
    }
  };

  // Instant download rewarded with interstitial ad (skips waiting gate)
  const handleInstantRewardedDownload = async () => {
    if (!previewRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Trigger Rewarded Interstitial
      await triggerRewardedInterstitial();

      // User reward: HD export without waiting
      await exportPostcardNode(previewRef.current, {
        format: state.exportFormat,
        quality: 0.98,
        filename: `MinimalPostCardBD_${state.selectedPostcard.title.replace(/\s+/g, '_')}`,
        pixelRatio: 2.8,
      });
      setExportSuccessMessage('🎉 আপনার Ultra HD পোস্টকার্ডটি সফলভাবে ডাউনলোড হয়েছে!');
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Instant export failure:', err);
      alert('পোস্টকার্ড রেন্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsExporting(false);
    }
  };

  const getShareData = () => ({
    title: 'Minimal PostCard BD',
    quote: state.selectedQuoteText,
    recipient: state.recipient,
    sender: state.sender,
    templateTitle: state.selectedPostcard.titleBn || state.selectedPostcard.title,
  });

  const handleShareWhatsApp = () => {
    shareToWhatsApp(getShareData());
    setShareStatusMessage('WhatsApp ওপেন হচ্ছে...');
    setTimeout(() => setShareStatusMessage(null), 4000);
  };

  const handleShareTelegram = () => {
    shareToTelegram(getShareData());
    setShareStatusMessage('Telegram ওপেন হচ্ছে...');
    setTimeout(() => setShareStatusMessage(null), 4000);
  };

  const handleShareFacebook = () => {
    shareToFacebook(getShareData());
    setShareStatusMessage('Facebook ওপেন হচ্ছে...');
    setTimeout(() => setShareStatusMessage(null), 4000);
  };

  const handleShareMessenger = () => {
    const success = shareToMessenger(getShareData());
    if (success) {
      setShareStatusMessage('Messenger ওপেন হচ্ছে...');
    } else {
      copyPostcardLink(getShareData());
      setShareStatusMessage('পোস্টকার্ড লিংক কপি হয়েছে! মেসেঞ্জারে পেস্ট করুন');
    }
    setTimeout(() => setShareStatusMessage(null), 4000);
  };

  const handleCopyShare = async () => {
    const ok = await copyPostcardLink(getShareData());
    if (ok) {
      setShareStatusMessage('পোস্টকার্ডের লেখা ও লিংক কপি হয়েছে!');
    }
    setTimeout(() => setShareStatusMessage(null), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#261d17] border border-[#d4af37]/30 text-xs font-mono text-[#d4af37] mb-3">
          <span>💌 VINTAGE POSTCARD STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7eed9] tracking-tight">
          Vintage Postcard Generator
        </h1>
        <p className="text-sm sm:text-base text-[#baa990] mt-2 font-bengali-sans max-w-xl mx-auto">
          পছন্দের ভিন্টেজ আর্টওয়ার্ক বেছে নিন, রোমান্টিক উক্তি বা নিজের মনের কথা লিখুন এবং ডাউনলোড করুন HD পোস্টকার্ড।
        </p>

        {/* Smart Actions Floating Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {/* Smart Shuffle Button */}
          <button
            type="button"
            onClick={handleSmartShuffle}
            disabled={isSmartShuffling}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7b2c28] to-[#993b35] hover:from-[#8f332f] hover:to-[#ac423b] text-[#fff8ee] text-xs sm:text-sm font-serif font-bold border border-[#d4af37]/60 shadow-lg transition-all cursor-pointer transform active:scale-95 ${
              isSmartShuffling ? 'opacity-80 scale-95' : 'hover:scale-[1.02]'
            }`}
            title={`পোস্টকার্ড (${state.selectedPostcard.category}) এবং সাম্প্রতিক খোঁজের ওপর ভিত্তি করে উপযুক্ত উক্তি সাজেস্ট করুন`}
          >
            <Sparkles className={`w-4 h-4 text-[#ffd875] ${isSmartShuffling ? 'animate-spin' : 'animate-pulse'}`} />
            <span>✨ Smart Shuffle (স্মার্ট নির্বাচন)</span>
          </button>

          {/* Surprise Me Floating Button */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2b211a] hover:bg-[#382b22] text-[#ffd875] hover:text-white border border-[#d4af37]/45 text-xs sm:text-sm font-serif shadow-md transition-all cursor-pointer active:scale-95"
            title="র‍্যান্ডম পোস্টকার্ড, উক্তি ও ভিন্টেজ স্টাইল"
          >
            <Dices className="w-4 h-4 text-[#baa990]" />
            <span>🎲 Surprise Me (র‍্যান্ডম)</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {exportSuccessMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#1b3323] border border-[#38a169] text-sm text-[#e6f4ea] text-center font-serif shadow-lg animate-fade-in">
          {exportSuccessMessage}
        </div>
      )}

      {/* Main Workspace Layout (Preview on top/left, controls beside) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Large Live Postcard Preview (Sticky on desktop) */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
          <div className="bg-[#14100e] border border-[#d4af37]/30 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                <span className="text-xs font-serif font-bold text-[#f7eed9] uppercase tracking-wider">
                  Live Postcard Preview
                </span>
              </div>
              <span className="text-[11px] text-[#cbbba0] font-mono">
                {ASPECT_RATIOS.find(r => r.id === state.exportSize)?.nameBn}
              </span>
            </div>

            {/* The Actual Exportable Postcard Preview Component */}
            <div className="flex justify-center items-center py-2 overflow-hidden">
              <PostcardPreview
                ref={previewRef}
                template={state.selectedPostcard}
                state={state}
                isExporting={isExporting}
              />
            </div>

            {/* Export Size Selector */}
            <div className="mt-5 pt-4 border-t border-[#d4af37]/20">
              <label className="block text-xs font-serif text-[#cbbba0] mb-2">
                📐 সাইজ / আসপেক্ট রেশিও (Aspect Ratio):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ASPECT_RATIOS.map(ratio => {
                  const isSelected = state.exportSize === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, exportSize: ratio.id }))}
                      className={`p-2 rounded-lg text-center border text-[11px] transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#3d201b] border-[#d4af37] text-white font-semibold'
                          : 'bg-[#1b1512] border-[#d4af37]/25 text-[#baa990] hover:text-white'
                      }`}
                    >
                      <div className="font-mono text-xs">{ratio.ratio}</div>
                      <div className="truncate text-[10px]">{ratio.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format & Download Trigger */}
            <div className="mt-5 pt-4 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* PNG / JPG toggle */}
              <div className="flex items-center gap-2 bg-[#1b1512] p-1 rounded-lg border border-[#d4af37]/25">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, exportFormat: 'png' }))}
                  className={`px-3 py-1 text-xs rounded font-mono transition ${
                    state.exportFormat === 'png' ? 'bg-[#7b2c28] text-white font-bold' : 'text-[#baa990]'
                  }`}
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, exportFormat: 'jpg' }))}
                  className={`px-3 py-1 text-xs rounded font-mono transition ${
                    state.exportFormat === 'jpg' ? 'bg-[#7b2c28] text-white font-bold' : 'text-[#baa990]'
                  }`}
                >
                  JPG
                </button>
              </div>

              {/* Main Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 flex-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsDownloadGateOpen(true)}
                  disabled={isExporting}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#7b2c28] via-[#8f322b] to-[#7b2c28] hover:from-[#9c3730] hover:to-[#9c3730] text-[#fff8ee] text-xs sm:text-sm font-serif font-bold border border-[#d4af37]/60 shadow-xl shadow-red-950/40 transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#ffd875]" />
                  <span>⬇️ HD ডাউনলোড</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantRewardedDownload}
                  disabled={isExporting}
                  title="বিজ্ঞাপন দেখে অপেক্ষা ছাড়া ডাউনলোড করুন"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[#2a1c14] hover:bg-[#38261c] text-[#ffd875] text-xs sm:text-sm font-serif font-bold border border-[#d4af37]/50 shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <Zap className="w-4 h-4 text-[#ffd875]" />
                  <span>⚡ দ্রুত ডাউনলোড (Ad)</span>
                </button>
              </div>
            </div>

            {/* Social Media Share Section */}
            <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-serif text-[#cbbba0] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>সোশ্যাল মিডিয়ায় শেয়ার করুন (Share):</span>
                </span>
                {shareStatusMessage && (
                  <span className="text-[11px] text-[#ffd875] font-serif animate-fade-in bg-[#241a14] px-2 py-0.5 rounded border border-[#d4af37]/30">
                    {shareStatusMessage}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#132219] hover:bg-[#1a3325] border border-[#25D366]/40 text-[#25D366] text-xs font-serif font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  title="WhatsApp-এ পোস্টকার্ড শেয়ার করুন"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#112433] hover:bg-[#163045] border border-[#229ED9]/40 text-[#54c4ff] text-xs font-serif font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  title="Telegram-এ পোস্টকার্ড শেয়ার করুন"
                >
                  <Send className="w-4 h-4 text-[#229ED9]" />
                  <span>Telegram</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#131c2e] hover:bg-[#192742] border border-[#1877F2]/40 text-[#54a3ff] text-xs font-serif font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  title="Facebook-এ পোস্টকার্ড শেয়ার করুন"
                >
                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </button>

                {/* Messenger */}
                <button
                  type="button"
                  onClick={handleShareMessenger}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c182c] hover:bg-[#282142] border border-[#00B2FF]/40 text-[#40c8ff] text-xs font-serif font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  title="Messenger-এ পোস্টকার্ড শেয়ার করুন"
                >
                  <Send className="w-4 h-4 text-[#00B2FF]" />
                  <span>Messenger</span>
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="col-span-3 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e1713] hover:bg-[#2d2019] border border-[#d4af37]/30 text-[#e8dac1] text-xs font-serif shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  title="পোস্টকার্ডের লিংক ও উক্তি কপি করুন"
                >
                  <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>কপি করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Step-by-Step Customization Panel */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-6">
          {/* ------------------------------------------------------------ */}
          {/* STEP 1: SELECT POSTCARD */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#171310] border border-[#d4af37]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#f7eed9] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2d1e18] border border-[#d4af37]/40 text-xs flex items-center justify-center text-[#d4af37]">
                  ১
                </span>
                <span>পোস্টকার্ড নির্বাচন করুন</span>
              </h2>
              <span className="text-xs text-[#d4af37] font-mono">
                {POSTCARD_TEMPLATES.length} Designs
              </span>
            </div>

            {/* Template Search & Category Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8e7e69] absolute left-3 top-3" />
                <input
                  type="text"
                  value={templateSearch}
                  onChange={e => setTemplateSearch(e.target.value)}
                  placeholder="ডিজাইন খুঁজুন (উদা: বৃষ্টি, নদী, চিঠি)..."
                  className="w-full pl-9 pr-4 py-2 bg-[#1f1915] border border-[#d4af37]/30 rounded-lg text-xs sm:text-sm text-[#f7eed9] placeholder-[#8e7e69] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Horizontal scrolling category filter chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                {templateCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTemplateCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition cursor-pointer ${
                      templateCategoryFilter === cat
                        ? 'bg-[#7b2c28] text-white border border-[#d4af37]/50'
                        : 'bg-[#221a15] text-[#baa990] hover:text-white border border-[#d4af37]/20'
                    }`}
                  >
                    {cat === 'all' ? 'সব ডিজাইন' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Postcard Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
              {filteredTemplates.map(tpl => {
                const isSelected = state.selectedPostcard.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#d4af37] ring-2 ring-[#d4af37]/60 shadow-lg'
                        : 'border-[#d4af37]/20 hover:border-[#d4af37]/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-[#110e0c]">
                      <PostcardArtwork type={tpl.image} effect="original" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-1.5 bg-[#171310] border-t border-[#d4af37]/20 flex items-center justify-between">
                      <span className="text-[11px] font-serif text-[#f7eed9] truncate">
                        {tpl.titleBn || tpl.title}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#ffd875]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: SELECT QUOTE (With Smart Shuffle & Recommender) */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#171310] border border-[#d4af37]/25 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#f7eed9] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2d1e18] border border-[#d4af37]/40 text-xs flex items-center justify-center text-[#d4af37]">
                  ২
                </span>
                <span>উক্তি নির্বাচন করুন</span>
              </h2>

              {/* Quick Smart Shuffle trigger */}
              <button
                type="button"
                onClick={handleSmartShuffle}
                disabled={isSmartShuffling}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a1d17] hover:bg-[#7b2c28] border border-[#d4af37]/50 text-[#ffd875] hover:text-white text-xs font-serif transition-all cursor-pointer active:scale-95 shadow-sm"
                title="পোস্টকার্ড আর্টওয়ার্ক ও সাম্প্রতিক অনুসন্ধানের ওপর ভিত্তি করে উক্তি সাজেস্ট করুন"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSmartShuffling ? 'animate-spin text-white' : 'text-[#ffd875]'}`} />
                <span>Smart Shuffle</span>
              </button>
            </div>

            {/* Smart Context Guide: shows what factors are influencing relevance */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-[#1d1612] border border-[#d4af37]/15 text-[11px] font-mono text-[#baa990]">
              <span className="text-[#d4af37] flex items-center gap-1">
                <Compass className="w-3 h-3" />
                স্মার্ট ম্যাচ প্রেক্ষিত:
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2a1e17] text-[#f7eed9] border border-[#d4af37]/20">
                আর্ট: {state.selectedPostcard.category}
              </span>
              {activeSearchQuery && (
                <span className="px-2 py-0.5 rounded bg-[#2a1e17] text-[#f7eed9] border border-[#d4af37]/20">
                  সার্চ: "{activeSearchQuery}"
                </span>
              )}
              {effectiveHistory.categories.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-[#2a1e17] text-[#c7b69d] border border-[#d4af37]/20">
                  ব্রাউজিং: {effectiveHistory.categories.slice(0, 2).join(', ')}
                </span>
              )}
            </div>

            {/* Smart Shuffle Feedback Banner (appears after triggering Smart Shuffle) */}
            {smartShuffleFeedback && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#2c1d17] to-[#1f1612] border border-[#d4af37]/50 space-y-2 animate-fade-in shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#7b2c28] text-white text-[10px] font-serif font-bold uppercase tracking-wider">
                      ✨ {smartShuffleFeedback.badgeLabel || 'স্মার্ট সাজেস্ট'}
                    </span>
                    <span className="text-xs font-serif text-[#ffd875]">
                      {smartShuffleFeedback.matchPercentage}% প্রাসঙ্গিক মিল
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSmartShuffle}
                    className="text-[11px] text-[#ffd875] hover:text-white underline font-serif cursor-pointer"
                  >
                    পরবর্তী উক্তি ⟳
                  </button>
                </div>
                {smartShuffleFeedback.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {smartShuffleFeedback.reasons.map((reason: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#19120e] text-[#e0cfb8] border border-[#d4af37]/25 text-[10px] font-bengali-sans"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quote Categories Filter (with prominent Smart Suggest tab) */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              <button
                type="button"
                onClick={() => setQuoteCategoryFilter('smart')}
                className={`px-3 py-1 rounded-full text-xs font-serif whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  quoteCategoryFilter === 'smart'
                    ? 'bg-gradient-to-r from-[#7b2c28] to-[#993b35] text-white border border-[#ffd875]/70 shadow-md'
                    : 'bg-[#251a14] text-[#ffd875] hover:text-white border border-[#d4af37]/40 hover:bg-[#332219]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#ffd875]" />
                <span>✨ স্মার্ট সাজেস্ট ({topSmartQuotes.length})</span>
              </button>

              {['all', 'love', 'romantic', 'heartbreak', 'missing', 'rain', 'love-letter'].map(cat => {
                const labelBn =
                  cat === 'all'
                    ? 'সব উক্তি'
                    : cat === 'love'
                    ? 'প্রেম'
                    : cat === 'romantic'
                    ? 'রোমান্টিক'
                    : cat === 'heartbreak'
                    ? 'বিরহ'
                    : cat === 'missing'
                    ? 'মিস করা'
                    : cat === 'rain'
                    ? 'বৃষ্টি'
                    : 'প্রেমপত্র';
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setQuoteCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition cursor-pointer ${
                      quoteCategoryFilter === cat
                        ? 'bg-[#7b2c28] text-white border border-[#d4af37]/50'
                        : 'bg-[#221a15] text-[#baa990] hover:text-white border border-[#d4af37]/20'
                    }`}
                  >
                    {labelBn}
                  </button>
                );
              })}
            </div>

            {/* Quotes list with smart relevance badge */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredQuotes.map(q => {
                const isSelected = state.selectedQuoteText === q.text;
                // Find if this quote is in the top recommendations
                const smartMatch = topSmartQuotes.find(item => item.quote.id === q.id);

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#281c16] border-[#d4af37] ring-1 ring-[#d4af37]/50 text-white shadow-md'
                        : 'bg-[#1b1512] border-[#d4af37]/20 hover:border-[#d4af37]/40 text-[#d8c9b3]'
                    }`}
                    onClick={() => handleSelectQuote(q.text)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs sm:text-sm font-bengali-serif leading-relaxed italic">
                        “{q.text}”
                      </p>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectQuote(q.text);
                        }}
                        className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-serif border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#7b2c28] text-white border-[#d4af37]'
                            : 'bg-[#33251e] hover:bg-[#7b2c28] text-[#ffd875] hover:text-white border-[#d4af37]/30'
                        }`}
                      >
                        {isSelected ? 'নির্বাচিত' : 'ব্যবহার করুন'}
                      </button>
                    </div>

                    {/* Metadata & Smart Tagging */}
                    <div className="flex items-center justify-between flex-wrap gap-1 text-[10px] text-[#9b8b76]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded bg-[#241a15] text-[#caa885] border border-[#d4af37]/15">
                          {q.categoryBn}
                        </span>
                        {smartMatch && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#7b2c28]/40 text-[#ffd875] border border-[#d4af37]/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{smartMatch.relevancePercent}% ম্যাচিং</span>
                          </span>
                        )}
                      </div>
                      {smartMatch && smartMatch.reason && (
                        <span className="text-[#baa990] italic">
                          {smartMatch.reason}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: CUSTOM TEXT */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#171310] border border-[#d4af37]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#f7eed9] flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#2d1e18] border border-[#d4af37]/40 text-xs flex items-center justify-center text-[#d4af37]">
                ✍️
              </span>
              <span>অথবা নিজের লেখা লিখুন</span>
            </h2>

            <div className="space-y-4">
              {/* Recipient / প্রাপক */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif text-[#cbbba0] mb-1">
                    প্রাপক (Recipient):
                  </label>
                  <input
                    type="text"
                    value={state.recipient}
                    onChange={e => setState(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder="প্রিয়তমা..."
                    className="w-full px-3 py-2 bg-[#1f1915] border border-[#d4af37]/30 rounded-lg text-xs sm:text-sm text-[#f7eed9] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif text-[#cbbba0] mb-1">
                    প্রেরক (Sender):
                  </label>
                  <input
                    type="text"
                    value={state.sender}
                    onChange={e => setState(prev => ({ ...prev, sender: e.target.value }))}
                    placeholder="ইতি, তোমার..."
                    className="w-full px-3 py-2 bg-[#1f1915] border border-[#d4af37]/30 rounded-lg text-xs sm:text-sm text-[#f7eed9] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Date / তারিখ (Optional) */}
              <div>
                <label className="block text-xs font-serif text-[#cbbba0] mb-1">
                  তারিখ (Date - Optional):
                </label>
                <input
                  type="text"
                  value={state.date}
                  onChange={e => setState(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="১৪ই ফেব্রুয়ারি / শ্রাবণ, ১৪৩১..."
                  className="w-full px-3 py-2 bg-[#1f1915] border border-[#d4af37]/30 rounded-lg text-xs sm:text-sm text-[#f7eed9] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Main Body Textarea */}
              <div>
                <label className="block text-xs font-serif text-[#cbbba0] mb-1">
                  মূল লেখা (Main Postcard Text):
                </label>
                <textarea
                  rows={3}
                  value={customTextDraft}
                  onChange={e => setCustomTextDraft(e.target.value)}
                  placeholder="এখানে আপনার নিজের লেখা লিখুন..."
                  className="w-full p-3 bg-[#1f1915] border border-[#d4af37]/30 rounded-lg text-xs sm:text-sm text-[#f7eed9] font-bengali-serif leading-relaxed focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, selectedQuoteText: customTextDraft }))}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2d1e18] hover:bg-[#7b2c28] text-xs font-serif text-[#ffd875] hover:text-white border border-[#d4af37]/35 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>লেখাটি ব্যবহার করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: TEXT CUSTOMIZATION */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#171310] border border-[#d4af37]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#f7eed9] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#d4af37]" />
                <span>টেক্সট কাস্টমাইজেশন (Styling)</span>
              </h2>
              <button
                type="button"
                onClick={handleResetTextStyle}
                className="inline-flex items-center gap-1 text-xs text-[#baa990] hover:text-[#ffd875] transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Style</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Font Family Selection */}
              <div>
                <label className="block text-xs font-serif text-[#cbbba0] mb-1.5">
                  ফন্ট স্টাইল (Font Family):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fontOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, fontFamily: opt.value }))}
                      className={`p-2 rounded-lg text-left border transition ${
                        state.fontFamily === opt.value
                          ? 'bg-[#3d201b] border-[#d4af37] text-white font-medium'
                          : 'bg-[#1e1713] border-[#d4af37]/20 text-[#cbbba0] hover:text-white'
                      }`}
                    >
                      <span className="block truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size, Alignment, Bold, Italic Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#d4af37]/15">
                {/* Font Size Slider */}
                <div>
                  <div className="flex justify-between text-xs text-[#cbbba0] mb-1">
                    <span>ফন্ট সাইজ (Size)</span>
                    <span className="font-mono">{state.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={38}
                    value={state.fontSize}
                    onChange={e => setState(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                    className="w-full accent-[#d4af37] bg-[#2a201a]"
                  />
                </div>

                {/* Alignment & Weight Buttons */}
                <div>
                  <label className="block text-xs text-[#cbbba0] mb-1">অ্যালাইনমেন্ট ও ফরম্যাট</label>
                  <div className="flex items-center gap-1.5">
                    {/* Left */}
                    <button
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, textAlign: 'left' }))}
                      className={`p-2 rounded border ${state.textAlign === 'left' ? 'bg-[#7b2c28] border-[#d4af37]' : 'bg-[#221a15] border-[#d4af37]/20 text-[#baa990]'}`}
                      title="বামপাশে"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    {/* Center */}
                    <button
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, textAlign: 'center' }))}
                      className={`p-2 rounded border ${state.textAlign === 'center' ? 'bg-[#7b2c28] border-[#d4af37]' : 'bg-[#221a15] border-[#d4af37]/20 text-[#baa990]'}`}
                      title="মাঝখানে"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    {/* Right */}
                    <button
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, textAlign: 'right' }))}
                      className={`p-2 rounded border ${state.textAlign === 'right' ? 'bg-[#7b2c28] border-[#d4af37]' : 'bg-[#221a15] border-[#d4af37]/20 text-[#baa990]'}`}
                      title="ডানপাশে"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    {/* Bold */}
                    <button
                      type="button"
                      onClick={() =>
                        setState(prev => ({
                          ...prev,
                          fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold',
                        }))
                      }
                      className={`p-2 rounded border ${state.fontWeight === 'bold' ? 'bg-[#7b2c28] border-[#d4af37]' : 'bg-[#221a15] border-[#d4af37]/20 text-[#baa990]'}`}
                      title="বোল্ড"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    {/* Italic */}
                    <button
                      type="button"
                      onClick={() =>
                        setState(prev => ({
                          ...prev,
                          fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic',
                        }))
                      }
                      className={`p-2 rounded border ${state.fontStyle === 'italic' ? 'bg-[#7b2c28] border-[#d4af37]' : 'bg-[#221a15] border-[#d4af37]/20 text-[#baa990]'}`}
                      title="ইটালিক"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Position & Color Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#d4af37]/15">
                {/* Text Position */}
                <div>
                  <label className="block text-xs text-[#cbbba0] mb-1">টেক্সটের অবস্থান (Position)</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['top', 'center', 'bottom', 'split'] as TextPositionType[]).map(pos => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, textPosition: pos }))}
                        className={`py-1.5 px-1 rounded text-center border text-[10px] capitalize transition ${
                          state.textPosition === pos
                            ? 'bg-[#7b2c28] border-[#d4af37] text-white font-medium'
                            : 'bg-[#1f1915] border-[#d4af37]/20 text-[#baa990]'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-xs text-[#cbbba0] mb-1">রং (Text Color)</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPresets.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, textColor: c.value }))}
                        className={`w-6 h-6 rounded-full border transition transform active:scale-90 ${
                          state.textColor === c.value ? 'ring-2 ring-[#d4af37] scale-110' : 'border-black/50'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Border Styles */}
              <div className="pt-2 border-t border-[#d4af37]/15">
                <label className="block text-xs text-[#cbbba0] mb-1.5">বর্ডার স্টাইল (Decorative Border):</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(['ornate', 'classic', 'double', 'stamp', 'postcard-split', 'minimal'] as BorderStyleType[]).map(
                    b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, borderStyle: b }))}
                        className={`p-1.5 rounded text-center border text-[10px] capitalize transition ${
                          state.borderStyle === b
                            ? 'bg-[#7b2c28] border-[#d4af37] text-white font-bold'
                            : 'bg-[#1f1915] border-[#d4af37]/20 text-[#baa990]'
                        }`}
                      >
                        {b.replace('-', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 5: VINTAGE EFFECTS */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-[#171310] border border-[#d4af37]/25 rounded-2xl p-5 sm:p-6 shadow-xl">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#f7eed9] flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-[#d4af37]" />
              <span>ভিন্টেজ ইফেক্টস (Vintage Effects)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {effectOptions.map(fx => {
                const isSelected = state.effect === fx.id;
                return (
                  <button
                    key={fx.id}
                    type="button"
                    onClick={() => setState(prev => ({ ...prev, effect: fx.id }))}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#3b211a] border-[#d4af37] text-white shadow-md'
                        : 'bg-[#1e1713] border-[#d4af37]/20 text-[#baa990] hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-serif font-semibold">{fx.nameBn}</span>
                    <span className="text-[10px] text-[#8e7e69] mt-0.5">{fx.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Gate Modal */}
      <DownloadGateModal
        isOpen={isDownloadGateOpen}
        onClose={() => setIsDownloadGateOpen(false)}
        onDownloadConfirmed={handlePerformDownload}
        isDownloading={isExporting}
      />
    </div>
  );
};
