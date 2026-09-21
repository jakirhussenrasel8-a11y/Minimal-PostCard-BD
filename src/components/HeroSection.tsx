import React from 'react';
import { Sparkles, Image, ArrowRight } from 'lucide-react';
import { PostcardArtwork } from './PostcardArtwork';
import { PostcardStamp } from './PostcardStamp';

interface HeroSectionProps {
  onCreateClick: () => void;
  onGalleryClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCreateClick,
  onGalleryClick,
}) => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24 border-b border-[#d4af37]/20 bg-gradient-to-b from-[#130f0d] via-[#181310] to-[#120f0d]">
      {/* Subtle vintage decorative ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7b2c28]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Vintage Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#251a14] border border-[#d4af37]/35 shadow-inner">
              <span className="text-sm">💌</span>
              <span className="text-xs sm:text-sm font-serif text-[#d4af37] tracking-wider uppercase">
                Minimal PostCard BD
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#f7eed9] tracking-tight leading-[1.2]">
              পুরনো দিনের অনুভূতি, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd875] via-[#f7ebd7] to-[#d4af37]">
                আজকের ভালোবাসার জন্য।
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-[#c7b79d] font-bengali-sans max-w-xl mx-auto lg:mx-0 leading-relaxed">
              আপনার প্রিয় মানুষটির জন্য তৈরি করুন একটি সুন্দর Vintage Postcard। পুরনো দিনের ডাকটিকিট, হলুদ খাম ও হৃদয়ের রোমান্টিক কথামালায় সাজিয়ে নিন চিরন্তন স্মৃতি।
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onCreateClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#7b2c28] via-[#8c332d] to-[#7b2c28] hover:from-[#963731] hover:to-[#963731] text-[#fff8ee] text-base font-serif font-bold border border-[#d4af37]/60 shadow-xl shadow-red-950/40 transition-all cursor-pointer active:scale-95 group"
              >
                <Sparkles className="w-5 h-5 text-[#ffd875]" />
                <span>✨ পোস্টকার্ড তৈরি করুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onGalleryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#201813] hover:bg-[#2c211a] text-[#f7eed9] text-base font-serif border border-[#d4af37]/30 hover:border-[#d4af37]/60 shadow-md transition-all cursor-pointer"
              >
                <Image className="w-5 h-5 text-[#baa990]" />
                <span>🖼️ Vintage Gallery দেখুন</span>
              </button>
            </div>

            {/* Feature highlights */}
            <div className="pt-4 border-t border-[#d4af37]/15 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#a89880] font-bengali-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-[#d4af37]">✓</span> কোনো রেজিস্ট্রেশন নেই
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#d4af37]">✓</span> নিখুঁত HD ডাউনলোড
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#d4af37]">✓</span> সম্পূর্ণ বিনামূল্যে
              </div>
            </div>
          </div>

          {/* Right Realistic Vintage Postcard Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              {/* Subtle vintage shadow & tilt */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 to-[#7b2c28]/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />

              <div className="relative bg-[#1a1410] border border-[#d4af37]/50 rounded-xl p-5 sm:p-6 shadow-2xl overflow-hidden rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Vintage stamp in corner */}
                <div className="absolute top-4 right-4 z-20 scale-75 origin-top-right">
                  <PostcardStamp />
                </div>

                {/* Postcard Header */}
                <div className="text-[9px] font-mono tracking-widest text-[#d4af37]/80 uppercase mb-4">
                  BANGLADESH VINTAGE ARCHIVE • POST CARD
                </div>

                {/* Embedded Artwork Miniature */}
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#d4af37]/30 mb-5 bg-[#100c09]">
                  <PostcardArtwork type="rainy-love" effect="old-paper" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-[11px] font-serif text-[#f7eed9] italic">
                    “বৃষ্টিভেজা দুপুর ও স্মৃতির ভেলা”
                  </div>
                </div>

                {/* Handwritten Vintage Letter Content */}
                <div className="space-y-3 font-bengali-serif text-[#f4ead5] text-xs sm:text-sm leading-relaxed border-t border-[#d4af37]/20 pt-3">
                  <p className="text-[#d4af37] font-semibold text-xs">প্রিয়তমা,</p>
                  <p className="font-bengali-handwritten text-base text-[#fff7e8] leading-relaxed">
                    “তোমাকে মনে পড়ে বৃষ্টির প্রতিটি ফোঁটায়, জানালার কাঁচে জমে থাকা বাষ্পে আর পুরনো দিনের স্মৃতিতে।”
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-[#baa990] pt-1 font-mono">
                    <span>তারিখ: শ্রাবণ, ১৪৩১</span>
                    <span className="font-bengali-handwritten text-xs text-[#d4af37]">ইতি, তোমার...</span>
                  </div>
                </div>

                {/* Postcard Center Airmail Barcode Line */}
                <div className="mt-4 pt-2 border-t border-dashed border-[#d4af37]/20 flex justify-between items-center text-[8px] text-[#8e7e69] font-mono">
                  <span>AIR MAIL • DHAKA G.P.O</span>
                  <span>100% HD VINTAGE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
