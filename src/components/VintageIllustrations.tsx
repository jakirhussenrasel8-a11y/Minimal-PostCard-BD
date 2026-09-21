import React from 'react';

// Reusable SVG filigree corners
export const FiligreeCorners: React.FC<{ color?: string }> = ({ color = '#d4af37' }) => (
  <g stroke={color} strokeWidth="1.5" opacity="0.45" fill="none">
    <path d="M 24 40 C 24 24 40 24 40 24" />
    <path d="M 20 20 L 50 20 M 20 20 L 20 50" />
    <circle cx="28" cy="28" r="2" fill={color} />
    <path d="M 576 40 C 576 24 560 24 560 24" />
    <path d="M 580 20 L 550 20 M 580 20 L 580 50" />
    <circle cx="572" cy="28" r="2" fill={color} />
    <path d="M 24 360 C 24 376 40 376 40 376" />
    <path d="M 20 380 L 50 380 M 20 380 L 20 350" />
    <circle cx="28" cy="372" r="2" fill={color} />
    <path d="M 576 360 C 576 376 560 376 560 376" />
    <path d="M 580 380 L 550 380 M 580 380 L 580 350" />
    <circle cx="572" cy="372" r="2" fill={color} />
  </g>
);

// Rickshaw in Rain / Umbrella Illustration
export const RickshawRainIllustration: React.FC<{ isUmbrellaSolo?: boolean }> = ({ isUmbrellaSolo = false }) => (
  <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rickshawBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14211a" />
        <stop offset="60%" stopColor="#1f2c25" />
        <stop offset="100%" stopColor="#0c1410" />
      </linearGradient>
      <radialGradient id="rickshawGlow" cx="0.5" cy="0.4" r="0.5">
        <stop offset="0%" stopColor="#f39c12" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#14211a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="600" height="400" fill="url(#rickshawBg)" />
    <circle cx="420" cy="220" r="140" fill="url(#rickshawGlow)" />
    {/* Rain drops */}
    <g stroke="#e2f1e8" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round">
      <line x1="60" y1="20" x2="45" y2="65" />
      <line x1="140" y1="80" x2="125" y2="135" />
      <line x1="250" y1="30" x2="235" y2="90" />
      <line x1="340" y1="110" x2="325" y2="165" />
      <line x1="450" y1="40" x2="435" y2="95" />
      <line x1="530" y1="120" x2="515" y2="175" />
      <line x1="100" y1="220" x2="85" y2="280" />
      <line x1="220" y1="260" x2="205" y2="320" />
      <line x1="490" y1="240" x2="475" y2="300" />
    </g>
    {/* Wet road */}
    <rect x="0" y="320" width="600" height="80" fill="#080f0c" opacity="0.9" />
    <ellipse cx="400" cy="340" rx="160" ry="20" fill="#f39c12" fillOpacity="0.1" />
    {/* Rickshaw Silhouette */}
    {!isUmbrellaSolo ? (
      <g transform="translate(320, 180) scale(0.95)">
        {/* Wheels */}
        <circle cx="60" cy="140" r="32" fill="none" stroke="#2a3f33" strokeWidth="3" />
        <circle cx="160" cy="140" r="32" fill="none" stroke="#2a3f33" strokeWidth="3" />
        <circle cx="60" cy="140" r="4" fill="#d4af37" />
        <circle cx="160" cy="140" r="4" fill="#d4af37" />
        {/* Spokes */}
        <line x1="60" y1="110" x2="60" y2="170" stroke="#365042" strokeWidth="1" />
        <line x1="30" y1="140" x2="90" y2="140" stroke="#365042" strokeWidth="1" />
        <line x1="160" y1="110" x2="160" y2="170" stroke="#365042" strokeWidth="1" />
        <line x1="130" y1="140" x2="190" y2="140" stroke="#365042" strokeWidth="1" />
        {/* Hood Up */}
        <path d="M120,40 Q190,40 190,120 L110,120 Z" fill="#1b2a22" stroke="#d4af37" strokeWidth="1.5" />
        {/* Couple inside hood silhouette */}
        <circle cx="140" cy="80" r="10" fill="#0b1410" />
        <circle cx="160" cy="84" r="9" fill="#0b1410" />
        {/* Rickshaw Puller silhouette */}
        <circle cx="10" cy="95" r="9" fill="#0b1410" />
        <path d="M5,104 L15,104 L20,135 L5,135 Z" fill="#0b1410" />
        <line x1="15" y1="115" x2="55" y2="125" stroke="#0b1410" strokeWidth="2.5" />
      </g>
    ) : (
      // Yellow Umbrella Solo Walk
      <g transform="translate(360, 160)">
        <path d="M0,60 Q60,-5 120,60 Q60,50 0,60 Z" fill="#d4a317" stroke="#332408" strokeWidth="2" />
        <line x1="60" y1="55" x2="60" y2="160" stroke="#222" strokeWidth="3" />
        <circle cx="48" cy="85" r="11" fill="#0d140e" />
        <path d="M36,98 Q50,105 60,100 L62,175 L34,175 Z" fill="#0d140e" />
      </g>
    )}
    <FiligreeCorners color="#a4cfb7" />
  </svg>
);

