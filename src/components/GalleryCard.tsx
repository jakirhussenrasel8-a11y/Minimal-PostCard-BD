import React from 'react';
import { GalleryItem } from '../types';
import { Heart, Download, Eye } from 'lucide-react';

interface GalleryCardProps {
  item: GalleryItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onView: (item: GalleryItem) => void;
  onDownload: (item: GalleryItem) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onView,
  onDownload,
}) => {
  return (
    <div className="group relative bg-[#171310] border border-[#d4af37]/25 hover:border-[#d4af37]/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-black/80 flex flex-col">
      {/* Artwork Representation */}
      <div
        className="relative aspect-[4/5] w-full p-6 flex flex-col justify-between cursor-pointer overflow-hidden"
        style={{ backgroundColor: item.themeColor }}
        onClick={() => onView(item)}
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-3 border border-[#d4af37]/35 pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af37]">
            VINTAGE ARCHIVE
          </span>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-xs transition ${
              isFavorite ? 'bg-[#7b2c28] text-white' : 'bg-black/40 text-[#cbbba0] hover:text-white'
            }`}
            aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center Quote Artwork */}
        <div className="relative z-10 text-center my-auto px-2">
          <p className="text-lg sm:text-xl font-serif text-[#fdf5e6] leading-relaxed italic drop-shadow-md">
            “{item.quote}”
          </p>
          {item.quoteEn && (
            <p className="text-xs font-mono text-[#d4af37]/90 mt-3 tracking-wide uppercase">
              — {item.quoteEn}
            </p>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-[#e0cfb8] border-t border-[#d4af37]/20 pt-2 font-mono">
          <span>{item.category}</span>
          <span>BD-VINTAGE</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 bg-[#14100e] border-t border-[#d4af37]/15 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onView(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif text-[#cbbba0] hover:text-[#fff] hover:bg-[#221a15] transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>দেখুন</span>
        </button>
        <button
          type="button"
          onClick={() => onDownload(item)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#241c17] hover:bg-[#7b2c28] text-[#f7eed9] hover:text-white text-xs font-serif border border-[#d4af37]/35 hover:border-[#d4af37]/70 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#ffd875]" />
          <span>HD ডাউনলোড</span>
        </button>
      </div>
    </div>
  );
};
