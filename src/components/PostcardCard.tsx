import React from 'react';
import { PostcardTemplate } from '../types';
import { PostcardArtwork } from './PostcardArtwork';
import { Heart, Sparkles } from 'lucide-react';

interface PostcardCardProps {
  postcard: PostcardTemplate;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (postcard: PostcardTemplate) => void;
}

export const PostcardCard: React.FC<PostcardCardProps> = ({
  postcard,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <div className="group relative bg-[#181412] border border-[#d4af37]/25 hover:border-[#d4af37]/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col">
      {/* Thumbnail Area with Artwork */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#110e0c] cursor-pointer" onClick={() => onSelect(postcard)}>
        <PostcardArtwork type={postcard.image} effect="original" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181412] via-transparent to-black/30 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#14100d]/80 text-[#d4af37] border border-[#d4af37]/30 backdrop-blur-xs">
            {postcard.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(postcard.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-xs transition cursor-pointer ${
            isFavorite
              ? 'bg-[#7b2c28] text-white shadow-md'
              : 'bg-[#14100d]/70 text-[#cbbba0] hover:text-white hover:bg-[#7b2c28]/60'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-base font-serif font-bold text-[#f5ebd7] group-hover:text-[#ffd875] transition line-clamp-1">
              {postcard.titleBn || postcard.title}
            </h3>
            <span className="text-[10px] text-[#8e7e69] font-mono shrink-0">#{postcard.id}</span>
          </div>

          {/* Short Quote Preview */}
          <p className="text-xs text-[#b8a78e] font-bengali-serif leading-relaxed line-clamp-2 italic mb-4">
            “{postcard.defaultQuote}”
          </p>
        </div>

        {/* Action Button: ব্যবহার করুন */}
        <button
          type="button"
          onClick={() => onSelect(postcard)}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#251d18] hover:bg-[#7b2c28] text-[#f7eed9] hover:text-white text-xs sm:text-sm font-serif border border-[#d4af37]/35 hover:border-[#d4af37]/70 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ffd875]" />
          <span>ব্যবহার করুন</span>
        </button>
      </div>
    </div>
  );
};