// Flower Blossom (Kadam / Shiuli / Champa / Palash)
export const BlossomIllustration: React.FC<{ type: 'kadam' | 'shiuli' | 'champa' | 'palash' }> = ({ type }) => {
  const isKadam = type === 'kadam';
  const isShiuli = type === 'shiuli';
  const isPalash = type === 'palash';

  const bgColor = isKadam
    ? '#1c281e'
    : isShiuli
    ? '#26221c'
    : isPalash
    ? '#381313'
    : '#2b2419';

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="flowerBg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor={bgColor} />
          <stop offset="100%" stopColor="#0d0a07" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#flowerBg)" />
      {/* Decorative Tree Branch */}
      <path d="M 600 120 Q 450 140 380 200 Q 320 250 240 220" fill="none" stroke="#2a1e15" strokeWidth="6" strokeLinecap="round" />
      <path d="M 450 140 Q 400 100 340 110" fill="none" stroke="#2a1e15" strokeWidth="4" strokeLinecap="round" />

      {/* Blossom Central Graphic */}
      <g transform="translate(380, 160)">
        {isKadam ? (
          // Kadam Flower (Golden yellow spiky ball with leaves)
          <>
            {/* Leaves */}
            <path d="M -40,30 Q -80,0 -40,-40 Q 0,-20 -40,30 Z" fill="#1b3820" opacity="0.8" />
            <path d="M 40,30 Q 80,0 40,-40 Q 0,-20 40,30 Z" fill="#1b3820" opacity="0.8" />
            {/* Kadam core ball */}
            <circle cx="0" cy="0" r="36" fill="#f5af19" />
            {/* Filament spikes */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x1 = Math.cos(rad) * 36;
              const y1 = Math.sin(rad) * 36;
              const x2 = Math.cos(rad) * 54;
              const y2 = Math.sin(rad) * 54;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff8dc" strokeWidth="1.8" />
                  <circle cx={x2} cy={y2} r="2" fill="#ffffff" />
                </g>
              );
            })}
          </>
        ) : isShiuli ? (
          // Shiuli (White petals with orange center stem)
          <>
            <circle cx="0" cy="0" r="8" fill="#e67e22" />
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = i * 60;
              return (
                <path
                  key={i}
                  d="M 0,-8 C -12,-28 12,-28 0,-8"
                  fill="#ffffff"
                  stroke="#f5e6d3"
                  strokeWidth="0.8"
                  transform={`rotate(${angle})`}
                  opacity="0.95"
                />
              );
            })}
          </>
        ) : isPalash ? (
          // Palash (Flame orange curved petals)
          <g transform="scale(1.2)">
            <path d="M 0,0 C -30,-40 -10,-80 20,-60 C 10,-30 15,-10 0,0 Z" fill="#e74c3c" />
            <path d="M -5,5 C -35,-20 -25,-60 5,-45 Z" fill="#d35400" />
            <path d="M 10,-10 C 25,-40 35,-60 15,-70 Z" fill="#c0392b" />
          </g>
        ) : (
          // Champa
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-25"
                rx="10"
                ry="24"
                fill="#fcf3cf"
                stroke="#d4af37"
                strokeWidth="0.5"
                transform={`rotate(${i * 72})`}
                opacity="0.9"
              />
            ))}
            <circle cx="0" cy="0" r="7" fill="#f39c12" />
          </>
        )}
      </g>
      <FiligreeCorners color={isPalash ? '#e57373' : '#d4af37'} />
    </svg>
  );
};

