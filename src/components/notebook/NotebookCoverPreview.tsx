import React from 'react';
import { NotebookCustomizationSelection } from '../../types/index.ts';

interface NotebookCoverPreviewProps {
  customization: NotebookCustomizationSelection;
  activeView: 'front' | 'back' | 'inside';
  aspectRatio?: string;
}

export const NotebookCoverPreview: React.FC<NotebookCoverPreviewProps> = ({
  customization,
  activeView,
}) => {
  const {
    size,
    binding,
    coverColor,
    accentColor,
    customTitle,
    customSubtitle,
    fontStyle,
    foilStampText,
    uploadedImageUrl,
    imageScale = 1,
    imagePositionX = 0,
    imagePositionY = 0,
    ruling,
  } = customization;

  // Determine aspect ratio class based on notebook size
  const sizeClasses: Record<string, string> = {
    A4: 'w-[280px] sm:w-[320px] h-[396px] sm:h-[450px]',
    A5: 'w-[260px] sm:w-[300px] h-[370px] sm:h-[425px]',
    A6: 'w-[220px] sm:w-[250px] h-[310px] sm:h-[355px]',
    B5: 'w-[270px] sm:w-[310px] h-[380px] sm:h-[435px]',
    Custom: 'w-[260px] sm:w-[300px] h-[370px] sm:h-[425px]',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.A5;

  // Font family based on style selection
  const getFontFamily = () => {
    switch (fontStyle) {
      case 'urdu':
        return "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif";
      case 'classic':
        return "'Cormorant Garamond', Georgia, serif";
      case 'script':
        return "cursive, 'Brush Script MT', Georgia, serif";
      case 'modern':
      default:
        return "'Plus Jakarta Sans', system-ui, sans-serif";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 w-full max-w-full overflow-hidden">
      {/* Container with book shadow and 3D depth */}
      <div
        className={`relative ${currentSizeClass} max-w-full rounded-r-md transition-all duration-300 select-none shadow-[10px_15px_30px_rgba(0,0,0,0.22),-3px_0_10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col`}
        style={{
          backgroundColor: activeView === 'inside' ? '#faf7f0' : coverColor,
          borderLeft: binding === 'Spiral Wire-O' ? 'none' : '4px solid rgba(0,0,0,0.18)',
        }}
      >
        {/* Spiral Wire-O Binding Visual on the left edge */}
        {binding === 'Spiral Wire-O' && (
          <div className="absolute left-0 top-0 bottom-0 w-8 z-30 flex flex-col justify-around py-3 pointer-events-none bg-gradient-to-r from-black/15 to-transparent">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex items-center -ml-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#18181b] shadow-inner border border-white/20"></div>
                <div
                  className="w-5 h-2 rounded-full -ml-1 shadow-md border-t border-white/50"
                  style={{
                    background: 'linear-gradient(180deg, #d4af37 0%, #aa820a 50%, #443202 100%)',
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}

        {/* Hardcover / Stitched Spine Depth Crease */}
        {binding !== 'Spiral Wire-O' && (
          <div className="absolute left-0 top-0 bottom-0 w-6 z-20 pointer-events-none bg-gradient-to-r from-black/25 via-white/10 to-transparent"></div>
        )}

        {/* VIEW: INSIDE PAGE RULING */}
        {activeView === 'inside' && (
          <div className="w-full h-full p-6 sm:p-8 flex flex-col justify-between relative bg-[#faf7f0] text-slate-800">
            {/* Header info */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-rose-300 pb-2">
              <span>Date: ____/____/2026</span>
              <span>Page: ____</span>
            </div>

            {/* Ruling Pattern */}
            <div className="w-full flex-1 my-3 overflow-hidden relative">
              {ruling === 'Single Line' && (
                <div className="w-full h-full flex flex-col justify-between">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-full border-b border-sky-300/60 h-6"></div>
                  ))}
                </div>
              )}

              {ruling === 'Urdu / Right Margin' && (
                <div className="w-full h-full relative flex flex-col justify-between">
                  {/* Right vertical margin line */}
                  <div className="absolute right-10 top-0 bottom-0 w-[1.5px] bg-rose-400"></div>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-full border-b border-sky-300/60 h-6"></div>
                  ))}
                </div>
              )}

              {ruling === 'Four Line' && (
                <div className="w-full h-full flex flex-col justify-between">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-full my-1 border-t border-rose-400">
                      <div className="border-t border-sky-300/70 h-2"></div>
                      <div className="border-t border-sky-300/70 h-2"></div>
                      <div className="border-t border-rose-400 h-2"></div>
                    </div>
                  ))}
                </div>
              )}

              {ruling === 'Grid / Math' && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                ></div>
              )}

              {ruling === 'Dotted' && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                    opacity: 0.6,
                  }}
                ></div>
              )}

              {ruling === 'Accounting / Ledger' && (
                <div className="w-full h-full flex flex-col">
                  <div className="w-full border-b-2 border-red-500 pb-1 mb-1 flex text-[9px] text-slate-600 font-medium">
                    <span className="w-12 border-r border-slate-300 pr-1">Date</span>
                    <span className="flex-1 border-r border-slate-300 px-1">Particulars / Description</span>
                    <span className="w-14 border-r border-slate-300 px-1 text-right">Debit</span>
                    <span className="w-14 px-1 text-right">Credit</span>
                  </div>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="w-full border-b border-sky-200 h-6 flex">
                      <div className="w-12 border-r border-slate-300"></div>
                      <div className="flex-1 border-r border-slate-300"></div>
                      <div className="w-14 border-r border-slate-300"></div>
                      <div className="w-14"></div>
                    </div>
                  ))}
                </div>
              )}

              {ruling === 'Plain / Blank' && (
                <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs">
                  Smooth Unruled Art & Sketch Page
                </div>
              )}
            </div>

            <div className="text-center text-[9px] text-slate-400">
              Beyond Notebooks · 80 GSM Acid-Free Ivory Paper
            </div>
          </div>
        )}

        {/* VIEW: BACK COVER (BACK GATAA) */}
        {activeView === 'back' && (
          <div
            className="w-full h-full flex flex-col justify-between items-center p-6 text-center relative select-none"
            style={{ color: accentColor }}
          >
            {/* Subtle board texture & border */}
            <div className="absolute inset-3 border border-current opacity-25 rounded pointer-events-none" />

            <div className="w-full pt-2 flex flex-col items-center">
              <span className="text-[10px] tracking-widest font-mono uppercase opacity-75 border-b border-current pb-1 px-3">
                {customTitle.toLowerCase().includes('sidhu') || customTitle.includes('295') || customTitle.includes('Ride')
                  ? 'Sidhu Moose Wala Tribute Tracklist'
                  : customTitle.toLowerCase().includes('cheema') || customTitle.toLowerCase().includes('california')
                  ? 'Cheema Y Chronicles Tracklist'
                  : 'Bespoke Hardboard Register (Back Gataa)'}
              </span>

              {/* Song List on the Back Gataa */}
              {(customTitle.toLowerCase().includes('sidhu') || customTitle.includes('295') || customTitle.includes('Ride')) && (
                <div className="my-3 w-full max-w-[200px] text-left text-[10px] font-mono space-y-1 bg-black/20 p-2.5 rounded border border-current/20">
                  <div className="font-bold border-b border-current/30 pb-0.5 text-center text-[10px]">
                    SIDE A & B FAVORITES
                  </div>
                  <div className="flex justify-between"><span>01. 295</span><span>4:30</span></div>
                  <div className="flex justify-between"><span>02. The Last Ride</span><span>4:15</span></div>
                  <div className="flex justify-between"><span>03. Legend</span><span>3:48</span></div>
                  <div className="flex justify-between"><span>04. Levels</span><span>3:52</span></div>
                  <div className="flex justify-between"><span>05. So High</span><span>3:35</span></div>
                  <div className="flex justify-between"><span>06. Same Beef</span><span>4:10</span></div>
                  <div className="flex justify-between"><span>07. Signed to God</span><span>3:12</span></div>
                </div>
              )}

              {(customTitle.toLowerCase().includes('cheema') || customTitle.toLowerCase().includes('california')) && (
                <div className="my-3 w-full max-w-[200px] text-left text-[10px] font-mono space-y-1 bg-black/20 p-2.5 rounded border border-current/20">
                  <div className="font-bold border-b border-current/30 pb-0.5 text-center text-[10px]">
                    STREET VIBES TRACKS
                  </div>
                  <div className="flex justify-between"><span>01. California Love</span><span>3:40</span></div>
                  <div className="flex justify-between"><span>02. Daku</span><span>3:25</span></div>
                  <div className="flex justify-between"><span>03. Never Fold</span><span>3:50</span></div>
                  <div className="flex justify-between"><span>04. Billi Akh</span><span>3:15</span></div>
                  <div className="flex justify-between"><span>05. Street Style</span><span>4:02</span></div>
                </div>
              )}

              {!customTitle.toLowerCase().includes('sidhu') &&
                !customTitle.toLowerCase().includes('cheema') &&
                !customTitle.includes('295') &&
                !customTitle.includes('Ride') &&
                !customTitle.toLowerCase().includes('california') && (
                  <div className="my-4 text-center space-y-1 opacity-80">
                    <p className="text-xs font-semibold">{customTitle || 'Custom Printed Edition'}</p>
                    <p className="text-[10px] italic">{customSubtitle || 'Personalized Notebook & Register'}</p>
                    <div className="text-[9px] font-mono opacity-60 pt-2">
                      Rigid 2.5mm Hardboard Gataa · Matte Thermal Lamination
                    </div>
                  </div>
                )}
            </div>

            {/* Middle logo stamp */}
            <div className="flex flex-col items-center gap-1 my-auto">
              <div className="w-9 h-9 rounded-full border-2 border-current flex items-center justify-center font-bold text-xs opacity-90 shadow-sm">
                BN
              </div>
              <p className="text-[10px] tracking-widest font-semibold uppercase opacity-80">
                Beyond Notebooks · Lahore & Karachi
              </p>
            </div>

            {/* Bottom Barcode and Specs */}
            <div className="w-full flex flex-col items-center gap-1.5 pb-2">
              {/* Graphic Barcode */}
              <div className="h-6 w-36 flex items-center justify-center gap-[2px] bg-white/90 p-1 rounded opacity-90">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 3, 1].map((w, i) => (
                  <div key={i} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }}></div>
                ))}
              </div>
              <div className="text-[8px] font-mono opacity-65">
                PK-BN-2026 · FSC CERTIFIED ACID-FREE PAPER
              </div>
            </div>
          </div>
        )}

        {/* VIEW: FRONT COVER */}
        {activeView === 'front' && (
          <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 z-10">
            {/* Elegant Ornamental Border */}
            <div
              className="absolute inset-4 rounded pointer-events-none transition-all duration-300"
              style={{
                border: `1.5px solid ${foilStampText ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.25)'}`,
              }}
            >
              {/* Corner Accents */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-current opacity-80"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-current opacity-80"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-current opacity-80"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-current opacity-80"></div>
            </div>

            {/* Custom Uploaded Artwork / Logo Container */}
            {uploadedImageUrl && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none p-6">
                <img
                  src={uploadedImageUrl}
                  alt="Custom Artwork Mockup"
                  className="max-h-[60%] max-w-[80%] object-contain drop-shadow-md transition-transform"
                  style={{
                    transform: `translate(${imagePositionX}px, ${imagePositionY}px) scale(${imageScale})`,
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Top Ornamental Header or Urdu Floral Motif */}
            <div className="text-center pt-2">
              <span
                className="text-xs uppercase tracking-widest font-medium opacity-85"
                style={{ color: foilStampText ? '#e5c05d' : accentColor }}
              >
                {size} · {binding}
              </span>
            </div>

            {/* Center / Primary Custom Titles */}
            <div
              className={`flex flex-col items-center justify-center my-auto px-4 z-20 text-center ${
                fontStyle === 'urdu' ? 'urdu-text' : ''
              }`}
            >
              <h2
                className={`text-2xl sm:text-3xl font-bold tracking-tight transition-all leading-tight ${
                  foilStampText ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : ''
                }`}
                style={{
                  fontFamily: getFontFamily(),
                  color: foilStampText ? '#f4d068' : accentColor,
                  textShadow: foilStampText
                    ? '0 0 10px rgba(245, 208, 104, 0.45), 1px 1px 2px rgba(0,0,0,0.8)'
                    : undefined,
                }}
              >
                {customTitle || 'Your Custom Name Here'}
              </h2>

              {customSubtitle && (
                <p
                  className="text-xs sm:text-sm mt-2 opacity-90 max-w-[220px] transition-all"
                  style={{
                    fontFamily: getFontFamily(),
                    color: foilStampText ? '#e0be5f' : accentColor,
                  }}
                >
                  {customSubtitle}
                </p>
              )}
            </div>

            {/* Bottom Details / Ribbon Bookmark */}
            <div className="flex justify-between items-end pb-1 text-[10px] opacity-75">
              <span style={{ color: foilStampText ? '#e5c05d' : accentColor }}>
                {customization.pageCount} Pages
              </span>
              <span style={{ color: foilStampText ? '#e5c05d' : accentColor }}>
                Beyond Notebooks
              </span>
            </div>

            {/* Ribbon Bookmark visual dangling from bottom edge */}
            <div
              className="absolute -bottom-5 right-10 w-4 h-9 shadow-md z-30 pointer-events-none"
              style={{
                backgroundColor: foilStampText ? '#b8860b' : '#991b1b',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)',
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Production Disclaimer notice as strictly required */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 text-center max-w-sm">
        Visual mockup preview for layout reference. Actual production print colors, trimming, bleed, and foil sheen may have subtle artisanal variations.
      </p>
    </div>
  );
};
