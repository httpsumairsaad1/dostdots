export enum Mode {
  LIFE = 'LIFE',
  YEAR = 'YEAR',
  HARD75 = 'HARD75'
}

export enum DotShape {
  CIRCLE = 'circle',
  SQUARE = 'square',
  ROUNDED = 'rounded',
  DOLLAR = 'dollar',
  FIRE = 'fire',
  CROSS = 'cross',
  CHECK = 'check',
  STAR = 'star'
}

export interface Theme {
  name: string;
  bg: string;
  dots: string;
  accent: string;
  current: string;
}

export interface UserConfig {
  birthDate: string;
  mode: Mode;
  themeId: number;
  shape: DotShape;
  quoteType: 'none' | 'quote' | 'quran';
  quoteTag: string;
  customQuoteText: string;
  phoneModel: string;
}

export const THEMES: Theme[] = [
  // Original
  { name: 'Paper White', bg: '#ffffff', dots: '#e5e7eb', accent: '#525252', current: '#000000' },
  { name: 'Soft Mist', bg: '#f3f4f6', dots: '#d1d5db', accent: '#6b7280', current: '#111827' },
  { name: 'Swiss Design', bg: '#ffffff', dots: '#f3f4f6', accent: '#ef4444', current: '#b91c1c' },
  { name: 'OLED Midnight', bg: '#000000', dots: '#333333', accent: '#a3a3a3', current: '#FFFFFF' },
  { name: 'Deep Space', bg: '#0f172a', dots: '#1e293b', accent: '#38bdf8', current: '#0ea5e9' },
  { name: 'Hacker Green', bg: '#0D1117', dots: '#161B22', accent: '#00FF41', current: '#ffffff' },
  { name: 'Coffee', bg: '#4F200D', dots: '#783214', accent: '#FF9A00', current: '#fbbf24' },
  { name: 'Slate', bg: '#1c1c1e', dots: '#2c2c2e', accent: '#8e8e93', current: '#e5e5ea' },
  
  // Previous New Themes
  { name: 'Obsidian Pro', bg: '#0a0a0a', dots: '#262626', accent: '#737373', current: '#ffffff' },
  { name: 'Midnight Blue', bg: '#020617', dots: '#1e293b', accent: '#3b82f6', current: '#60a5fa' },
  { name: 'Charcoal Minimal', bg: '#18181b', dots: '#27272a', accent: '#71717a', current: '#fafafa' },
  { name: 'Concrete', bg: '#d6d3d1', dots: '#a8a29e', accent: '#57534e', current: '#0c0a09' },
  { name: 'Clean Ceramic', bg: '#fafaf9', dots: '#e7e5e4', accent: '#78716c', current: '#ea580c' },

  // New Creative Themes (Updated Colors)
  // dots: Uncompleted (Darker shade of BG)
  // accent: Completed (User provided 'dots' color)
  { name: 'Teal Horizon', bg: '#215E61', dots: '#153F41', accent: '#3BC1A8', current: '#ffffff' },
  { name: 'Baked Earth', bg: '#D96F32', dots: '#8a431d', accent: '#F3E9DC', current: '#ffffff' },
  { name: 'Rouge', bg: '#5A0E24', dots: '#2e0511', accent: '#BF124D', current: '#ffffff' },
  { name: 'Ultraviolet', bg: '#540863', dots: '#2b0333', accent: '#E49BA6', current: '#ffffff' },
  { name: 'Matcha', bg: '#31694E', dots: '#193628', accent: '#F0E491', current: '#ffffff' },
];

export const serializeConfig = (config: UserConfig): string => {
  const params = new URLSearchParams();
  params.append('birthDate', config.birthDate);
  params.append('mode', config.mode);
  params.append('themeId', config.themeId.toString());
  params.append('shape', config.shape);
  params.append('quoteType', config.quoteType);
  params.append('quoteTag', config.quoteTag);
  params.append('customQuoteText', config.customQuoteText);
  params.append('phoneModel', config.phoneModel);
  return params.toString();
};

export const deserializeConfig = (searchParams: URLSearchParams): UserConfig => {
  return {
    birthDate: searchParams.get('birthDate') || '2000-01-01',
    mode: (searchParams.get('mode') as Mode) || Mode.YEAR,
    themeId: parseInt(searchParams.get('themeId') || '0'),
    shape: (searchParams.get('shape') as DotShape) || DotShape.SQUARE,
    quoteType: (searchParams.get('quoteType') as any) || 'none',
    quoteTag: searchParams.get('quoteTag') || '',
    customQuoteText: searchParams.get('customQuoteText') || '',
    phoneModel: searchParams.get('phoneModel') || '',
  };
};