// Postbox & Sealed Letters
export const PostboxIllustration: React.FC<{ isBundle?: boolean }> = ({ isBundle = false }) => (
  <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="postboxBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#301416" />
        <stop offset="100%" stopColor="#120708" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#postboxBg)" />
    {isBundle ? (
      // Bundle of letters tied with ribbon
      <g transform="translate(360, 160)">
        <rect x="-60" y="-35" width="130" height="90" rx="3" fill="#dfcfb8" stroke="#8b6b45" strokeWidth="1.5" transform="rotate(-6)" />
        <rect x="-55" y="-30" width="130" height="90" rx="3" fill="#e8dac6" stroke="#8b6b45" strokeWidth="1.5" transform="rotate(3)" />
        <rect x="-50" y="-25" width="130" height="90" rx="3" fill="#f5ecd8" stroke="#8b6b45" strokeWidth="1.5" />
        {/* Red ribbon around stack */}
        <rect x="0" y="-25" width="16" height="90" fill="#a91b1b" />
        <rect x="-50" y="10" width="130" height="14" fill="#a91b1b" />
        {/* Bow knot */}
        <circle cx="8" cy="17" r="10" fill="#c02828" />
        <circle cx="8" cy="17" r="4" fill="#ffd700" />
      </g>
    ) : (
      // British vintage red postbox cylinder
      <g transform="translate(420, 130)">
        {/* Postbox dome top */}
        <path d="M 0 60 C 0 10 70 10 70 60 Z" fill="#b71c1c" stroke="#5a0b0b" strokeWidth="2" />
        {/* Body */}
        <rect x="0" y="60" width="70" height="160" rx="4" fill="#c62828" stroke="#5a0b0b" strokeWidth="2" />
        {/* Letter slot */}
        <rect x="15" y="75" width="40" height="10" rx="2" fill="#1b1b1b" stroke="#d4af37" strokeWidth="1" />
        {/* Royal Crest / Lettering circle */}
        <circle cx="35" cy="120" r="14" fill="#b71c1c" stroke="#d4af37" strokeWidth="1.5" />
        <text x="35" y="124" fill="#d4af37" fontSize="10" textAnchor="middle" fontFamily="serif" fontWeight="bold">POST</text>
        {/* Base */}
        <rect x="-8" y="215" width="86" height="20" rx="3" fill="#1f1f1f" />
      </g>
    )}
    <FiligreeCorners color="#e57373" />
  </svg>
);

// Gramophone & Music
export const MusicInstrumentIllustration: React.FC<{ instrument: 'gramophone' | 'piano' | 'violin' | 'radio' | 'cassette' | 'flute' }> = ({
  instrument
}) => {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="musicBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c1e14" />
          <stop offset="100%" stopColor="#0e0a07" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#musicBg)" />
      {/* Musical notes floating */}
      <g fill="#d4af37" opacity="0.35" transform="translate(180, 80)">
        <text x="40" y="40" fontSize="26">♪</text>
        <text x="80" y="90" fontSize="34">♫</text>
        <text x="140" y="50" fontSize="22">♩</text>
        <text x="190" y="110" fontSize="30">♬</text>
      </g>

      <g transform="translate(380, 160)">
        {instrument === 'gramophone' && (
          <>
            {/* Box */}
            <rect x="-60" y="50" width="120" height="60" rx="4" fill="#422a1d" stroke="#d4af37" strokeWidth="2" />
            <circle cx="0" cy="50" r="35" fill="#111" stroke="#333" strokeWidth="2" />
            {/* Turntable spindle */}
            <circle cx="0" cy="50" r="5" fill="#d4af37" />
            {/* Brass Horn */}
            <path d="M 10,40 Q 30,10 60,-20 Q 90,-50 140,-40 C 120,20 70,0 30,35 Z" fill="#d4af37" stroke="#997b1e" strokeWidth="2" />
          </>
        )}
        {instrument === 'piano' && (
          <g transform="translate(-40, 20)">
            <rect x="0" y="0" width="160" height="70" rx="3" fill="#111" stroke="#d4af37" strokeWidth="1.5" />
            {/* White keys */}
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={i * 13 + 4} y="30" width="11" height="36" fill="#fdfbf7" stroke="#333" strokeWidth="0.5" />
            ))}
            {/* Black keys */}
            {[1, 2, 4, 5, 6, 8, 9, 11].map((pos, idx) => (
              <rect key={idx} x={pos * 13 - 1} y="30" width="8" height="22" fill="#111" />
            ))}
          </g>
        )}
        {instrument === 'radio' && (
          <g transform="translate(-60, 10)">
            <rect x="0" y="0" width="140" height="90" rx="6" fill="#3a2517" stroke="#d4af37" strokeWidth="2" />
            <rect x="15" y="15" width="60" height="60" rx="30" fill="#1a110a" stroke="#d4af37" strokeWidth="1" />
            {/* Speaker mesh lines */}
            <line x1="25" y1="45" x2="65" y2="45" stroke="#d4af37" strokeWidth="1" />
            <line x1="25" y1="35" x2="65" y2="35" stroke="#d4af37" strokeWidth="1" />
            <line x1="25" y1="55" x2="65" y2="55" stroke="#d4af37" strokeWidth="1" />
            {/* Frequency tuning dial */}
            <rect x="85" y="20" width="45" height="20" rx="2" fill="#fcedcf" />
            <line x1="105" y1="20" x2="105" y2="40" stroke="#c0392b" strokeWidth="1.5" />
            {/* Knobs */}
            <circle cx="95" cy="60" r="8" fill="#1a110a" stroke="#d4af37" strokeWidth="1" />
            <circle cx="118" cy="60" r="8" fill="#1a110a" stroke="#d4af37" strokeWidth="1" />
          </g>
        )}
        {instrument === 'cassette' && (
          <g transform="translate(-70, 15)">
            <rect x="0" y="0" width="150" height="85" rx="5" fill="#201a15" stroke="#d4af37" strokeWidth="1.5" />
            <rect x="25" y="15" width="100" height="40" fill="#f7eed9" rx="3" />
            {/* Two spool holes */}
            <circle cx="50" cy="35" r="12" fill="#201a15" stroke="#888" strokeWidth="1" />
            <circle cx="100" cy="35" r="12" fill="#201a15" stroke="#888" strokeWidth="1" />
            <rect x="62" y="30" width="26" height="10" fill="#3a2517" />
          </g>
        )}
        {(instrument === 'violin' || instrument === 'flute') && (
          <g transform="rotate(-30)">
            <ellipse cx="0" cy="20" rx="25" ry="40" fill="#542e18" stroke="#d4af37" strokeWidth="1.5" />
            <rect x="-4" y="-70" width="8" height="70" fill="#111" />
            <circle cx="0" cy="-75" r="8" fill="#d4af37" />
          </g>
        )}
      </g>
      <FiligreeCorners color="#d4af37" />
    </svg>
  );
};

