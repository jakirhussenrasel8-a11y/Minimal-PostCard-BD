import { PostcardTemplate, RomanticQuote } from '../types';
import { ROMANTIC_QUOTES } from '../data/quotes';

export interface SmartShuffleContext {
  currentPostcard: PostcardTemplate;
  currentQuoteText?: string;
  currentSearchQuery?: string;
  searchHistory?: string[];
  navigationHistory?: string[];
  favoriteQuoteIds?: string[];
  favoritePostcardIds?: string[];
}

export interface SmartShuffleResult {
  quote: RomanticQuote;
  reasons: string[];
  matchScore: number;
  matchPercentage: number;
  badgeLabel: string;
}

// Category synonym and theme correlation mapping
const THEMATIC_MAPPINGS: Record<string, { quoteCats: string[]; keywords: string[]; tags: string[] }> = {
  // Rain / বৃষ্টি
  বৃষ্টি: {
    quoteCats: ['rain', 'romantic', 'missing'],
    keywords: ['বৃষ্টি', 'বাদল', 'কদম', 'ছাতা', 'মেঘ', 'শ্রাবণ', 'বর্ষা', 'বৃষ্টিভেজা', 'rain'],
    tags: ['Rain', 'Umbrella', 'Flowers', 'Romantic Couple'],
  },
  // Love Letter / প্রেমপত্র
  প্রেমপত্র: {
    quoteCats: ['love-letter', 'love', 'missing', 'romantic'],
    keywords: ['চিঠি', 'খাম', 'প্রেমপত্র', 'ডাকপিয়ন', 'কলম', 'লেখা', 'শব্দ', 'হলুদ', 'letter', 'envelope'],
    tags: ['Old Love Letter', 'Envelope', 'Old Paper', 'Newspaper'],
  },
  // Love / ভালোবাসা
  ভালোবাসা: {
    quoteCats: ['love', 'romantic', 'proposal', 'anniversary'],
    keywords: ['ভালোবাসা', 'প্রেম', 'প্রিয়', 'হৃদয়', 'মন', 'চিরন্তন', 'আবেগ', 'love'],
    tags: ['Romantic Couple', 'Coffee', 'Rose', 'Flowers', 'Valentine'],
  },
  // Heartbreak / বিরহ
  বিরহ: {
    quoteCats: ['heartbreak', 'missing', 'unrequited', 'memories'],
    keywords: ['বিরহ', 'কষ্ট', 'একাকী', 'দূরত্ব', 'বিদায়', 'স্মৃতি', 'কান্না', 'নিঃসঙ্গতা', 'sad'],
    tags: ['Sad Love', 'Sunset', 'River', 'Long Distance', 'Memories'],
  },
  // Memories / স্মৃতি
  স্মৃতি: {
    quoteCats: ['memories', 'classic-vintage', 'missing', 'bengali-vintage'],
    keywords: ['স্মৃতি', 'পুরনো', 'অতীত', 'দিনগুলো', 'অ্যালবাম', 'কাগজ', 'নস্টালজিক', 'memories'],
    tags: ['Old Paper', 'Memories', 'Vintage Paper', 'Bengali Vintage'],
  },
  // Gramya / গ্রাম্য স্মৃতি
  'গ্রাম্য স্মৃতি': {
    quoteCats: ['bengali-vintage', 'memories', 'love'],
    keywords: ['গ্রাম', 'মেঠোপথ', 'নদী', 'বাংলা', 'সবুজ', 'নৌকা', 'দিগন্ত', 'পদ্মা'],
    tags: ['River', 'Sunset', 'Lake', 'Nature', 'Bengali Vintage'],
  },
  // Nostalgia / নস্টালজিয়া
  নস্টালজিয়া: {
    quoteCats: ['classic-vintage', 'memories', 'love'],
    keywords: ['গ্রামোফোন', 'রেডিও', 'গান', 'সুর', 'ভিন্টেজ', 'পুরনো', 'সিনেমা', 'vintage'],
    tags: ['Cinema', 'Film Photography', 'Vintage House', 'Old Paper'],
  },
  // Poetry / কবিতা
  কবিতা: {
    quoteCats: ['love', 'romantic', 'bengali-vintage', 'memories'],
    keywords: ['কবিতা', 'ছন্দ', 'অনুপ্রেরণা', 'কবি', 'বই', 'শব্দ', 'পাতা'],
    tags: ['Poetry', 'Bengali Vintage', 'Newspaper', 'Old Paper'],
  },
  // Night / রাতের আলো
  'রাতের আলো': {
    quoteCats: ['night', 'romantic', 'missing', 'unrequited'],
    keywords: ['রাত', 'চাঁদ', 'চাঁদের আলো', 'জ্যোৎস্না', 'নিঝুম', 'তারা', 'অন্ধকার', 'night', 'moon'],
    tags: ['Moonlight', 'Night', 'Lantern'],
  },
  // First Love / প্রথম দেখা
  'প্রথম দেখা': {
    quoteCats: ['romantic', 'proposal', 'love'],
    keywords: ['প্রথম', 'দেখা', 'গোলাপ', 'লাজুক', 'হাসি', 'শুরু', 'চোখ'],
    tags: ['Rose', 'Flowers', 'Romantic Couple', 'First Love'],
  },
  // Tea / চা ও আড্ডা
  'চা ও আড্ডা': {
    quoteCats: ['romantic', 'love', 'classic-vintage'],
    keywords: ['চা', 'কফি', 'আড্ডা', 'বিকেল', 'টং', 'কাপ', 'coffee', 'tea'],
    tags: ['Coffee', 'Old Café', 'Romantic Couple'],
  },
  // Postman / ডাকপিয়ন
  ডাকপিয়ন: {
    quoteCats: ['love-letter', 'missing', 'love'],
    keywords: ['ডাকপিয়ন', 'চিঠি', 'ঠিকানা', 'ডাকঘর', 'সাইকেল', 'নীল খাম'],
    tags: ['Envelope', 'Old Love Letter', 'Railway Station'],
  },
};

