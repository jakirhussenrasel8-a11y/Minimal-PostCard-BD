import { useState, useEffect, useCallback } from 'react';

const HISTORY_STORAGE_KEY = 'minimal_postcard_bd_user_history';

export interface UserActivityHistory {
  searches: string[];
  categories: string[];
  viewedPostcardIds: string[];
  viewedQuoteIds: string[];
  lastTab?: string;
}

const DEFAULT_HISTORY: UserActivityHistory = {
  searches: [],
  categories: ['বৃষ্টি', 'প্রেমপত্র'],
  viewedPostcardIds: [],
  viewedQuoteIds: [],
  lastTab: 'home',
};

export function useUserActivityHistory() {
  const [history, setHistory] = useState<UserActivityHistory>(() => {
    if (typeof window === 'undefined') return DEFAULT_HISTORY;
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read user activity history', e);
    }
    return DEFAULT_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Could not persist user activity history', e);
    }
  }, [history]);

  // Record a search term
  const recordSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (clean.length < 2) return;

    setHistory(prev => {
      const filtered = prev.searches.filter(s => s.toLowerCase() !== clean.toLowerCase());
      return {
        ...prev,
        searches: [clean, ...filtered].slice(0, 10), // keep last 10 unique searches
      };
    });
  }, []);

  // Record a visited or selected category
  const recordCategory = useCallback((category: string) => {
    if (!category || category === 'all') return;

    setHistory(prev => {
      const filtered = prev.categories.filter(c => c.toLowerCase() !== category.toLowerCase());
      return {
        ...prev,
        categories: [category, ...filtered].slice(0, 8), // keep last 8 visited categories
      };
    });
  }, []);

  // Record a viewed or selected postcard
  const recordPostcardView = useCallback((postcardId: string, category?: string) => {
    setHistory(prev => {
      const filtered = prev.viewedPostcardIds.filter(id => id !== postcardId);
      const newCategories = category && category !== 'all'
        ? [category, ...prev.categories.filter(c => c !== category)].slice(0, 8)
        : prev.categories;

      return {
        ...prev,
        viewedPostcardIds: [postcardId, ...filtered].slice(0, 12),
        categories: newCategories,
      };
    });
  }, []);

  // Record a viewed or selected quote
  const recordQuoteView = useCallback((quoteId: string, category?: string) => {
    setHistory(prev => {
      const filtered = prev.viewedQuoteIds.filter(id => id !== quoteId);
      const newCategories = category && category !== 'all'
        ? [category, ...prev.categories.filter(c => c !== category)].slice(0, 8)
        : prev.categories;

      return {
        ...prev,
        viewedQuoteIds: [quoteId, ...filtered].slice(0, 12),
        categories: newCategories,
      };
    });
  }, []);

  // Record active tab navigation
  const recordTabNavigation = useCallback((tab: string) => {
    setHistory(prev => ({
      ...prev,
      lastTab: tab,
    }));
  }, []);

  return {
    history,
    recordSearch,
    recordCategory,
    recordPostcardView,
    recordQuoteView,
    recordTabNavigation,
  };
}