// Vintage Typewriter & Books
export const LiteratureIllustration: React.FC<{ type: 'typewriter' | 'quill' | 'book' }> = ({ type }) => (
  <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="litBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#292019" />
        <stop offset="100%" stopColor="#100c09" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#litBg)" />
    <g transform="translate(380, 160)">
      {type === 'typewriter' ? (
        <>
          {/* Main frame */}
          <path d="M -70,90 L -50,10 L 50,10 L 70,90 Z" fill="#1b1918" stroke="#d4af37" strokeWidth="1.5" />
          {/* Paper rolling out */}
          <rect x="-40" y="-40" width="80" height="55" fill="#fdf8ec" stroke="#c0a678" strokeWidth="1" />
          <line x1="-30" y1="-25" x2="30" y2="-25" stroke="#999" strokeWidth="1" strokeDasharray="3,2" />
          <line x1="-30" y1="-15" x2="20" y2="-15" stroke="#999" strokeWidth="1" strokeDasharray="3,2" />
          {/* Roller */}
          <rect x="-55" y="5" width="110" height="15" rx="3" fill="#333" />
          {/* Keys matrix */}
          {Array.from({ length: 15 }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            return (
              <circle
                key={i}
                cx={col * 18 - 36}
                cy={row * 16 + 35}
                r="5"
                fill="#f7eed9"
                stroke="#222"
                strokeWidth="1"
              />
            );
          })}
        </>
      ) : type === 'quill' ? (
        <>
          {/* Ink pot */}
          <path d="M 30,50 L 20,90 L 70,90 L 60,50 Z" fill="#1a110a" stroke="#d4af37" strokeWidth="1.5" />
          <ellipse cx="45" cy="50" rx="15" ry="6" fill="#d4af37" />
          {/* Feather Quill leaning in pot */}
          <path d="M 45,50 Q 70,-20 120,-80 Q 90,-40 45,50 Z" fill="#e8dac6" stroke="#9a7b56" strokeWidth="1" />
          <line x1="45" y1="50" x2="120" y2="-80" stroke="#5c442c" strokeWidth="2" />
          {/* Old scroll parchment on left */}
          <rect x="-80" y="20" width="85" height="70" rx="2" fill="#faedd4" stroke="#8b6b45" strokeWidth="1.5" />
          <line x1="-70" y1="35" x2="-10" y2="35" stroke="#8b6b45" strokeWidth="1" opacity="0.6" />
          <line x1="-70" y1="48" x2="-20" y2="48" stroke="#8b6b45" strokeWidth="1" opacity="0.6" />
          <line x1="-70" y1="62" x2="-10" y2="62" stroke="#8b6b45" strokeWidth="1" opacity="0.6" />
        </>
      ) : (
        // Open Book
        <g transform="translate(-50, 20)">
          <path d="M 0,50 Q 50,30 100,50 L 100,10 Q 50,-10 0,10 Z" fill="#fdfbf7" stroke="#4a3627" strokeWidth="1.5" />
          <path d="M 0,50 Q -50,30 -100,50 L -100,10 Q -50,-10 0,10 Z" fill="#faf5eb" stroke="#4a3627" strokeWidth="1.5" />
          {/* Bookmark ribbon */}
          <path d="M 0,10 L 0,65 L 8,58 L 16,65 L 16,10" fill="#b71c1c" />
        </g>
      )}
    </g>
    <FiligreeCorners color="#d4af37" />
  </svg>
);

