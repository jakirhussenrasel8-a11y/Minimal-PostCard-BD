import React from 'react';
import { VintageEffect } from '../types';
import {
  RickshawRainIllustration,
  BlossomIllustration,
  PostboxIllustration,
  MusicInstrumentIllustration,
  LiteratureIllustration,
  SceneryIllustration
} from './VintageIllustrations';

interface PostcardArtworkProps {
  type: string;
  effect: VintageEffect;
  className?: string;
}

export const PostcardArtwork: React.FC<PostcardArtworkProps> = ({
  type,
  effect,
  className = '',
}) => {
  // CSS filter classes matching vintage effects
  const getFilterStyle = (): React.CSSProperties => {
    switch (effect) {
      case 'sepia':
        return { filter: 'sepia(0.7) contrast(1.05) brightness(0.95)' };
      case 'old-paper':
        return { filter: 'sepia(0.4) saturate(0.85) contrast(1.1) brightness(0.96)' };
      case 'faded':
        return { filter: 'contrast(0.8) brightness(1.12) saturate(0.65)' };
      case 'bw':
        return { filter: 'grayscale(1) contrast(1.2) brightness(0.95)' };
      case 'warm-vintage':
        return { filter: 'sepia(0.35) saturate(1.3) hue-rotate(-10deg) brightness(1.02)' };
      default:
        return {};
    }
  };

  // Render authentic SVG artwork based on template type
  const renderIllustration = () => {
    switch (type) {
      case 'rainy-love':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a252f" />
                <stop offset="60%" stopColor="#2c3e50" />
                <stop offset="100%" stopColor="#151b22" />
              </linearGradient>
              <radialGradient id="lanternGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#f39c12" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#e67e22" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1a252f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="400" fill="url(#rainGrad)" />
            {/* Street lamp glow */}
            <circle cx="150" cy="120" r="100" fill="url(#lanternGlow)" />
            {/* Victorian Street Lamp */}
            <path d="M150,80 L160,110 L140,110 Z" fill="#d4af37" opacity="0.9" />
            <line x1="150" y1="110" x2="150" y2="350" stroke="#222" strokeWidth="6" />
            <circle cx="150" cy="98" r="8" fill="#fffbe8" />
            {/* Couple with Umbrella Silhouette */}
            <g transform="translate(320, 160)">
              {/* Umbrella */}
              <path d="M0,70 Q70,0 140,70 Q70,60 0,70 Z" fill="#1b120c" stroke="#d4af37" strokeWidth="1.5" />
              <line x1="70" y1="65" x2="70" y2="170" stroke="#111" strokeWidth="3" />
              {/* Couple silhouette */}
              <ellipse cx="50" cy="90" rx="10" ry="14" fill="#0c0a09" />
              <ellipse cx="78" cy="94" rx="9" ry="13" fill="#0c0a09" />
              <path d="M36,104 Q50,110 65,106 L68,175 L32,175 Z" fill="#0e0c0a" />
              <path d="M68,106 Q82,112 95,107 L98,175 L62,175 Z" fill="#120e0b" />
            </g>
            {/* Rain streaks */}
            <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2" strokeLinecap="round">
              <line x1="50" y1="20" x2="40" y2="60" />
              <line x1="120" y1="80" x2="105" y2="135" />
              <line x1="220" y1="40" x2="205" y2="95" />
              <line x1="280" y1="120" x2="265" y2="170" />
              <line x1="390" y1="30" x2="375" y2="85" />
              <line x1="470" y1="90" x2="455" y2="150" />
              <line x1="540" y1="40" x2="525" y2="105" />
              <line x1="80" y1="180" x2="65" y2="240" />
              <line x1="180" y1="200" x2="165" y2="265" />
              <line x1="490" y1="220" x2="475" y2="280" />
            </g>
            {/* Wet road reflections */}
            <ellipse cx="370" cy="350" rx="180" ry="25" fill="#f39c12" fillOpacity="0.08" />
          </svg>
        );

      case 'old-love-letter':
      case 'wax-sealed-envelope':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="parchmentGrad" cx="0.5" cy="0.4" r="0.7">
                <stop offset="0%" stopColor="#3d2c1d" />
                <stop offset="70%" stopColor="#291c13" />
                <stop offset="100%" stopColor="#18100a" />
              </radialGradient>
              <linearGradient id="envelopeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b6b45" />
                <stop offset="100%" stopColor="#543c22" />
              </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#parchmentGrad)" />
            {/* Vintage Post envelope */}
            <g transform="translate(180, 80)">
              <rect x="0" y="40" width="240" height="160" rx="4" fill="url(#envelopeGrad)" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.6" />
              {/* Envelope flap lines */}
              <polyline points="0,40 120,130 240,40" fill="none" stroke="#3a2717" strokeWidth="2.5" />
              <polyline points="0,200 90,120" fill="none" stroke="#3a2717" strokeWidth="1.5" opacity="0.6" />
              <polyline points="240,200 150,120" fill="none" stroke="#3a2717" strokeWidth="1.5" opacity="0.6" />
              {/* Wax Seal */}
              <circle cx="120" cy="130" r="26" fill="#8b1c1c" stroke="#d4af37" strokeWidth="2" />
              <path d="M112,126 Q120,118 128,126 Q128,136 120,140 Q112,136 112,126 Z" fill="#d4af37" />
            </g>
            {/* Vintage airmail diagonal stripes at top-left and bottom-right */}
            <g opacity="0.35">
              <line x1="20" y1="20" x2="40" y2="0" stroke="#b22222" strokeWidth="6" />
              <line x1="40" y1="20" x2="60" y2="0" stroke="#1e3f66" strokeWidth="6" />
              <line x1="60" y1="20" x2="80" y2="0" stroke="#b22222" strokeWidth="6" />
            </g>
          </svg>
        );

      case 'nostalgic-rose':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="roseBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#301318" />
                <stop offset="50%" stopColor="#1e0c10" />
                <stop offset="100%" stopColor="#0f0507" />
              </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#roseBg)" />
            {/* Antique Rose Outline & Petals */}
            <g transform="translate(420, 130) scale(1.1)" opacity="0.7">
              <path d="M0,50 Q-20,0 20,-20 Q60,10 40,50 Z" fill="#7a1c29" stroke="#d4af37" strokeWidth="1" opacity="0.8" />
              <path d="M10,40 Q-5,15 25,5 Q45,20 30,45 Z" fill="#9e2839" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M15,30 Q10,18 25,14 Q35,22 25,32 Z" fill="#58101a" />
              {/* Stem & Leaves */}
              <path d="M20,50 Q30,110 5,170" fill="none" stroke="#2d4223" strokeWidth="3" />
              <path d="M25,85 Q60,75 50,105 Q30,100 25,85 Z" fill="#203318" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M18,125 Q-20,115 -10,140 Q10,135 18,125 Z" fill="#203318" stroke="#d4af37" strokeWidth="0.8" />
            </g>
            {/* Victorian filigree swirl top left */}
            <path d="M30,30 Q70,30 80,70 Q80,100 50,90 Q40,75 60,65" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.5" />
          </svg>
        );

      case 'midnight-moonlight':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a111a" />
                <stop offset="50%" stopColor="#142131" />
                <stop offset="100%" stopColor="#080c12" />
              </linearGradient>
              <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#f7d794" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#142131" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="400" fill="url(#nightSky)" />
            {/* Full Moon & Aura */}
            <circle cx="480" cy="110" r="70" fill="url(#moonGlow)" />
            <circle cx="480" cy="110" r="32" fill="#fffdf2" />
            <circle cx="472" cy="104" r="6" fill="#e8dfc5" opacity="0.4" />
            <circle cx="492" cy="116" r="8" fill="#e8dfc5" opacity="0.4" />
            {/* Distant Trees Silhouette */}
            <path d="M0,320 Q60,300 120,320 T240,315 T360,325 T480,310 T600,320 L600,400 L0,400 Z" fill="#06090d" />
            {/* Water reflections */}
            <g stroke="#f7d794" strokeOpacity="0.25" strokeWidth="1.5">
              <line x1="440" y1="345" x2="520" y2="345" />
              <line x1="455" y1="360" x2="505" y2="360" />
              <line x1="465" y1="375" x2="495" y2="375" />
            </g>
          </svg>
        );

      case 'railway-station':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sepiaStation" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2c221a" />
                <stop offset="100%" stopColor="#140f0c" />
              </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#sepiaStation)" />
            {/* Perspective Tracks */}
            <polygon points="300,160 305,160 520,400 80,400" fill="#1b1511" opacity="0.8" />
            <line x1="300" y1="160" x2="100" y2="400" stroke="#d4af37" strokeWidth="2.5" opacity="0.5" />
            <line x1="305" y1="160" x2="500" y2="400" stroke="#d4af37" strokeWidth="2.5" opacity="0.5" />
            {/* Track ties */}
            <line x1="280" y1="200" x2="325" y2="200" stroke="#3f3126" strokeWidth="3" />
            <line x1="250" y1="240" x2="355" y2="240" stroke="#3f3126" strokeWidth="4" />
            <line x1="210" y1="290" x2="395" y2="290" stroke="#3f3126" strokeWidth="5" />
            <line x1="160" y1="350" x2="445" y2="350" stroke="#3f3126" strokeWidth="6" />
            {/* Clock Tower / Station silhouette */}
            <rect x="250" y="80" width="100" height="80" fill="#0e0a08" />
            <polygon points="240,80 300,40 360,80" fill="#0e0a08" />
            <circle cx="300" cy="110" r="15" fill="#f8eed1" opacity="0.9" />
            <line x1="300" y1="110" x2="300" y2="101" stroke="#111" strokeWidth="2" />
            <line x1="300" y1="110" x2="308" y2="110" stroke="#111" strokeWidth="1.5" />
          </svg>
        );

      case 'bengali-sunset':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a1c12" />
                <stop offset="45%" stopColor="#7a341c" />
                <stop offset="70%" stopColor="#c86733" />
                <stop offset="100%" stopColor="#2b140b" />
              </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#sunsetGrad)" />
            {/* Setting Golden Sun */}
            <circle cx="260" cy="230" r="45" fill="#ffd479" />
            {/* River Horizon */}
            <rect x="0" y="240" width="600" height="160" fill="#32140c" opacity="0.85" />
            {/* Bengali Nouka (Wooden Boat) silhouette */}
            <g transform="translate(340, 215) scale(0.9)">
              <path d="M0,35 Q40,48 100,35 Q120,25 140,20 Q80,28 0,35 Z" fill="#130805" />
              {/* Hood (Choi) */}
              <path d="M40,32 Q70,5 95,32 Z" fill="#1a0b07" />
              {/* Majhi silhouette with oar */}
              <ellipse cx="115" cy="18" rx="5" ry="6" fill="#130805" />
              <path d="M110,24 L122,24 L120,33 L108,33 Z" fill="#130805" />
              <line x1="110" y1="20" x2="135" y2="48" stroke="#130805" strokeWidth="2" />
            </g>
            {/* Distant palm trees on riverbank */}
            <path d="M0,238 Q80,230 160,238 L160,242 L0,242 Z" fill="#190a06" />
          </svg>
        );

      // Rickshaw, Rain & Umbrella Variations
      case 'rickshaw-rain':
      case 'rain-train-window':
      case 'window-sill-rain':
      case 'monsoon-cloud':
        return <RickshawRainIllustration />;

      case 'umbrella-walk':
      case 'couple-bench':
      case 'street-lamp-fog':
        return <RickshawRainIllustration isUmbrellaSolo />;

      // Florals & Botany
      case 'kadam-rain':
      case 'lotus-pond':
      case 'candle-light':
      case 'lantern-night':
        return <BlossomIllustration type="kadam" />;

      case 'shiuli-morning':
        return <BlossomIllustration type="shiuli" />;

      case 'champa-flower':
      case 'earthen-lamp':
        return <BlossomIllustration type="champa" />;

      case 'palash-spring':
        return <BlossomIllustration type="palash" />;

      // Post, Letters & Wax
      case 'postbox-vintage':
        return <PostboxIllustration />;

      case 'envelope-heart':
      case 'rose-letter':
      case 'proposal-ring':
        return <PostboxIllustration isBundle />;

      // Music & Vintage Devices
      case 'gramophone-melody':
      case 'pocket-watch':
        return <MusicInstrumentIllustration instrument="gramophone" />;

      case 'piano-keys':
        return <MusicInstrumentIllustration instrument="piano" />;

      case 'radio-vintage':
      case 'tea-stall-rain':
      case 'tea-cup-morning':
        return <MusicInstrumentIllustration instrument="radio" />;

      case 'cassette-tape':
      case 'vintage-camera':
        return <MusicInstrumentIllustration instrument="cassette" />;

      case 'violin-melody':
        return <MusicInstrumentIllustration instrument="violin" />;

      case 'flute-melancholy':
        return <MusicInstrumentIllustration instrument="flute" />;

      // Literature, Typewriter & Books
      case 'vintage-typewriter':
        return <LiteratureIllustration type="typewriter" />;

      case 'quill-parchment':
        return <LiteratureIllustration type="quill" />;

      case 'book-reading':
      case 'old-bookstore':
      case 'breeze-curtain':
        return <LiteratureIllustration type="book" />;

      // Landscapes & Scenery
      case 'sunset-lake':
      case 'sea-waves':
      case 'paper-boat-rain':
      case 'love-lock-bridge':
        return <SceneryIllustration type="sunset-lake" />;

      case 'starry-midnight':
      case 'balcony-moon':
      case 'clock-tower-midnight':
        return <SceneryIllustration type="starry" />;

      case 'mustard-field':
        return <SceneryIllustration type="mustard" />;

      case 'village-pathway':
      case 'kashful-autumn':
      case 'terracotta-temple':
      case 'foggy-winter':
      case 'tea-garden':
        return <SceneryIllustration type="village-pathway" />;

      case 'tram-vintage':
      case 'bridge-vintage':
        return <SceneryIllustration type="tram" />;

      case 'old-cafe':
      default:
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="defaultVintageBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c1f17" />
                <stop offset="60%" stopColor="#1f150f" />
                <stop offset="100%" stopColor="#140c08" />
              </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#defaultVintageBg)" />
            {/* Antique decorative central circle */}
            <circle cx="300" cy="200" r="130" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="5,4" opacity="0.3" />
            <circle cx="300" cy="200" r="140" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.2" />
            {/* Vintage filigree corners */}
            <path d="M20,20 L60,20 M20,20 L20,60" stroke="#d4af37" strokeWidth="2" opacity="0.6" />
            <path d="M580,20 L540,20 M580,20 L580,60" stroke="#d4af37" strokeWidth="2" opacity="0.6" />
            <path d="M20,380 L60,380 M20,380 L20,340" stroke="#d4af37" strokeWidth="2" opacity="0.6" />
            <path d="M580,380 L540,380 M580,380 L580,340" stroke="#d4af37" strokeWidth="2" opacity="0.6" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {/* Artwork container with vintage filter */}
      <div className="w-full h-full" style={getFilterStyle()}>
        {renderIllustration()}
      </div>

      {/* Layer 1: Film grain texture overlay */}
      {(effect === 'film-grain' || effect === 'old-paper' || effect === 'dust' || effect === 'scratch') && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(#f7eed9 0.75px, transparent 0.75px)`,
            backgroundSize: '12px 12px',
          }}
        />
      )}

      {/* Layer 2: Scratches */}
      {effect === 'scratch' && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="w-[1px] h-full bg-[#fdf0d5] absolute left-1/4 rotate-6 opacity-40" />
          <div className="w-[1px] h-full bg-[#fdf0d5] absolute left-2/3 -rotate-3 opacity-30" />
          <div className="w-full h-[1px] bg-[#fdf0d5] absolute top-1/3 rotate-2 opacity-25" />
        </div>
      )}

      {/* Layer 3: Coffee Stain */}
      {effect === 'coffee-stain' && (
        <div className="absolute -bottom-10 -right-10 pointer-events-none">
          <div className="w-48 h-48 rounded-full border-[10px] border-[#5a3818] opacity-35 filter blur-[1px] rotate-12" />
        </div>
      )}

      {/* Layer 4: Dust specks */}
      {effect === 'dust' && (
        <div className="absolute inset-0 pointer-events-none opacity-35">
          <div className="w-1.5 h-1.5 rounded-full bg-[#faecd1] absolute top-12 left-16 blur-[0.5px]" />
          <div className="w-1 h-1 rounded-full bg-[#faecd1] absolute bottom-20 left-1/2 blur-[0.5px]" />
          <div className="w-2 h-2 rounded-full bg-[#faecd1] absolute top-1/3 right-24 blur-[0.5px]" />
        </div>
      )}
    </div>
  );
};
