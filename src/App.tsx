import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ActiveTab, PostcardTemplate, RomanticQuote, GalleryItem, CategoryItem } from './types';
import { POSTCARD_TEMPLATES } from './data/postcards';
import { ROMANTIC_QUOTES } from './data/quotes';
import { GALLERY_ITEMS } from './data/gallery';
import { MAIN_CATEGORIES } from './data/categories';
import { useFavorites } from './hooks/useFavorites';
import { useUserActivityHistory } from './hooks/useUserActivityHistory';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { PostcardCard } from './components/PostcardCard';
import { QuoteCard } from './components/QuoteCard';
import { GalleryCard } from './components/GalleryCard';
import { SearchBar } from './components/SearchBar';
import { PostcardGenerator } from './components/PostcardGenerator';
import { DownloadGateModal } from './components/DownloadGateModal';
import { Footer } from './components/Footer';
import { PrivacyPolicy, TermsAndConditions, ContactPage } from './components/StaticPages';
import { exportPostcardNode } from './lib/exportPostcard';
import { initInAppInterstitial } from './lib/adService';
import { initTelegramWebApp, isTelegram, openSafeLink } from './lib/telegram';
import {
  Sparkles,
  Flame,
  Heart,
  CloudRain,
  Mail,
  ArrowRight,
  Layers,
  X,
  Download,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPostcard, setSelectedPostcard] = useState<PostcardTemplate>(POSTCARD_TEMPLATES[0]);
  const [selectedQuote, setSelectedQuote] = useState<RomanticQuote | undefined>(undefined);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Gallery viewer & download gate state
  const [viewingGalleryItem, setViewingGalleryItem] = useState<GalleryItem | null>(null);
  const [downloadingGalleryItem, setDownloadingGalleryItem] = useState<GalleryItem | null>(null);
  const [isGalleryDownloadGateOpen, setIsGalleryDownloadGateOpen] = useState<boolean>(false);
  const galleryPosterRef = useRef<HTMLDivElement>(null);

  // Favorites hook (persisted in localStorage)
  const {
    favorites,
    togglePostcardFavorite,
    toggleQuoteFavorite,
    toggleGalleryFavorite,
    isPostcardFavorite,
    isQuoteFavorite,
    isGalleryFavorite,
  } = useFavorites();

  const totalFavoritesCount = favorites.postcards.length + favorites.quotes.length + favorites.gallery.length;

  // User activity history tracking for smart recommendations and smart shuffle
  const {
    history: userActivityHistory,
    recordSearch,
    recordCategory,
    recordPostcardView,
    recordQuoteView,
    recordTabNavigation,
  } = useUserActivityHistory();

  // Debounced search recording
  useEffect(() => {
    if (globalSearchQuery && globalSearchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        recordSearch(globalSearchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [globalSearchQuery, recordSearch]);

  // Tab change recording
  useEffect(() => {
    recordTabNavigation(activeTab);
  }, [activeTab, recordTabNavigation]);

  // Telegram WebApp initialization & state
  const [inTelegram, setInTelegram] = useState<boolean>(false);
  const [dismissTelegramBanner, setDismissTelegramBanner] = useState<boolean>(false);

  useEffect(() => {
    initTelegramWebApp();
    setInTelegram(isTelegram());
  }, []);

  // Monetization SDK: In-App Interstitial initialization
  useEffect(() => {
    initInAppInterstitial();
  }, []);

  // Navigate to generator with template
  const handleUsePostcard = (postcard: PostcardTemplate) => {
    setSelectedPostcard(postcard);
    recordPostcardView(postcard.id, postcard.category);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to generator with quote
  const handleUseQuote = (quote: RomanticQuote) => {
    setSelectedQuote(quote);
    recordQuoteView(quote.id, quote.categoryBn);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Category Select
  const handleCategorySelect = (category: CategoryItem) => {
    setSelectedCategoryFilter(category.nameBn);
    recordCategory(category.nameBn);
    setActiveTab('postcards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger download for static gallery item via sponsor gate
  const handleGalleryDownloadRequest = (item: GalleryItem) => {
    setDownloadingGalleryItem(item);
    setIsGalleryDownloadGateOpen(true);
  };

  // Perform gallery download after 8s countdown finishes
  const handlePerformGalleryDownload = async () => {
    if (!downloadingGalleryItem) return;
    setIsGalleryDownloadGateOpen(false);

    // If modal DOM node exists, export it, otherwise create offscreen node
    const node = galleryPosterRef.current || document.getElementById('gallery-poster-node');
    if (node) {
      try {
        await exportPostcardNode(node, {
          format: 'png',
          filename: `MinimalPostCardBD_${downloadingGalleryItem.title.replace(/\s+/g, '_')}`,
          pixelRatio: 2.5,
        });
      } catch (err) {
        console.error('Gallery export failure:', err);
      }
    }
  };

  // -------------------------------------------------------------
  // Filtered Collections
  // -------------------------------------------------------------

  // Homepage featured postcard collections
  const popularPostcards = useMemo(() => {
    return POSTCARD_TEMPLATES.filter(p => p.featuredSection === 'popular');
  }, []);

  const newPostcards = useMemo(() => {
    return POSTCARD_TEMPLATES.filter(p => p.featuredSection === 'new');
  }, []);

  const romanticPostcards = useMemo(() => {
    return POSTCARD_TEMPLATES.filter(p => p.featuredSection === 'romantic');
  }, []);

  const rainyPostcards = useMemo(() => {
    return POSTCARD_TEMPLATES.filter(p => p.featuredSection === 'rainy');
  }, []);

  const letterPostcards = useMemo(() => {
    return POSTCARD_TEMPLATES.filter(p => p.featuredSection === 'letter');
  }, []);

  // Postcard library filtered
  const libraryPostcards = useMemo(() => {
    return POSTCARD_TEMPLATES.filter(tpl => {
      const matchCat =
        selectedCategoryFilter === 'all' ||
        tpl.category === selectedCategoryFilter ||
        tpl.tags.some(t => t.toLowerCase() === selectedCategoryFilter.toLowerCase());
      const matchSearch =
        !globalSearchQuery ||
        tpl.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        tpl.titleBn.includes(globalSearchQuery) ||
        tpl.category.includes(globalSearchQuery) ||
        tpl.defaultQuote.includes(globalSearchQuery);
      return matchCat && matchSearch;
    });
  }, [selectedCategoryFilter, globalSearchQuery]);

  // Quotes filtered
  const libraryQuotes = useMemo(() => {
    return ROMANTIC_QUOTES.filter(q => {
      const matchCat =
        selectedCategoryFilter === 'all' ||
        q.categoryBn === selectedCategoryFilter ||
        q.category === selectedCategoryFilter;
      const matchSearch =
        !globalSearchQuery ||
        q.text.includes(globalSearchQuery) ||
        q.categoryBn.includes(globalSearchQuery);
      return matchCat && matchSearch;
    });
  }, [selectedCategoryFilter, globalSearchQuery]);

  // Gallery filtered
  const libraryGallery = useMemo(() => {
    return GALLERY_ITEMS.filter(g => {
      const matchSearch =
        !globalSearchQuery ||
        g.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        g.quote.includes(globalSearchQuery) ||
        g.category.toLowerCase().includes(globalSearchQuery.toLowerCase());
      return matchSearch;
    });
  }, [globalSearchQuery]);

  // Global Search results aggregation
  const isGlobalSearching = globalSearchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0c0b] text-[#f5ebd7] selection:bg-[#7b2c28] selection:text-[#fff4e3]">
      {/* Telegram Optimization Banner */}
      {inTelegram && !dismissTelegramBanner && (
        <aside
          aria-label="টেলিগ্রাম ব্রাউজার নোটিশ"
          className="bg-[#1c1410] border-b border-[#d4af37]/40 px-3.5 py-2 text-xs flex items-center justify-between gap-2 text-[#ffd875] z-50 sticky top-0"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-base flex-shrink-0">💌</span>
            <span className="truncate text-[#f5ebd7] text-xs font-serif">
              টেলিগ্রামে পোস্টকার্ড জেনারেটর চলছে। ব্রাউজারের পূর্ণ সুবিধার জন্য:
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => openSafeLink(window.location.href)}
              className="px-2.5 py-1 bg-gradient-to-r from-[#7b2c28] to-[#9c3730] hover:brightness-110 text-[#fff8ee] rounded-lg font-serif text-[11px] font-semibold border border-[#d4af37]/50 shadow-sm transition active:scale-95"
            >
              Chrome / ব্রাউজারে খুলুন
            </button>
            <button
              type="button"
              onClick={() => setDismissTelegramBanner(true)}
              className="text-[#a89880] hover:text-[#f5ebd7] p-1 transition"
              aria-label="Close notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={totalFavoritesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ============================================================== */}
        {/* TAB 1: HOMEPAGE */}
        {/* ============================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 sm:space-y-24 pb-16">
            {/* Hero Section */}
            <HeroSection
              onCreateClick={() => {
                setActiveTab('create');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGalleryClick={() => {
                setActiveTab('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Global Search Bar Section on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#16120f] border border-[#d4af37]/25 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl">
                <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase mb-2">
                  SEARCH THE ARCHIVE
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9] mb-4">
                  উক্তি বা পোস্টকার্ড খুঁজুন
                </h2>
                <SearchBar
                  value={globalSearchQuery}
                  onChange={setGlobalSearchQuery}
                  placeholder="উক্তি বা পোস্টকার্ড খুঁজুন (উদা: বৃষ্টি, চিঠি, গোলাপ)..."
                  className="max-w-2xl"
                />
              </div>
            </section>

            {/* If searching on home, show search results right here */}
            {isGlobalSearching ? (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#ffd875] mb-4">
                    পোস্টকার্ড ফলাফল ({libraryPostcards.length})
                  </h3>
                  {libraryPostcards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {libraryPostcards.map(p => (
                        <PostcardCard
                          key={p.id}
                          postcard={p}
                          isFavorite={isPostcardFavorite(p.id)}
                          onToggleFavorite={togglePostcardFavorite}
                          onSelect={handleUsePostcard}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#8e7e69] font-serif">কোনো পোস্টকার্ড বা উক্তি পাওয়া যায়নি।</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-[#ffd875] mb-4">
                    উক্তি ফলাফল ({libraryQuotes.length})
                  </h3>
                  {libraryQuotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {libraryQuotes.map(q => (
                        <QuoteCard
                          key={q.id}
                          quote={q}
                          isFavorite={isQuoteFavorite(q.id)}
                          onToggleFavorite={toggleQuoteFavorite}
                          onUseQuote={handleUseQuote}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#8e7e69] font-serif">কোনো পোস্টকার্ড বা উক্তি পাওয়া যায়নি।</p>
                  )}
                </div>
              </section>
            ) : (
              <>
                {/* Category Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9]">
                        ক্যাটাগরি বেছে নিন
                      </h2>
                      <p className="text-xs sm:text-sm text-[#a89880] font-bengali-sans mt-0.5">
                        আপনার পছন্দের অনুভূতি নির্বাচন করে পোস্টকার্ড খুঁজুন
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('categories');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-serif text-[#d4af37] hover:underline"
                    >
                      <span>সব দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <CategoryGrid onSelectCategory={handleCategorySelect} />
                </section>

                {/* FEATURED 1: 🔥 জনপ্রিয় পোস্টকার্ড (Popular) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#301c15] text-[#ff7849]">
                        <Flame className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9]">
                          জনপ্রিয় পোস্টকার্ড
                        </h2>
                        <p className="text-xs text-[#a89880]">সবচেয়ে বেশি ব্যবহৃত পোস্টকার্ড ডিজাইন</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('postcards');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs sm:text-sm font-serif text-[#d4af37] hover:underline"
                    >
                      পোস্টকার্ড লাইব্রেরি &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {popularPostcards.slice(0, 3).map(p => (
                      <PostcardCard
                        key={p.id}
                        postcard={p}
                        isFavorite={isPostcardFavorite(p.id)}
                        onToggleFavorite={togglePostcardFavorite}
                        onSelect={handleUsePostcard}
                      />
                    ))}
                  </div>
                </section>

                {/* FEATURED 2: ✨ নতুন পোস্টকার্ড (New) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#272118] text-[#ffd875]">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9]">
                          নতুন পোস্টকার্ড
                        </h2>
                        <p className="text-xs text-[#a89880]">আর্কাইভে যুক্ত হওয়া সাম্প্রতিক ভিন্টেজ ডিজাইন</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {newPostcards.slice(0, 3).map(p => (
                      <PostcardCard
                        key={p.id}
                        postcard={p}
                        isFavorite={isPostcardFavorite(p.id)}
                        onToggleFavorite={togglePostcardFavorite}
                        onSelect={handleUsePostcard}
                      />
                    ))}
                  </div>
                </section>

                {/* FEATURED 3: ❤️ Romantic Collection */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#3a1a1e] text-[#ff6b81]">
                        <Heart className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9]">
                          Romantic Collection
                        </h2>
                        <p className="text-xs text-[#a89880]">প্রিয় মানুষের হৃদয়ে দাগ কাটার মতো মিষ্টি কথামালা</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {romanticPostcards.slice(0, 3).map(p => (
                      <PostcardCard
                        key={p.id}
                        postcard={p}
                        isFavorite={isPostcardFavorite(p.id)}
                        onToggleFavorite={togglePostcardFavorite}
                        onSelect={handleUsePostcard}
                      />
                    ))}
                  </div>
                </section>

                {/* FEATURED 4: 🌧️ Rainy Love Collection */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#1a2c33] text-[#70a1ff]">
                        <CloudRain className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9]">
                          Rainy Love Collection
                        </h2>
                        <p className="text-xs text-[#a89880]">বৃষ্টিভেজা স্মৃতি, এক ছাতায় দুজন আর জানালার বাষ্প</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {rainyPostcards.slice(0, 3).map(p => (
                      <PostcardCard
                        key={p.id}
                        postcard={p}
                        isFavorite={isPostcardFavorite(p.id)}
                        onToggleFavorite={togglePostcardFavorite}
                        onSelect={handleUsePostcard}
                      />
                    ))}
                  </div>
                </section>

                {/* FEATURED 5: 💌 Vintage Letter Collection */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#302419] text-[#ffd875]">
                        <Mail className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7eed9]">
                          Vintage Letter Collection
                        </h2>
                        <p className="text-xs text-[#a89880]">হলুদ খাম, ডাকটিকিট ও লাল গালার সিলের চিঠি</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {letterPostcards.slice(0, 3).map(p => (
                      <PostcardCard
                        key={p.id}
                        postcard={p}
                        isFavorite={isPostcardFavorite(p.id)}
                        onToggleFavorite={togglePostcardFavorite}
                        onSelect={handleUsePostcard}
                      />
                    ))}
                  </div>
                </section>

                {/* Quick Call to Action Banner */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-r from-[#2c1613] via-[#3a1b18] to-[#251210] border border-[#d4af37]/40 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                      <span className="text-xs font-mono tracking-widest text-[#ffd875] uppercase">
                        START CREATING TODAY
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fff7ea]">
                        “একটি পুরনো প্রেমপত্রের স্মৃতি, আধুনিক ডিজিটাল পোস্টকার্ডে।”
                      </h2>
                      <p className="text-sm text-[#d8c7b0]">
                        কোনো ফটো আপলোড বা অ্যাকাউন্ট খোলার ঝামেলা নেই। এক ক্লিকেই তৈরি করুন রোমান্টিক ভিন্টেজ পোস্টকার্ড।
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('create');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7b2c28] to-[#923530] text-[#fff8ee] text-sm sm:text-base font-serif font-bold border border-[#d4af37]/60 shadow-xl cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-[#ffd875]" />
                          <span>✨ পোস্টকার্ড তৈরি শুরু করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: POSTCARD LIBRARY */}
        {/* ============================================================== */}
        {activeTab === 'postcards' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7eed9]">
                পোস্টকার্ড টেমপ্লেট লাইব্রেরি
              </h1>
              <p className="text-xs sm:text-sm text-[#baa990] font-bengali-sans">
                আপনার পছন্দের ভিন্টেজ পোস্টকার্ড নির্বাচন করুন এবং তাৎক্ষণিক এডিটরে কাস্টমাইজ করুন।
              </p>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <SearchBar
                value={globalSearchQuery}
                onChange={setGlobalSearchQuery}
                placeholder="পোস্টকার্ড খুঁজুন..."
                className="w-full md:max-w-md"
              />

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif whitespace-nowrap transition ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-[#7b2c28] text-white border border-[#d4af37]/50'
                      : 'bg-[#1b1512] text-[#baa990] border border-[#d4af37]/20 hover:text-white'
                  }`}
                >
                  সব ক্যাটাগরি
                </button>
                {MAIN_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.nameBn)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif whitespace-nowrap transition ${
                      selectedCategoryFilter === c.nameBn
                        ? 'bg-[#7b2c28] text-white border border-[#d4af37]/50'
                        : 'bg-[#1b1512] text-[#baa990] border border-[#d4af37]/20 hover:text-white'
                    }`}
                  >
                    {c.emoji} {c.nameBn}
                  </button>
                ))}
              </div>
            </div>

            {/* Postcard Grid */}
            {libraryPostcards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {libraryPostcards.map(p => (
                  <PostcardCard
                    key={p.id}
                    postcard={p}
                    isFavorite={isPostcardFavorite(p.id)}
                    onToggleFavorite={togglePostcardFavorite}
                    onSelect={handleUsePostcard}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 bg-[#16120f] border border-[#d4af37]/20 rounded-2xl p-8">
                <span className="text-4xl">💌</span>
                <p className="text-base font-serif text-[#baa990]">কোনো পোস্টকার্ড বা উক্তি পাওয়া যায়নি।</p>
                <button
                  onClick={() => {
                    setGlobalSearchQuery('');
                    setSelectedCategoryFilter('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#271e19] text-xs text-[#ffd875] border border-[#d4af37]/30"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: GENERATOR (/create) */}
        {/* ============================================================== */}
        {activeTab === 'create' && (
          <PostcardGenerator
            initialPostcard={selectedPostcard}
            initialQuote={selectedQuote}
            isFavorite={isPostcardFavorite}
            onToggleFavorite={togglePostcardFavorite}
            activeSearchQuery={globalSearchQuery}
            activeCategoryFilter={selectedCategoryFilter}
            userHistory={userActivityHistory}
            favoriteQuoteIds={favorites.quotes}
            favoritePostcardIds={favorites.postcards}
          />
        )}

        {/* ============================================================== */}
        {/* TAB 4: QUOTES LIBRARY */}
        {/* ============================================================== */}
        {activeTab === 'quotes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7eed9]">
                রোমান্টিক উক্তি সংগ্রহ
              </h1>
              <p className="text-xs sm:text-sm text-[#baa990] font-bengali-sans">
                প্রিয়জনের জন্য উপযুক্ত উক্তি বেছে নিয়ে সরাসরি পোস্টকার্ডে ব্যবহার করুন।
              </p>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <SearchBar
                value={globalSearchQuery}
                onChange={setGlobalSearchQuery}
                placeholder="উক্তি খুঁজুন..."
                className="w-full md:max-w-md"
              />

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif whitespace-nowrap transition ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-[#7b2c28] text-white border border-[#d4af37]/50'
                      : 'bg-[#1b1512] text-[#baa990] border border-[#d4af37]/20 hover:text-white'
                  }`}
                >
                  সব উক্তি
                </button>
                {MAIN_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.nameBn)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif whitespace-nowrap transition ${
                      selectedCategoryFilter === c.nameBn
                        ? 'bg-[#7b2c28] text-white border border-[#d4af37]/50'
                        : 'bg-[#1b1512] text-[#baa990] border border-[#d4af37]/20 hover:text-white'
                    }`}
                  >
                    {c.emoji} {c.nameBn}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Grid */}
            {libraryQuotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryQuotes.map(q => (
                  <QuoteCard
                    key={q.id}
                    quote={q}
                    isFavorite={isQuoteFavorite(q.id)}
                    onToggleFavorite={toggleQuoteFavorite}
                    onUseQuote={handleUseQuote}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 bg-[#16120f] border border-[#d4af37]/20 rounded-2xl p-8">
                <span className="text-4xl">📖</span>
                <p className="text-base font-serif text-[#baa990]">কোনো পোস্টকার্ড বা উক্তি পাওয়া যায়নি।</p>
                <button
                  onClick={() => {
                    setGlobalSearchQuery('');
                    setSelectedCategoryFilter('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#271e19] text-xs text-[#ffd875] border border-[#d4af37]/30"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: VINTAGE QUOTE GALLERY */}
        {/* ============================================================== */}
        {activeTab === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241a14] border border-[#d4af37]/30 text-xs font-mono text-[#d4af37] mb-2">
                <span>🖼️ STATIC ARTWORK COLLECTION</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7eed9]">
                Vintage Quote Gallery
              </h1>
              <p className="text-xs sm:text-sm text-[#baa990] font-bengali-sans">
                স্থির নস্টালজিক ভিন্টেজ আর্টওয়ার্ক পোস্টার। সরাসরি দেখুন এবং স্পনসর গেটের মাধ্যমে HD রেজোলিউশনে ডাউনলোড করুন।
              </p>
            </div>

            {/* Gallery Grid */}
            {libraryGallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {libraryGallery.map(item => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    isFavorite={isGalleryFavorite(item.id)}
                    onToggleFavorite={toggleGalleryFavorite}
                    onView={setViewingGalleryItem}
                    onDownload={handleGalleryDownloadRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 bg-[#16120f] border border-[#d4af37]/20 rounded-2xl p-8">
                <span className="text-4xl">🖼️</span>
                <p className="text-base font-serif text-[#baa990]">
                  এই ক্যাটাগরিতে শীঘ্রই নতুন Vintage Artwork যোগ করা হবে।
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: ALL CATEGORIES */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7eed9]">
                সব ক্যাটাগরি (Categories)
              </h1>
              <p className="text-xs sm:text-sm text-[#baa990] font-bengali-sans">
                প্রতিটি ভালোবাসার অনুভূতির জন্য রয়েছে বিশেষ পোস্টকার্ড ও রোমান্টিক কথার ভাণ্ডার।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {MAIN_CATEGORIES.map(category => {
                const count = POSTCARD_TEMPLATES.filter(
                  p => p.category === category.nameBn || p.tags.includes(category.name)
                ).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="p-5 rounded-xl bg-[#171310] border border-[#d4af37]/25 hover:border-[#d4af37]/60 text-left transition hover:-translate-y-1 shadow-lg group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl mb-3 block">{category.emoji}</span>
                      <span className="text-xs font-mono text-[#d4af37] bg-[#221813] px-2 py-0.5 rounded border border-[#d4af37]/20">
                        {count} টি কার্ড
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#f7eed9] group-hover:text-[#ffd875] transition">
                      {category.nameBn} ({category.name})
                    </h3>
                    <p className="text-xs text-[#baa990] mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: FAVORITES (♡ আমার পছন্দ) */}
        {/* ============================================================== */}
        {activeTab === 'favorites' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f7eed9] flex items-center justify-center gap-3">
                <Heart className="w-7 h-7 fill-[#c0392b] text-[#c0392b]" />
                <span>আমার পছন্দ (Favorites)</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#baa990] font-bengali-sans">
                আপনার ব্রাউজারে সংরক্ষিত পছন্দের পোস্টকার্ড ও উক্তিগুলো এখানে দেখতে পাবেন।
              </p>
            </div>

            {totalFavoritesCount === 0 ? (
              <div className="py-20 text-center space-y-3 bg-[#16120f] border border-[#d4af37]/20 rounded-2xl p-8 max-w-md mx-auto">
                <Heart className="w-12 h-12 mx-auto text-[#7b2c28]" />
                <p className="text-base font-serif text-[#baa990]">
                  ♡ এখনো কোনো পোস্টকার্ড পছন্দের তালিকায় নেই।
                </p>
                <button
                  onClick={() => setActiveTab('postcards')}
                  className="px-5 py-2.5 rounded-lg bg-[#7b2c28] text-[#fff8ee] text-xs font-serif border border-[#d4af37]/40 shadow cursor-pointer"
                >
                  পোস্টকার্ড খুঁজুন
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Favorite Postcards */}
                {favorites.postcards.length > 0 && (
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#ffd875] mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      <span>পছন্দের পোস্টকার্ডসমূহ ({favorites.postcards.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {POSTCARD_TEMPLATES.filter(p => favorites.postcards.includes(p.id)).map(p => (
                        <PostcardCard
                          key={p.id}
                          postcard={p}
                          isFavorite={true}
                          onToggleFavorite={togglePostcardFavorite}
                          onSelect={handleUsePostcard}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorite Quotes */}
                {favorites.quotes.length > 0 && (
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#ffd875] mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <span>পছন্দের উক্তিসমূহ ({favorites.quotes.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ROMANTIC_QUOTES.filter(q => favorites.quotes.includes(q.id)).map(q => (
                        <QuoteCard
                          key={q.id}
                          quote={q}
                          isFavorite={true}
                          onToggleFavorite={toggleQuoteFavorite}
                          onUseQuote={handleUseQuote}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorite Gallery Posters */}
                {favorites.gallery.length > 0 && (
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#ffd875] mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      <span>পছন্দের গ্যালারি পোস্টার ({favorites.gallery.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {GALLERY_ITEMS.filter(g => favorites.gallery.includes(g.id)).map(item => (
                        <GalleryCard
                          key={item.id}
                          item={item}
                          isFavorite={true}
                          onToggleFavorite={toggleGalleryFavorite}
                          onView={setViewingGalleryItem}
                          onDownload={handleGalleryDownloadRequest}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: PRIVACY, TERMS, CONTACT */}
        {/* ============================================================== */}
        {activeTab === 'privacy' && <PrivacyPolicy />}
        {activeTab === 'terms' && <TermsAndConditions />}
        {activeTab === 'contact' && <ContactPage />}
      </main>

      {/* Full Artwork Modal for Gallery Inspection */}
      {viewingGalleryItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#181310] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setViewingGalleryItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#baa990] hover:text-white bg-black/40 hover:bg-black/60"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Big Poster Preview */}
            <div
              ref={galleryPosterRef}
              id="gallery-poster-node"
              className="aspect-[4/5] w-full rounded-xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl relative"
              style={{ backgroundColor: viewingGalleryItem.themeColor }}
            >
              <div className="absolute inset-4 border border-[#d4af37]/40 pointer-events-none" />
              <div className="relative z-10 flex justify-between items-center text-[11px] font-mono text-[#d4af37] tracking-widest">
                <span>VINTAGE ARCHIVE</span>
                <span>{viewingGalleryItem.category}</span>
              </div>

              <div className="relative z-10 text-center my-auto px-4">
                <p className="text-xl sm:text-2xl font-serif text-[#fff7e8] leading-relaxed italic drop-shadow-md">
                  “{viewingGalleryItem.quote}”
                </p>
                {viewingGalleryItem.quoteEn && (
                  <p className="text-xs font-mono text-[#ffd875]/90 mt-4 tracking-wider uppercase">
                    — {viewingGalleryItem.quoteEn}
                  </p>
                )}
              </div>

              <div className="relative z-10 flex justify-between text-[10px] text-[#baa990] font-mono border-t border-[#d4af37]/25 pt-3">
                <span>MINIMAL POSTCARD BD</span>
                <span>LIMITED EDITION</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  toggleGalleryFavorite(viewingGalleryItem.id);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-serif transition ${
                  isGalleryFavorite(viewingGalleryItem.id)
                    ? 'bg-[#7b2c28] border-[#d4af37] text-white'
                    : 'bg-[#251d18] border-[#d4af37]/30 text-[#baa990] hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isGalleryFavorite(viewingGalleryItem.id) ? 'fill-current' : ''}`} />
                <span>{isGalleryFavorite(viewingGalleryItem.id) ? 'পছন্দ করা হয়েছে' : 'পছন্দ করুন'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewingGalleryItem(null);
                  handleGalleryDownloadRequest(viewingGalleryItem);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7b2c28] to-[#923530] text-[#fff8ee] font-serif font-bold text-xs sm:text-sm border border-[#d4af37]/50 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#ffd875]" />
                <span>HD ডাউনলোড</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden container for rendering gallery poster node during download if not actively open in modal */}
      {downloadingGalleryItem && !viewingGalleryItem && (
        <div className="fixed -left-[9999px] top-0 pointer-events-none">
          <div
            id="gallery-poster-node"
            className="w-[800px] h-[1000px] p-12 flex flex-col justify-between overflow-hidden relative"
            style={{ backgroundColor: downloadingGalleryItem.themeColor }}
          >
            <div className="absolute inset-8 border border-[#d4af37]/40 pointer-events-none" />
            <div className="relative z-10 flex justify-between items-center text-sm font-mono text-[#d4af37] tracking-widest">
              <span>VINTAGE ARCHIVE</span>
              <span>{downloadingGalleryItem.category}</span>
            </div>

            <div className="relative z-10 text-center my-auto px-8">
              <p className="text-3xl font-serif text-[#fff7e8] leading-relaxed italic drop-shadow-md">
                “{downloadingGalleryItem.quote}”
              </p>
              {downloadingGalleryItem.quoteEn && (
                <p className="text-base font-mono text-[#ffd875]/90 mt-6 tracking-wider uppercase">
                  — {downloadingGalleryItem.quoteEn}
                </p>
              )}
            </div>

            <div className="relative z-10 flex justify-between text-xs text-[#baa990] font-mono border-t border-[#d4af37]/25 pt-4">
              <span>MINIMAL POSTCARD BD</span>
              <span>LIMITED EDITION</span>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Gate Modal for Gallery Downloads */}
      <DownloadGateModal
        isOpen={isGalleryDownloadGateOpen}
        onClose={() => setIsGalleryDownloadGateOpen(false)}
        onDownloadConfirmed={handlePerformGalleryDownload}
      />

      {/* Sticky Mobile CTA button when on Home or Library */}
      {(activeTab === 'home' || activeTab === 'postcards' || activeTab === 'quotes') && (
        <div className="fixed bottom-4 right-4 z-30 sm:hidden">
          <button
            onClick={() => {
              setActiveTab('create');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#7b2c28] to-[#923530] text-[#fff8ee] font-serif font-bold text-xs border border-[#d4af37]/60 shadow-2xl shadow-red-950/80 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-[#ffd875]" />
            <span>✨ পোস্টকার্ড তৈরি</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