// Landscape & Vintage Scenery (Sunset lake, pathway, tram, bridge, clouds, mustard)
export const SceneryIllustration: React.FC<{
  type: 'sunset-lake' | 'village-pathway' | 'tram' | 'starry' | 'clouds' | 'mustard' | 'bridge'
}> = ({ type }) => {
  if (type === 'sunset-lake') {
    return (
      <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lakeSunset" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#48180c" />
            <stop offset="45%" stopColor="#87351c" />
            <stop offset="70%" stopColor="#c56528" />
            <stop offset="100%" stopColor="#1a0c06" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#lakeSunset)" />
        <circle cx="280" cy="220" r="50" fill="#ffd57a" />
        {/* River Water horizon */}
        <rect x="0" y="240" width="600" height="160" fill="#200d07" opacity="0.88" />
        {/* Water Lily (Shapla) silhouettes */}
        <ellipse cx="140" cy="320" rx="30" ry="10" fill="#140704" />
        <ellipse cx="440" cy="340" rx="40" ry="12" fill="#140704" />
        <path d="M 135,315 L 140,295 L 145,315 Z" fill="#ffd57a" opacity="0.8" />
        {/* Distant palm trees */}
        <path d="M 0,238 Q 120,230 240,238 L 240,242 L 0,242 Z" fill="#120603" />
        <FiligreeCorners color="#f5b041" />
      </svg>
    );
  }

  if (type === 'starry') {
    return (
      <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="starrySky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080e1a" />
            <stop offset="70%" stopColor="#111c2e" />
            <stop offset="100%" stopColor="#06090f" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#starrySky)" />
        {/* Crescent Moon */}
        <path d="M 460 70 A 30 30 0 0 0 490 120 A 24 24 0 0 1 460 70 Z" fill="#fbf0d8" />
        {/* Sparkles / Stars */}
        {[
          [100, 60], [180, 90], [260, 50], [350, 110], [420, 50],
          [520, 140], [80, 180], [210, 160], [330, 200], [530, 80]
        ].map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r={idx % 2 === 0 ? 2 : 1.5} fill="#fff7e6" opacity="0.75" />
        ))}
        {/* Rooftop silhouette at bottom */}
        <polygon points="0,400 120,330 220,360 400,310 600,350 600,400" fill="#04060a" />
        <FiligreeCorners color="#fbf0d8" />
      </svg>
    );
  }

  if (type === 'mustard') {
    return (
      <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mustardBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#302812" />
            <stop offset="50%" stopColor="#4a3e19" />
            <stop offset="100%" stopColor="#191408" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#mustardBg)" />
        {/* Yellow field rolling hills */}
        <path d="M 0,260 Q 200,210 400,250 T 600,230 L 600,400 L 0,400 Z" fill="#8c7317" opacity="0.6" />
        <path d="M 0,290 Q 250,250 450,290 T 600,270 L 600,400 L 0,400 Z" fill="#f1c40f" opacity="0.8" />
        <circle cx="480" cy="130" r="35" fill="#f9e79f" opacity="0.7" />
        <FiligreeCorners color="#f1c40f" />
      </svg>
    );
  }

  // Generic village pathway / bridge / tram
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sceneryBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c2118" />
          <stop offset="60%" stopColor="#1e150f" />
          <stop offset="100%" stopColor="#100b07" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#sceneryBg)" />
      {/* Decorative Arch */}
      <circle cx="300" cy="200" r="140" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.25" />
      {/* Central Vintage Seal */}
      <circle cx="300" cy="200" r="90" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.2" />
      <path d="M 280,180 L 300,160 L 320,180 L 300,200 Z" fill="#d4af37" opacity="0.3" />
      <FiligreeCorners color="#d4af37" />
    </svg>
  );
};
