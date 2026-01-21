import React, { useMemo } from 'react';
import { Mode, DotShape, Theme, UserConfig } from '../types';
import { DollarSign, Flame, X, Check, Star } from 'lucide-react';

interface WallpaperContentProps {
  config: UserConfig;
  theme: Theme;
  standalone?: boolean;
}

const WallpaperContent: React.FC<WallpaperContentProps> = ({ config, theme, standalone }) => {
  const stats = useMemo(() => {
    const now = new Date();
    
    if (config.mode === Mode.LIFE) {
      const birth = new Date(config.birthDate || '2000-01-01');
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const totalWeeks = 80 * 52; // 80 Years
      const remaining = totalWeeks - diffWeeks;
      return { total: totalWeeks, passed: diffWeeks, remaining, label: 'Weeks' };
    } 
    
    if (config.mode === Mode.YEAR) {
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      const totalDays = 365; // Simplified
      const remaining = totalDays - dayOfYear;
      return { total: totalDays, passed: dayOfYear, remaining, label: 'Days' };
    }

    // 75 HARD
    return { total: 75, passed: 12, remaining: 63, label: 'Day' };
  }, [config.mode, config.birthDate]);

  const renderIcon = (index: number, customSize?: number) => {
    // Logic: 
    // index < stats.passed => Past (accent)
    // index === stats.passed => Current (current)
    // index > stats.passed => Future (dots)
    
    const isPast = index < stats.passed;
    const isCurrent = index === stats.passed;
    
    let color = theme.dots;
    if (isPast) color = theme.accent;
    if (isCurrent) color = theme.current;

    const baseSize = standalone ? 6 : 3; 
    const size = customSize || baseSize;

    // For icons, we need to handle fill/stroke logic
    if (config.shape === DotShape.DOLLAR) return <DollarSign size={size} color={color} strokeWidth={isCurrent ? 4 : 3} key={index} />;
    if (config.shape === DotShape.FIRE) return <Flame size={size} color={color} fill={isPast || isCurrent ? color : 'none'} key={index} />;
    if (config.shape === DotShape.CROSS) return <X size={size} color={color} strokeWidth={isCurrent ? 4 : 3} key={index} />;
    if (config.shape === DotShape.CHECK) return <Check size={size} color={color} strokeWidth={isCurrent ? 4 : 3} key={index} />;
    if (config.shape === DotShape.STAR) return <Star size={size} color={color} fill={isPast || isCurrent ? color : 'none'} key={index} />;
    
    const style: React.CSSProperties = {
      backgroundColor: color,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: config.shape === DotShape.CIRCLE ? '50%' : config.shape === DotShape.ROUNDED ? '1px' : '0px',
      // Add a subtle glow for current dot in standalone mode
      boxShadow: (isCurrent && standalone) ? `0 0 10px ${color}` : 'none',
      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
      transition: 'transform 0.3s ease'
    };
    return <div key={index} style={style} />;
  };

  // --- Layout Renderers ---

  const renderLifeLayout = () => {
    const years = 80;
    const weeks = 52;
    const items = [];
    let count = 0;

    // We render row by row (Year by Year)
    for (let y = 0; y < years; y++) {
      const weekItems = [];
      for (let w = 0; w < weeks; w++) {
        // Spacing after every 4 columns (approx a month)
        // standalone uses larger spacing pixels than preview
        const colSpacing = (w + 1) % 4 === 0 && w !== 51 
            ? (standalone ? 'mr-[4px]' : 'mr-[2px]') 
            : (standalone ? 'mr-[1px]' : 'mr-[0.5px]');
            
        weekItems.push(
          <div key={`${y}-${w}`} className={colSpacing}>
            {renderIcon(count)}
          </div>
        );
        count++;
      }
      
      // Spacing after every 20 rows (years)
      const rowSpacing = (y + 1) % 20 === 0 && y !== 79
        ? (standalone ? 'mb-6' : 'mb-3') 
        : (standalone ? 'mb-[2px]' : 'mb-[1px]');
      
      items.push(
        <div key={y} className={`flex ${rowSpacing} justify-center`}>
          {weekItems}
        </div>
      );
    }
    return <div className="flex flex-col w-full items-center">{items}</div>;
  };
  const renderYearLayout = () => {
     // 13 Columns Grid (Zoomed In Effect)
     // 365 days / 13 columns = ~28 rows.
     return (
        <div className="flex justify-center w-full items-center h-full">
           <div 
             style={{ 
                 display: 'grid',
                 gridTemplateColumns: 'repeat(13, 1fr)',
                 gap: standalone ? '8px' : '2px',
                 width: '100%',
                 justifyItems: 'center',
             }}
           >
              {Array.from({ length: stats.total }).map((_, i) => (
                  renderIcon(i, standalone ? 20 : 7.5)
              ))}
           </div>
        </div>
     );
  };

  const renderHardLayout = () => {
      // 5 Columns x 15 Rows = 75
      return (
          <div className="flex items-center justify-center h-full w-full">
               <div 
                className="grid grid-cols-5 justify-items-center"
                style={{ gap: standalone ? '16px' : '6px' }}
               >
                  {Array.from({ length: 75 }).map((_, i) => (
                      renderIcon(i, standalone ? 24 : 10)
                  ))}
               </div>
          </div>
      );
  };

  // Adjust scaling for standalone mode
  const containerClasses = standalone 
    ? "w-full h-full flex flex-col p-8 md:p-12 relative" 
    : "w-full h-full flex flex-col p-6 relative transition-colors duration-500";

  return (
      <div 
        className={containerClasses}
        style={{ backgroundColor: theme.bg }}
      >
        {/* Date / Header */}
        <div className={`text-center opacity-80 ${standalone ? 'mt-16 mb-8' : 'mt-8'}`} style={{ color: theme.accent }}>
          <p className={`${standalone ? 'text-6xl' : 'text-4xl'} font-light font-mono`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </p>
          <p className={`${standalone ? 'text-lg' : 'text-xs'} uppercase tracking-widest mt-1 opacity-60`}>
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric'})}
          </p>
        </div>

        {/* Dynamic Quote */}
        {config.customQuoteText && (
          <div className={`text-center z-10 ${standalone ? 'my-12 px-8' : 'my-6'}`}>
            <p className={`${standalone ? 'text-xl' : 'text-xs'} font-mono leading-relaxed opacity-90 font-bold`} style={{ color: theme.current }}>
              "{config.customQuoteText}"
            </p>
          </div>
        )}

        {/* The Content Area */}
        <div className="flex-1 overflow-hidden min-h-0 relative flex flex-col justify-center items-center">
             {config.mode === Mode.LIFE && renderLifeLayout()}
             {config.mode === Mode.YEAR && renderYearLayout()}
             {config.mode === Mode.HARD75 && renderHardLayout()}
        </div>

        {/* Footer Stats */}
        <div className={`mt-auto text-center ${standalone ? 'mb-16' : 'mb-4'}`}>
            <div className={`flex justify-between font-mono uppercase tracking-wider opacity-90 ${standalone ? 'text-sm mb-4 px-4' : 'text-[10px]'}`} style={{ color: theme.accent }}>
                <span>Passed: {stats.passed}</span>
                <span>Left: {stats.remaining}</span>
            </div>
            <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${standalone ? 'h-2' : 'h-1 mt-2'}`}>
                <div 
                    className="h-full transition-all duration-1000" 
                    style={{ width: `${(stats.passed / stats.total) * 100}%`, backgroundColor: theme.accent }}
                />
            </div>
             <p className={`${standalone ? 'text-sm mt-4' : 'text-[9px] mt-2'} opacity-40 font-mono`} style={{ color: theme.accent }}>dostdots</p>
        </div>
      </div>
  );
};

export default WallpaperContent;