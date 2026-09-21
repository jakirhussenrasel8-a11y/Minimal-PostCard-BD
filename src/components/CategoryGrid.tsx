import React from 'react';
import { MAIN_CATEGORIES } from '../data/categories';
import { CategoryItem } from '../types';

interface CategoryGridProps {
  onSelectCategory: (cat: CategoryItem) => void;
  selectedCategoryId?: string;
  className?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  selectedCategoryId,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {MAIN_CATEGORIES.map(category => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`p-3 sm:p-3.5 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-[#331c19] border-[#d4af37] shadow-lg shadow-black/50 text-[#fff8ee]'
                  : 'bg-[#181310] border-[#d4af37]/20 hover:border-[#d4af37]/50 text-[#d8c9b3] hover:text-[#fff] hover:bg-[#201914]'
              }`}
            >
              <span className="text-xl sm:text-2xl" role="img" aria-label={category.nameBn}>
                {category.emoji}
              </span>
              <span className="text-xs sm:text-sm font-bengali-sans font-medium line-clamp-1">
                {category.nameBn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