/**
 * Calculates a thematic relevance score for a given quote based on:
 * 1. Selected Postcard category & tags
 * 2. User's active & recent search queries
 * 3. User's visited categories & navigation history
 * 4. User's favorites / preferences
 */
export function scoreQuoteRelevance(quote: RomanticQuote, context: SmartShuffleContext): {
  score: number;
  reasons: string[];
} {
  let score = 10; // Baseline score
  const reasons: string[] = [];

  const {
    currentPostcard,
    currentSearchQuery = '',
    searchHistory = [],
    navigationHistory = [],
    favoriteQuoteIds = [],
  } = context;

  const postcardCategory = currentPostcard.category || '';
  const theme = THEMATIC_MAPPINGS[postcardCategory] || {
    quoteCats: ['love', 'romantic'],
    keywords: [postcardCategory.toLowerCase()],
    tags: currentPostcard.tags || [],
  };

  // -------------------------------------------------------------
  // 1. Postcard Category Match (+35 - 50 points)
  // -------------------------------------------------------------
  if (quote.categoryBn === postcardCategory) {
    score += 50;
    reasons.push(`ক্যাটাগরি মিল: "${postcardCategory}"`);
  } else if (theme.quoteCats.includes(quote.category)) {
    score += 35;
    reasons.push(`থিম সাদৃশ্য: ${postcardCategory} ও ${quote.categoryBn}`);
  }

  // -------------------------------------------------------------
  // 2. Postcard Tags Match (+15 points per matching tag)
  // -------------------------------------------------------------
  if (quote.tags && currentPostcard.tags) {
    const commonTags = quote.tags.filter(tag =>
      currentPostcard.tags.some(pt => pt.toLowerCase() === tag.toLowerCase())
    );
    if (commonTags.length > 0) {
      const bonus = Math.min(commonTags.length * 15, 30);
      score += bonus;
      reasons.push(`ট্যাগ মিল: ${commonTags.slice(0, 2).join(', ')}`);
    }
  }

  // Thematic keywords from postcard title / theme
  const quoteTextLower = quote.text.toLowerCase();
  for (const keyword of theme.keywords) {
    if (quoteTextLower.includes(keyword.toLowerCase())) {
      score += 15;
      reasons.push(`কীওয়ার্ড: "${keyword}"`);
      break;
    }
  }

  // -------------------------------------------------------------
  // 3. User Active Search Query (+40 points)
  // -------------------------------------------------------------
  const cleanActiveQuery = currentSearchQuery.trim().toLowerCase();
  if (cleanActiveQuery.length > 1) {
    if (
      quoteTextLower.includes(cleanActiveQuery) ||
      quote.categoryBn.toLowerCase().includes(cleanActiveQuery) ||
      quote.tags.some(t => t.toLowerCase().includes(cleanActiveQuery))
    ) {
      score += 45;
      reasons.push(`অনুসন্ধান সাদৃশ্য: "${cleanActiveQuery}"`);
    }
  }

  // -------------------------------------------------------------
  // 4. User Search History (+20 points for recent search terms)
  // -------------------------------------------------------------
  if (searchHistory.length > 0) {
    for (const pastTerm of searchHistory.slice(0, 5)) {
      const termClean = pastTerm.trim().toLowerCase();
      if (termClean.length > 1 && termClean !== cleanActiveQuery) {
        if (
          quoteTextLower.includes(termClean) ||
          quote.categoryBn.toLowerCase().includes(termClean) ||
          quote.tags.some(t => t.toLowerCase().includes(termClean))
        ) {
          score += 20;
          reasons.push(`পূর্ববর্তী খোঁজ: "${termClean}"`);
          break;
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 5. Navigation / Visited Categories History (+20 points)
  // -------------------------------------------------------------
  if (navigationHistory.length > 0) {
    for (const visitedCat of navigationHistory.slice(0, 5)) {
      if (
        visitedCat.toLowerCase() === quote.categoryBn.toLowerCase() ||
        visitedCat.toLowerCase() === quote.category.toLowerCase()
      ) {
        score += 20;
        reasons.push(`ব্রাউজ হিস্ট্রি: "${quote.categoryBn}"`);
        break;
      }
    }
  }

  // -------------------------------------------------------------
  // 6. User Favorites Affinity (+15 points)
  // -------------------------------------------------------------
  if (favoriteQuoteIds.includes(quote.id)) {
    score += 25;
    reasons.push('প্রিয় তালিকায় সংরক্ষিত');
  }

  return { score, reasons };
}

/**
 * Executes Smart Shuffle to pick an optimal, contextually relevant quote.
 * Employs weighted probabilistic sampling among the top-tier candidates
 * to avoid repetitive selection while guaranteeing high contextual relevance.
 */
export function getSmartShuffleSuggestion(context: SmartShuffleContext): SmartShuffleResult {
  const currentText = context.currentQuoteText ? context.currentQuoteText.trim() : '';

  // Calculate scores for all quotes
  const scored = ROMANTIC_QUOTES.map(quote => {
    const { score, reasons } = scoreQuoteRelevance(quote, context);
    // Deprioritize currently selected quote to ensure shuffle switches to a new one
    const adjustedScore = quote.text.trim() === currentText ? 1 : score;
    return {
      quote,
      score: adjustedScore,
      reasons,
    };
  });

  // Sort descending by relevance score
  scored.sort((a, b) => b.score - a.score);

  // Take top 5 candidates for dynamic weighted selection
  const topCandidates = scored.slice(0, 5);

  // If no candidates found (edge case), fallback to random quote
  if (topCandidates.length === 0) {
    const fallback = ROMANTIC_QUOTES[0];
    return {
      quote: fallback,
      reasons: ['ভিন্টেজ সংগ্রহ'],
      matchScore: 50,
      matchPercentage: 70,
      badgeLabel: 'সাজেস্টেড',
    };
  }

  // Weighted random pick from top candidates
  // Higher scores have proportionately higher odds
  const totalWeight = topCandidates.reduce((sum, item) => sum + Math.max(item.score, 5), 0);
  let randomVal = Math.random() * totalWeight;
  let selected = topCandidates[0];

  for (const item of topCandidates) {
    const weight = Math.max(item.score, 5);
    if (randomVal <= weight) {
      selected = item;
      break;
    }
    randomVal -= weight;
  }

  // Calculate match percentage for clean UI feedback (clamped 75% - 99%)
  const maxPossible = 160;
  const matchPercentage = Math.min(99, Math.max(75, Math.round((selected.score / maxPossible) * 100)));

  // Generate short badge label
  let badgeLabel = 'স্মার্ট ম্যাচ';
  if (selected.reasons.length > 0) {
    const primary = selected.reasons[0];
    if (primary.includes('ক্যাটাগরি') || primary.includes('থিম')) {
      badgeLabel = `${context.currentPostcard.category} থিম`;
    } else if (primary.includes('অনুসন্ধান') || primary.includes('খোঁজ')) {
      badgeLabel = 'অনুসন্ধান মিল';
    }
  }

  return {
    quote: selected.quote,
    reasons: selected.reasons.length > 0 ? selected.reasons : ['পোস্টকার্ড থিম ও আর্টওয়ার্ক মিল'],
    matchScore: selected.score,
    matchPercentage,
    badgeLabel,
  };
}

/**
 * Returns top N relevant quotes for the current context (used to display "Smart Recommended" pills).
 */
export function getTopRelevantQuotes(context: SmartShuffleContext, limit: number = 4): {
  quote: RomanticQuote;
  relevancePercent: number;
  reason: string;
}[] {
  const scored = ROMANTIC_QUOTES.map(quote => {
    const { score, reasons } = scoreQuoteRelevance(quote, context);
    const maxPossible = 160;
    const relevancePercent = Math.min(99, Math.max(70, Math.round((score / maxPossible) * 100)));
    return {
      quote,
      relevancePercent,
      reason: reasons[0] || 'পোস্টকার্ড থিম মিল',
      rawScore: score,
    };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);
  return scored.slice(0, limit);
}
