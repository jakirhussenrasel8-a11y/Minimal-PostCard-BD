export type AspectRatioType = 'postcard' | 'square' | 'story' | 'facebook' | 'status';

export interface AspectRatioOption {
  id: AspectRatioType;
  name: string;
  nameBn: string;
  ratio: string;
  width: number;
  height: number;
}

export type VintageEffect =
  | 'original'
  | 'sepia'
  | 'old-paper'
  | 'faded'
  | 'bw'
  | 'film-grain'
  | 'dust'
  | 'scratch'
  | 'coffee-stain'
  | 'warm-vintage';

export type FontFamilyType =
  | 'BengaliElegant'
  | 'Handwritten'
  | 'VintageSerif'
  | 'Typewriter'
  | 'Classic'
  | 'Calligraphy'
  | 'OldNewspaper';

export type TextPositionType = 'top' | 'center' | 'bottom' | 'split';
export type TextAlignmentType = 'left' | 'center' | 'right';
export type BorderStyleType = 'classic' | 'ornate' | 'double' | 'stamp' | 'minimal' | 'postcard-split';

export interface PostcardStyle {
  fontFamily: FontFamilyType;
  fontSize: number; // in pt/px
  textColor: string;
  position: TextPositionType;
  alignment: TextAlignmentType;
  border: BorderStyleType;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number; // em
  lineHeight?: number;
}

export interface PostcardTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  image: string; // SVG or path
  defaultQuote: string;
  defaultRecipient?: string;
  defaultSender?: string;
  defaultDate?: string;
  tags: string[];
  featuredSection?: 'popular' | 'new' | 'romantic' | 'rainy' | 'letter';
  themeColor: string;
  bgPattern?: string;
  stampType?: string;
  style: PostcardStyle;
}

export interface RomanticQuote {
  id: string;
  text: string;
  author?: string;
  category: string;
  categoryBn: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  quote: string;
  quoteEn?: string;
  image: string;
  category: string;
  dateAdded: string;
  themeColor: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameBn: string;
  emoji: string;
  description: string;
  iconName?: string;
}

export interface GeneratorState {
  selectedPostcard: PostcardTemplate;
  selectedQuoteText: string;
  recipient: string;
  sender: string;
  date: string;
  fontFamily: FontFamilyType;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: TextAlignmentType;
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  textPosition: TextPositionType;
  effect: VintageEffect;
  borderStyle: BorderStyleType;
  exportFormat: 'png' | 'jpg';
  exportSize: AspectRatioType;
}

export type ActiveTab = 'home' | 'postcards' | 'create' | 'quotes' | 'gallery' | 'categories' | 'favorites' | 'privacy' | 'terms' | 'contact';
