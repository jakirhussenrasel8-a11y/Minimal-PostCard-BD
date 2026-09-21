import React, { useState } from 'react';
import { RomanticQuote } from '../types';
import { Heart, Sparkles, Copy, Check } from 'lucide-react';

interface QuoteCardProps {
  quote: RomanticQuote;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onUseQuote: (quote: RomanticQuote) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isFavorite,
  onToggleFavorite,
  onUseQuote,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(quote.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#171310] border border-[#d4af37]/25 hover:border-[#d4af37]/60 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between">
      {/* Top Bar: Category & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#221a14] text-[#d4af37] border border-[#d4af37]/30">
          {quote.categoryBn || quote.category}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[#8e7e69] hover:text-[#f7eed9] hover:bg-[#251f1a] transition"
            title="উক্তিটি কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(quote.id)}
            className={`p-1.5 rounded-lg transition ${
              isFavorite ? 'text-[#c0392b]' : 'text-[#8e7e69] hover:text-[#c0392b] hover:bg-[#251f1a]'
            }`}
            title={isFavorite ? 'পছন্দ থেকে মুছুন' : 'পছন্দে যোগ করুন'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quote Text in Bengali Serif */}
      <div className="my-2">
        <p className="text-base sm:text-lg font-bengali-serif text-[#f5ebd7] leading-relaxed italic">
          “{quote.text}”
        </p>
      </div>

      {/* Tags & Action Button */}
      <div className="mt-4 pt-3 border-t border-[#d4af37]/15 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {quote.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-mono text-[#8e7e69]">
              #{tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onUseQuote(quote)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251d18] hover:bg-[#7b2c28] text-[#f7eed9] hover:text-white text-xs font-serif border border-[#d4af37]/30 hover:border-[#d4af37]/70 transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-[#ffd875]" />
          <span>ব্যবহার করুন</span>
        </button>
      </div>
    </div>
  );
};
