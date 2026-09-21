import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'minimal_postcard_bd_favorites';

interface FavoritesState {
  postcards: string[]; // IDs
  quotes: string[];
  gallery: string[];
}

const DEFAULT_STATE: FavoritesState = {
  postcards: ['vp001', 'vp003'], // pre-seed with a couple of lovely defaults
  quotes: ['q001', 'q006'],
  gallery: ['g001', 'g003'],
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Unable to persist favorites to localStorage', e);
    }
  }, [favorites]);

  const togglePostcardFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const exists = prev.postcards.includes(id);
      return {
        ...prev,
        postcards: exists ? prev.postcards.filter(p => p !== id) : [...prev.postcards, id],
      };
    });
  }, []);

  const toggleQuoteFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const exists = prev.quotes.includes(id);
      return {
        ...prev,
        quotes: exists ? prev.quotes.filter(q => q !== id) : [...prev.quotes, id],
      };
    });
  }, []);

  const toggleGalleryFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const exists = prev.gallery.includes(id);
      return {
        ...prev,
        gallery: exists ? prev.gallery.filter(g => g !== id) : [...prev.gallery, id],
      };
    });
  }, []);

  const isPostcardFavorite = useCallback((id: string) => favorites.postcards.includes(id), [favorites.postcards]);
  const isQuoteFavorite = useCallback((id: string) => favorites.quotes.includes(id), [favorites.quotes]);
  const isGalleryFavorite = useCallback((id: string) => favorites.gallery.includes(id), [favorites.gallery]);

  return {
    favorites,
    togglePostcardFavorite,
    toggleQuoteFavorite,
    toggleGalleryFavorite,
    isPostcardFavorite,
    isQuoteFavorite,
    isGalleryFavorite,
  };
}
