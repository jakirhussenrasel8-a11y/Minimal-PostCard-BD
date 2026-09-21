import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'উক্তি বা পোস্টকার্ড খুঁজুন...',
  onClear,
  className = '',
}) => {
  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#d4af37]/70 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#171310] border border-[#d4af37]/35 rounded-xl text-sm sm:text-base text-[#f7eed9] placeholder-[#8e7e69] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            className="absolute right-3 p-1 rounded-full text-[#8e7e69] hover:text-[#f7eed9] hover:bg-[#251f1a]"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
