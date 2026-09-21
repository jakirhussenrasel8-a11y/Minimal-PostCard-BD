import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Menu, X, Heart, Sparkles, Image, BookOpen, Layers, Home, Mail } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { tab: ActiveTab; labelBn: string; icon: React.ReactNode }[] = [
    { tab: 'home', labelBn: 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'postcards', labelBn: 'Postcards', icon: <Mail className="w-4 h-4" /> },
    { tab: 'quotes', labelBn: 'Quotes', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'gallery', labelBn: 'Vintage Gallery', icon: <Image className="w-4 h-4" /> },
    { tab: 'categories', labelBn: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { tab: 'favorites', labelBn: 'Favorites', icon: <Heart className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120f0d]/95 backdrop-blur-md border-b border-[#d4af37]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="Minimal PostCard BD Home"
          >
            <div className="w-10 h-10 rounded-lg bg-[#251b16] border border-[#d4af37]/40 flex items-center justify-center text-xl shadow-md group-hover:border-[#d4af37] transition">
              💌
            </div>
            <div>
              <span className="text-base sm:text-lg font-serif font-bold text-[#f7eed9] tracking-tight block">
                Minimal PostCard BD
              </span>
              <span className="text-[10px] text-[#c0a875] font-bengali-sans hidden sm:block">
                পুরনো দিনের অনুভূতি, আজকের ভালোবাসার জন্য
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ tab, labelBn }) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleNavClick(tab)}
                  className={`relative px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#f5ebd7] bg-[#231b16] border border-[#d4af37]/40 shadow-sm'
                      : 'text-[#c6b69b] hover:text-[#f8f0e0] hover:bg-[#1a1512]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {tab === 'favorites' && favoritesCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-[#c0392b] text-[#c0392b]" />
                        {labelBn}
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#7b2c28] text-white">
                          {favoritesCount}
                        </span>
                      </span>
                    ) : (
                      labelBn
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Primary CTA (Create Postcard) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#7b2c28] to-[#923530] hover:from-[#923530] hover:to-[#a73e38] text-[#fff8ee] text-sm font-serif font-semibold border border-[#d4af37]/50 shadow-md hover:shadow-red-950/40 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#ffd875]" />
              <span>✨ Postcard তৈরি করুন</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('create')}
              className="px-2.5 py-1.5 rounded-md bg-[#7b2c28] text-xs font-serif text-[#fff8ee] border border-[#d4af37]/40 sm:hidden"
            >
              ✨ তৈরি করুন
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#d4af37] hover:bg-[#201914] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#15110e] border-b border-[#d4af37]/30 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map(({ tab, labelBn, icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleNavClick(tab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#281e18] text-[#f7eed9] border border-[#d4af37]/40'
                    : 'text-[#c4b397] hover:bg-[#1f1713]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span>{labelBn}</span>
                </div>
                {tab === 'favorites' && favoritesCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#7b2c28] text-white">
                    {favoritesCount}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('create')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#7b2c28] to-[#923530] text-[#fff8ee] font-serif font-semibold border border-[#d4af37]/50 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#ffd875]" />
              <span>✨ Postcard তৈরি করুন</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
