import React from 'react';
import { ActiveTab } from '../types';
import { SITE_CONFIG } from '../config/site';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0c0908] border-t border-[#d4af37]/20 text-[#cbbba0] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="text-xl">💌</span>
              <span className="text-lg font-serif font-bold text-[#f7eed9] tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-[#a89880] font-bengali-sans max-w-sm">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium">
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('postcards');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Postcards
            </button>
            <button
              onClick={() => {
                onNavigate('quotes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Quotes
            </button>
            <button
              onClick={() => {
                onNavigate('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Gallery
            </button>
            <button
              onClick={() => {
                onNavigate('privacy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                onNavigate('terms');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#baa990] hover:text-[#ffd875] transition cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-8 border-t border-[#d4af37]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#827460] font-mono">
          <p>© {SITE_CONFIG.copyrightYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with vintage love</span>
            <span>•</span>
            <span className="text-[#d4af37]">বাংলা সংস্করণ</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
