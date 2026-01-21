import React, { useState, useEffect } from 'react';
import { 
  Grip, 
  Calendar, 
  Activity, 
  Target, 
  Link,
  Check, 
  Sparkles,
  ArrowRight,
  Star,
  X,
  RefreshCw,
  Zap,
  Smartphone,
  Palette,
  Brain,
  Globe,
  Battery,
  CloudOff,
  Quote,
  BookOpen,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Loader2
} from 'lucide-react';
import PhonePreview from './components/PhonePreview';
import WallpaperContent from './components/WallpaperContent';
import Installation from './components/Installation';
import AuthPage from './components/Auth';
import { ConceptPage, AboutDevPage } from './components/InfoPages';
import { Mode, DotShape, THEMES, UserConfig, serializeConfig, deserializeConfig } from './types';
import { generateQuote } from './services/geminiService';

const App: React.FC = () => {
  // Routing: Render Mode for generating the actual wallpaper
  const [isRenderMode, setIsRenderMode] = useState(false);
  const [renderConfig, setRenderConfig] = useState<UserConfig | null>(null);

  // Main App State - Simulating Multi-Page Router
  const [view, setView] = useState<'home' | 'create' | 'install' | 'concept' | 'about' | 'auth'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Auth State
  const [user, setUser] = useState<{id: string, name: string, email: string} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);


  // --- Initial Load Logic (Render Mode or Verification) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. Wallpaper Render Logic
    if (params.get('render') === 'true') {
      setIsRenderMode(true);
      const loadedConfig = deserializeConfig(params);
      setRenderConfig(loadedConfig);

      // Daily Quote Logic: If quoteType is active but text is empty, fetch it.
      if (loadedConfig.quoteType !== 'none' && !loadedConfig.customQuoteText && loadedConfig.quoteTag) {
        // We use a self-executing async function inside the effect
        (async () => {
           const newQuote = await generateQuote(
             loadedConfig.quoteType === 'quote' ? 'quote' : 'quran', 
             loadedConfig.quoteTag
           );
           setRenderConfig(prev => prev ? ({ ...prev, customQuoteText: newQuote }) : null);
        })();
      }
    }

    // 2. Email Verification Logic
    const verifyToken = params.get('verify_token');
    if (verifyToken) {
       verifyUserEmail(verifyToken);
    }

  }, []);

  const verifyUserEmail = async (token: string) => {
      setVerifying(true);
      try {
          const res = await fetch('http://localhost:3001/api/auth/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
          });
          const data = await res.json();
          if (res.ok && data.success) {
              setVerificationStatus('success');
              setUser(data.user);
              // Clean URL
              window.history.replaceState({}, document.title, window.location.pathname);
          } else {
              setVerificationStatus('error');
          }
      } catch (e) {
          setVerificationStatus('error');
      } finally {
          setVerifying(false);
      }
  };

  const [config, setConfig] = useState<UserConfig>({
    birthDate: '2000-01-01',
    mode: Mode.YEAR,
    themeId: 0, // Default to Paper White
    shape: DotShape.SQUARE,
    quoteType: 'none',
    quoteTag: '',
    customQuoteText: '',
    phoneModel: '',
  });

  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  // New state for manual vs daily
  const [isDailyMode, setIsDailyMode] = useState(false);
  
  // Slider State
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const activeTheme = isRenderMode && renderConfig 
    ? THEMES[renderConfig.themeId] || THEMES[0]
    : THEMES[config.themeId] || THEMES[0];

  // If in Render Mode, return only the wallpaper content
  if (isRenderMode && renderConfig) {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <WallpaperContent config={renderConfig} theme={activeTheme} standalone />
      </div>
    );
  }

  // --- Main Application Logic ---

  const handleFetchQuote = async () => {
    if (!config.quoteTag) return;
    setIsGeneratingQuote(true);
    const text = await generateQuote(config.quoteType === 'quote' ? 'quote' : 'quran', config.quoteTag);
    setConfig(prev => ({ ...prev, customQuoteText: text }));
    setIsGeneratingQuote(false);
    setIsDailyMode(false); // If manually generated, we turn off auto-daily unless user re-enables
  };

  const generateUrl = async () => {
    const baseUrl = window.location.origin + window.location.pathname;
    
    // If Daily Mode is active, we intentionally clear the text so the render logic fetches it
    const configToSerialize = isDailyMode ? { ...config, customQuoteText: '' } : config;
    
    const query = serializeConfig(configToSerialize);
    const url = `${baseUrl}?render=true&${query}`;
    setGeneratedUrl(url);
    navigator.clipboard.writeText(url);

    // If user is logged in, save their configuration to the database
    if (user) {
        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:3001/api/user/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    phone_model: config.phoneModel,
                    mode: config.mode,
                    theme_name: THEMES[config.themeId].name,
                    daily_update_time_wallpaper: "00:01", // Default time as per instructions
                    link_generate_time: new Date(),
                    dot_style: config.shape,
                    inspiration: config.quoteType
                })
            });
            if (!res.ok) throw new Error('Failed to save');
        } catch (e) {
            console.warn("Could not save config to backend (likely offline).", e);
        } finally {
            setIsSaving(false);
        }
    }
  };

  const navigateTo = (newView: typeof view) => {
    window.scrollTo(0, 0);
    setView(newView);
  };

  const handleStartCreating = () => {
    if (user) {
      navigateTo('create');
    } else {
      setAuthMode('signup');
      setView('auth');
    }
  };

  // Helper for Quote Slider
  const sampleQuotes = [
      { text: "The obstacle is the way.", author: "Ryan Holiday", type: "Stoic" },
      { text: "Indeed, with hardship comes ease.", author: "Quran 94:6", type: "Verse" },
      { text: "We suffer more often in imagination than in reality.", author: "Seneca", type: "Stoic" },
      { text: "Focus on the process, not the outcome.", author: "James Clear", type: "Productivity" },
      { text: "So remember Me; I will remember you.", author: "Quran 2:152", type: "Verse" }
  ];

  const nextQuote = () => setCurrentQuoteIndex((prev) => (prev + 1) % sampleQuotes.length);
  const prevQuote = () => setCurrentQuoteIndex((prev) => (prev - 1 + sampleQuotes.length) % sampleQuotes.length);

  // Helper to get specific themes by name
  const showcaseThemes = ['Baked Earth', 'Rouge', 'Matcha', 'Deep Space', 'Paper White']
    .map(name => THEMES.find(t => t.name === name))
    .filter(Boolean) as typeof THEMES;

  if (view === 'concept') return <ConceptPage onBack={() => setView('home')} />;
  if (view === 'about') return <AboutDevPage onBack={() => setView('home')} />;
  if (view === 'auth') return (
    <AuthPage 
        initialMode={authMode}
        onBack={() => setView('home')} 
        onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setView('create');
        }}
    />
  );

  // --- SUB-PAGES ---

  const renderHome = () => (
    <div className="animate-in fade-in duration-500">
      
      {/* Global Notification: Verification */}
      {verifying && (
         <div className="fixed top-0 left-0 w-full z-50 bg-yellow-50 text-yellow-800 p-2 text-center text-sm font-medium">
             Verifying your email...
         </div>
      )}
      {verificationStatus === 'success' && !verifying && (
          <div className="fixed top-24 right-6 z-50 bg-green-50 text-green-800 p-4 rounded-xl border border-green-100 shadow-lg animate-in fade-in slide-in-from-right">
              <div className="flex items-center gap-2">
                 <Check size={18} />
                 <span>Email verified! You are now logged in.</span>
              </div>
          </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 min-h-[90vh] flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200 mb-8">
                <span className="text-xs font-semibold text-gray-900 tracking-wide uppercase">v2.1 — New Themes Available</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95] text-black">
                Visualize<br/>
                <span className="text-gray-400">Time.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-light">
                Minimalist, data-driven wallpapers for your lock screen. 
                Turn every glance at your phone into a moment of reflection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleStartCreating} className="bg-black text-white font-medium px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                  Create Wallpaper <ArrowRight size={16} />
                </button>
                <button onClick={() => navigateTo('install')} className="px-8 py-4 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  Installation Guide
                </button>
              </div>
            </div>
            
            <div className="relative flex justify-center lg:justify-end">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl -z-10 opacity-50"></div>
               <PhonePreview config={config} theme={activeTheme} />
            </div>
          </div>
      </section>

      {/* 2. Zero Friction (No App) */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-black mb-4">
                    <CloudOff size={32} />
                 </div>
                 <h2 className="text-4xl font-bold tracking-tight">No App. No Download. <br/>Just a URL.</h2>
                 <p className="text-lg text-gray-500 leading-relaxed">
                    Apps clutter your home screen and drain your battery. Dostdots is different. 
                    It lives in the cloud and updates your wallpaper natively using your phone's built-in automation tools.
                 </p>
                 <ul className="space-y-4 pt-4">
                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                       <Battery size={20} className="text-emerald-500" />
                       Zero battery drain (Passive updates)
                    </li>
                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                       <Zap size={20} className="text-emerald-500" />
                       Set it once, forget it forever
                    </li>
                 </ul>
              </div>
              <div className="flex-1 flex justify-center">
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-sm w-full">
                      <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                          <Globe size={20} className="text-gray-400" />
                          <div className="h-2 w-32 bg-gray-100 rounded-full"></div>
                      </div>
                      <div className="space-y-4">
                          <div className="h-4 w-3/4 bg-gray-100 rounded-full"></div>
                          <div className="h-4 w-1/2 bg-gray-100 rounded-full"></div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 mt-6">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black shadow-sm">
                                  <Link size={20} />
                              </div>
                              <div className="flex-1">
                                  <div className="h-2 w-20 bg-gray-200 rounded-full mb-2"></div>
                                  <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Top Features Grid */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Why Dostdots?</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Designed for Focus.</h2>
                <p className="text-gray-500 text-lg">
                   More than just a pretty background. A complete productivity system for your lock screen.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Activity, title: "Memento Mori", desc: "Visualize your life progress in weeks. A subtle reminder that time is ticking." },
                  { icon: Brain, title: "AI Integration", desc: "Connects with Google Gemini to generate fresh, context-aware motivation daily." },
                  { icon: Palette, title: "Deep Customization", desc: "Over 15+ professionally curated themes and 8+ icon shapes to match your aesthetic." },
                  { icon: RefreshCw, title: "Auto-Updates", desc: "Wakes up with you. Your wallpaper refreshes every morning with new data." },
                ].map((feature, i) => (
                   <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-black mb-6 group-hover:scale-110 transition-transform">
                         <feature.icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                   </div>
                ))}
             </div>
          </div>
      </section>

      {/* 4. Visual Showcase (Themes & Shapes) */}
      <section className="py-24 bg-black text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 to-black z-0"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h2 className="text-4xl md:text-5xl font-bold mb-4">Unapologetically <br/> Aesthetic.</h2>
                   <p className="text-gray-400 text-lg max-w-md">
                      Over 15+ professionally designed themes. Choose a style that fits your device.
                   </p>
                </div>
                <button onClick={handleStartCreating} className="text-white border-b border-white pb-1 hover:opacity-70 transition-opacity">
                   Explore all 15+ themes &rarr;
                </button>
             </div>

             {/* Theme Palette Grid - Specific 5 Themes */}
             <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-24">
                {showcaseThemes.map((theme, idx) => (
                   <div key={idx} className="group cursor-default">
                      <div className="aspect-[3/4] rounded-2xl mb-4 relative overflow-hidden border border-white/10 transition-transform duration-500 group-hover:-translate-y-2" style={{ backgroundColor: theme.bg }}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                             <div className="grid grid-cols-4 gap-2">
                                {[...Array(12)].map((_, i) => (
                                   <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < 4 ? theme.accent : theme.dots }}></div>
                                ))}
                             </div>
                          </div>
                      </div>
                      <h4 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{theme.name}</h4>
                   </div>
                ))}
             </div>

             {/* Professional Dot Style Grid */}
             <div className="border-t border-white/10 pt-16">
                <h3 className="text-2xl font-bold mb-10 text-center md:text-left">Select your dot style.</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {[
                      { type: DotShape.SQUARE, label: 'Square', icon: <div className="w-6 h-6 bg-white"></div> },
                      { type: DotShape.CIRCLE, label: 'Circle', icon: <div className="w-6 h-6 bg-white rounded-full"></div> },
                      { type: DotShape.ROUNDED, label: 'Rounded', icon: <div className="w-6 h-6 bg-white rounded-md"></div> },
                      { type: DotShape.STAR, label: 'Star', icon: <Star size={24} fill="white" /> },
                      { type: DotShape.FIRE, label: 'Fire', icon: <Sparkles size={24} fill="white" /> },
                      { type: DotShape.DOLLAR, label: 'Hustle', icon: <DollarSign size={24} strokeWidth={3} /> },
                      { type: DotShape.CHECK, label: 'Done', icon: <Check size={24} strokeWidth={4} /> },
                      { type: DotShape.CROSS, label: 'Minimal', icon: <X size={24} strokeWidth={3} /> },
                    ].map((dot, i) => (
                       <div key={i} className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="opacity-90">{dot.icon}</div>
                          <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">{dot.label}</span>
                       </div>
                    ))}
                </div>
             </div>
          </div>
      </section>

      {/* 5. AI Inspiration Section with Slider */}
      <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                 <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                       <Brain size={14} />
                       Powered by Gemini AI
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-gray-900">Wisdom on Autopilot.</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                       Don't just count the days—make them count. Configure Dostdots to fetch a daily quote or Quran verse based on your chosen topic.
                    </p>
                    
                    <div className="space-y-6">
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gray-900">
                             <Quote size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900">Stoic & Modern Quotes</h4>
                             <p className="text-sm text-gray-500 mt-1">"Focus", "Discipline", "Coding". You pick the tag, AI finds the wisdom.</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gray-900">
                             <BookOpen size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900">Quran Verses</h4>
                             <p className="text-sm text-gray-500 mt-1">Start your day with spiritual reflection tailored to your mood.</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Quote Slider */}
                 <div className="relative">
                    <div className="absolute -top-10 -right-10 w-full h-full bg-gray-200 rounded-3xl -rotate-6 opacity-50 z-0"></div>
                    
                    <div className="relative z-10 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[300px] flex flex-col justify-between transition-all">
                        
                        <div className="flex-1 flex flex-col justify-center">
                           <div className="flex justify-center mb-6">
                              <Sparkles className="text-amber-400 fill-amber-400" size={32} />
                           </div>
                           <p className="text-2xl md:text-3xl font-serif text-center text-gray-800 leading-snug mb-6 transition-all duration-300 key={currentQuoteIndex}">
                              "{sampleQuotes[currentQuoteIndex].text}"
                           </p>
                           <div className="flex justify-center items-center gap-2 text-sm text-gray-400 uppercase tracking-widest font-medium">
                              <span>{sampleQuotes[currentQuoteIndex].type}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>{sampleQuotes[currentQuoteIndex].author}</span>
                           </div>
                        </div>

                        {/* Slider Controls */}
                        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-50">
                            <button onClick={prevQuote} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
                               <ChevronLeft size={20} />
                            </button>
                            <div className="flex gap-2 items-center">
                               {sampleQuotes.map((_, i) => (
                                 <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentQuoteIndex ? 'bg-black scale-125' : 'bg-gray-200'}`} />
                               ))}
                            </div>
                            <button onClick={nextQuote} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
                               <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8">Your life in dots.</h2>
            <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
               Join thousands of focused individuals who use Dostdots to reclaim their attention.
            </p>
            <button onClick={handleStartCreating} className="bg-black text-white text-lg font-bold px-10 py-5 rounded-2xl hover:bg-gray-800 transition-all hover:scale-105 shadow-xl shadow-black/20">
               Start Designing Now
            </button>
         </div>
      </section>
    </div>
  );

  const renderCreate = () => (
      <section className="py-12 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h2 className="text-4xl font-bold mb-2 tracking-tight">Configuration</h2>
                <p className="text-gray-500 font-light text-lg">Design your personal dashboard.</p>
            </div>
            <button onClick={() => navigateTo('install')} className="text-sm font-medium text-blue-600 hover:underline">
                Need help installing? &rarr;
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Device Selection - NEW */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Device Model</label>
                <div className="flex gap-2">
                    <div className="w-12 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                        <Smartphone size={20} />
                    </div>
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder="e.g. iPhone 15 Pro, Pixel 8"
                            value={config.phoneModel}
                            onChange={(e) => setConfig({...config, phoneModel: e.target.value})}
                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-900 font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                        />
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 px-1">We use this to optimize the wallpaper resolution for your specific screen.</p>
              </div>

              {/* Mode Selection */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block">Visualization Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: Mode.LIFE, icon: Activity, label: 'Life' },
                    { id: Mode.YEAR, icon: Calendar, label: 'Year' },
                    { id: Mode.HARD75, icon: Target, label: '75 Hard' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setConfig({ ...config, mode: m.id })}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                        config.mode === m.id 
                        ? 'bg-black text-white border-black shadow-lg shadow-black/20 transform scale-[1.02]' 
                        : 'bg-white border-gray-100 hover:border-gray-300 text-gray-500'
                      }`}
                    >
                      <m.icon size={20} strokeWidth={1.5} />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs based on Mode */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                {config.mode === Mode.LIFE && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Date of Birth</label>
                    <input 
                      type="date" 
                      value={config.birthDate}
                      onChange={(e) => setConfig({...config, birthDate: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-900 font-mono focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                  </div>
                )}
                
                {(config.mode === Mode.YEAR || config.mode === Mode.HARD75) && (
                   <div>
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Dot Style</label>
                     <div className="flex flex-wrap gap-3">
                        {[DotShape.SQUARE, DotShape.ROUNDED, DotShape.CIRCLE, DotShape.DOLLAR, DotShape.FIRE, DotShape.CROSS, DotShape.CHECK, DotShape.STAR].map(shape => (
                          <button
                            key={shape}
                            onClick={() => setConfig({...config, shape})}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${config.shape === shape ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}
                          >
                             {shape === DotShape.FIRE && <div className="scale-75"><Sparkles size={20} /></div>}
                             {shape === DotShape.DOLLAR && <span className="font-mono text-lg">$</span>}
                             {shape === DotShape.CROSS && <div className="scale-75"><X size={20} /></div>}
                             {shape === DotShape.CHECK && <div className="scale-75"><Check size={20} /></div>}
                             {shape === DotShape.STAR && <div className="scale-75"><Star size={20} fill={config.shape === shape ? "white" : "none"} /></div>}
                             {shape === DotShape.SQUARE && <div className="w-4 h-4 bg-current" />}
                             {shape === DotShape.CIRCLE && <div className="w-4 h-4 bg-current rounded-full" />}
                             {shape === DotShape.ROUNDED && <div className="w-4 h-4 bg-current rounded-sm" />}
                          </button>
                        ))}
                     </div>
                   </div>
                )}
              </div>

              {/* Motivation */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block flex items-center gap-2">
                   Inspiration
                </label>
                
                <div className="flex p-1 bg-gray-50 rounded-xl mb-6">
                    {['none', 'quote', 'quran'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => setConfig({...config, quoteType: type as any, customQuoteText: ''})}
                            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg capitalize transition-all ${config.quoteType === type ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {config.quoteType !== 'none' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <input 
                            type="text" 
                            placeholder={config.quoteType === 'quote' ? "Topic: e.g. Focus, Code, Stoicism" : "Topic: e.g. Patience, Gratitude"}
                            value={config.quoteTag}
                            onChange={(e) => setConfig({...config, quoteTag: e.target.value})}
                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                        />
                        
                        <div className="flex gap-2">
                          <button 
                              onClick={handleFetchQuote}
                              disabled={!config.quoteTag || isGeneratingQuote}
                              className="flex-1 py-4 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                          >
                              {isGeneratingQuote ? "Generating..." : "Preview Now"}
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2 px-1">
                             <input 
                               type="checkbox" 
                               id="dailyMode"
                               checked={isDailyMode}
                               onChange={(e) => setIsDailyMode(e.target.checked)}
                               className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                             />
                             <label htmlFor="dailyMode" className="text-xs text-gray-600 font-medium select-none cursor-pointer">
                                Update daily (Generates new text every request)
                             </label>
                        </div>
                    </div>
                )}
              </div>

               {/* New Themes UI */}
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block">Theme</label>
                <div className="grid grid-cols-2 gap-4">
                    {THEMES.map((theme, idx) => (
                        <button
                            key={idx}
                            onClick={() => setConfig({...config, themeId: idx})}
                            className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                              config.themeId === idx 
                                ? 'ring-2 ring-black ring-offset-2 scale-[1.02] shadow-md' 
                                : 'hover:scale-[1.02] hover:shadow-md border-gray-100'
                            }`}
                        >
                            {/* Wallpaper Swatch Preview */}
                            <div className="h-20 w-full relative flex items-center justify-center gap-2" style={{ backgroundColor: theme.bg }}>
                               <div className="flex gap-1.5 opacity-100">
                                   <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: theme.accent }}></div>
                                   <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: theme.current, transform: 'scale(1.2)', boxShadow: '0 0 4px rgba(0,0,0,0.1)' }}></div>
                                   <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: theme.dots }}></div>
                               </div>
                            </div>
                            {/* Theme Label */}
                            <div className="p-3 bg-white border-t border-gray-50 flex justify-between items-center">
                                <span className={`text-xs font-bold uppercase tracking-wide ${config.themeId === idx ? 'text-black' : 'text-gray-500'}`}>
                                  {theme.name}
                                </span>
                                {config.themeId === idx && <Check size={12} className="text-black" />}
                            </div>
                        </button>
                    ))}
                </div>
              </div>

            </div>

            {/* Preview Area */}
            <div className="lg:col-span-7 relative">
               <div className="sticky top-28">
                  <div className="flex justify-center mb-12">
                    <PhonePreview config={config} theme={activeTheme} />
                  </div>
                  
                  {/* Action Area */}
                  <div className="max-w-[360px] mx-auto space-y-4">
                     <button 
                        className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                        onClick={generateUrl}
                        disabled={isSaving}
                     >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Link size={20} />}
                        Copy Wallpaper URL
                     </button>
                     {generatedUrl && (
                        <div className="bg-emerald-50 text-emerald-900 px-4 py-3 rounded-xl border border-emerald-100 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                            <Check size={16} className="text-emerald-600" /> 
                            <span className="text-xs font-medium">Copied to clipboard {user && user.id !== 'demo-user-id' && '& config saved'}</span>
                        </div>
                     )}
                     <p className="text-xs text-center text-gray-400 leading-relaxed max-w-xs mx-auto">
                        Copy the URL, then go to the <button onClick={() => navigateTo('install')} className="underline text-gray-600 hover:text-black">Installation Page</button> to set up automation.
                     </p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <nav className="border-b border-gray-100 sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Grip size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">dostdots</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500 mr-4">
                <button onClick={() => setView('about')} className="hover:text-black transition-colors">About</button>
                <button onClick={() => setView('concept')} className="hover:text-black transition-colors">Concept</button>
                <button onClick={handleStartCreating} className={`transition-colors ${view === 'create' ? 'text-black font-semibold' : 'hover:text-black'}`}>Create</button>
                <button onClick={() => navigateTo('install')} className={`transition-colors ${view === 'install' ? 'text-black font-semibold' : 'hover:text-black'}`}>Install</button>
            </div>
            
            {/* Auth Button */}
            {user ? (
    <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
        <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-bold">{user.name}</span>
            <span className="text-[10px] text-gray-400">{user.email}</span>
        </div>

        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <User size={16} />
        </div>

        <button 
            onClick={() => {
                setUser(null);          // clear user
                setAuthMode('login');   // default to login
                setView('home');        // navigate to Auth.tsx
            }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
        >
            <LogOut size={16} />
        </button>
    </div>
) : (
    <button 
        onClick={() => {
            setAuthMode('login');
            setView('auth');
        }}
        className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
    >
        Sign In
    </button>
)}

          </div>
        </div>
      </nav>

      {/* View Router */}
      {view === 'home' && renderHome()}
      {view === 'create' && renderCreate()}
      {view === 'install' && <Installation onGoToCreate={handleStartCreating} />}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16 text-center bg-gray-50/50">
         <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} dostdots. Built by Umair.
         </p>
      </footer>
    </div>
  );
};

export default App;