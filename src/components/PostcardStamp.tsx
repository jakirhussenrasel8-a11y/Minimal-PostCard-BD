import React from 'react';

interface PostcardStampProps {
  type?: string;
  className?: string;
}

export const PostcardStamp: React.FC<PostcardStampProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-start gap-2 select-none pointer-events-none ${className}`}>
      {/* Circular Postmark Cancellation Ink */}
      <div className="relative w-14 h-14 rounded-full border-2 border-[#bfa265]/50 flex flex-col items-center justify-center -rotate-12 opacity-85">
        <div className="absolute inset-1 rounded-full border border-[#bfa265]/30" />
        <span className="text-[7px] font-mono tracking-widest text-[#d8be82] uppercase">DHAKA G.P.O.</span>
        <span className="text-[9px] font-bold font-mono text-[#d8be82]">1971</span>
        <span className="text-[6px] text-[#d8be82]/80 tracking-tighter">AIR MAIL</span>
        {/* Ink cancel wavy lines */}
        <div className="absolute -right-7 top-4 flex flex-col gap-1 w-7 opacity-75">
          <div className="h-[1.5px] bg-[#d8be82]/60 rounded-full" />
          <div className="h-[1.5px] bg-[#d8be82]/60 rounded-full" />
          <div className="h-[1.5px] bg-[#d8be82]/60 rounded-full" />
        </div>
      </div>

      {/* Postage Stamp with Perforated Edge */}
      <div className="relative w-14 h-18 bg-[#2d1e18] border-2 border-dashed border-[#d4af37]/60 p-1 flex flex-col justify-between items-center shadow-md rotate-3">
        <div className="w-full flex justify-between items-center text-[7px] font-serif text-[#d4af37]">
          <span>POST</span>
          <span>৫০p</span>
        </div>
        <div className="w-9 h-9 rounded bg-[#1e130e] border border-[#d4af37]/40 flex items-center justify-center text-xs">
          💌
        </div>
        <span className="text-[6px] font-serif tracking-widest text-[#d4af37]/90 uppercase">বাংলা ডাক</span>
      </div>
    </div>
  );
};
