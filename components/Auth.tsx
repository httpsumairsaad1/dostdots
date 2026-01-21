import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  X,
  Smartphone,
  Circle,
  Square,
  Hexagon,
  Triangle,
  Star,
  Zap,
  Activity,
  Box,
  Disc,
  Target,
  AlertCircle,
  Send
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (userData: { id: string, name: string, email: string }) => void;
  onBack: () => void;
}

const BackgroundPattern = () => {
  const icons = [
    Circle, Square, Hexagon, Triangle, Star, Zap, Activity, Box, Disc, Target,
    Circle, Square, Star, Smartphone, Activity, Box, Circle, Square
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 flex flex-wrap content-start opacity-10">
      {Array.from({ length: 96 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        const size = i % 3 === 0 ? 32 : i % 2 === 0 ? 24 : 16;
        const rotation = (i * 45) % 360;
        const opacity = Math.max(0.2, (i % 10) / 10);
        
        return (
          <div 
            key={i} 
            className="w-24 h-24 flex items-center justify-center transform transition-all duration-1000 hover:scale-110"
          >
            <Icon 
              size={size} 
              className="text-black" 
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                opacity: opacity 
              }} 
            />
          </div>
        );
      })}
    </div>
  );
};

// Replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; 

const API_URL = 'http://localhost:3001/api';

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onLoginSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'verify_pending'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Initialize Google Sign-In
  useEffect(() => {
    // Check if script is loaded
    const initializeGoogle = () => {
        if ((window as any).google && (window as any).google.accounts) {
            try {
                (window as any).google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleResponse
                });
                
                // Render the button
                const buttonDiv = document.getElementById("googleBtn");
                if (buttonDiv) {
                    (window as any).google.accounts.id.renderButton(
                        buttonDiv,
                        { theme: "outline", size: "large", width: "100%", text: "continue_with" } 
                    );
                }
            } catch (e) {
                console.error("Google Auth Init Error:", e);
            }
        }
    };

    // If script is already loaded
    if ((window as any).google) {
        initializeGoogle();
    } else {
        // Wait a bit or could listen to load event if we controlled script tag injection directly here
        const interval = setInterval(() => {
            if ((window as any).google) {
                initializeGoogle();
                clearInterval(interval);
            }
        }, 500);
        return () => clearInterval(interval);
    }
  }, [mode]); // Re-run if mode changes (to re-render button if component re-mounts)

  const handleGoogleResponse = async (response: any) => {
      setIsLoading(true);
      setError('');
      try {
          // Send JWT token to backend
          const res = await fetch(`${API_URL}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: response.credential })
          });
          
          const data = await res.json();
          if (res.ok) {
              onLoginSuccess(data.user);
          } else {
             throw new Error(data.error || "Google Login failed");
          }
      } catch (e: any) {
          console.error("Google Auth Error", e);
          setError(e.message || "Google Login failed. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
    const payload = mode === 'login' ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Check for Verification Requirement
      if (mode === 'signup' && data.requireVerification) {
        setMode('verify_pending');
        setIsLoading(false);
        return;
      }

      // Handle Verification Pending on Login
      if (mode === 'login' && data.notVerified) {
         setError("Please check your email to verify your account first.");
         setIsLoading(false);
         return;
      }

      // Success Login
      onLoginSuccess(data.user);
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'Something went wrong. Is the server running?');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
  };

  // --- Render Verification Pending Screen ---
  if (mode === 'verify_pending') {
      return (
        <div className="min-h-screen bg-white text-gray-900 font-sans relative flex items-center justify-center p-4">
           <BackgroundPattern />
           <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2.5rem] p-10 text-center animate-in fade-in slide-in-from-bottom-4">
              
              <button 
                 onClick={() => setMode('login')} 
                 className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                 Back to Login
              </button>
           </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <BackgroundPattern />

      <div className="absolute top-6 left-6 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <X size={20} />
        </button>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-8 md:p-10 overflow-hidden">
           
           {/* Header */}
           <div className="text-center mb-8">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/20">
                <Smartphone size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                {mode === 'login' ? 'Welcome back.' : 'Join dostdots.'}
              </h2>
              <p className="text-gray-500">
                {mode === 'login' ? 'Visualize your progress.' : 'Start your visual journey today.'}
              </p>
           </div>

           {/* Google Login Container */}
           

           

           {error && (
             <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-xs animate-in fade-in">
                <AlertCircle size={16} />
                <span>{error}</span>
             </div>
           )}

           {/* Form */}
           <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-200 font-medium placeholder:text-gray-400"
                    />
                </div>
              )}

              <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-200 font-medium placeholder:text-gray-400"
                  />
              </div>

              <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 text-gray-900 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-200 font-medium placeholder:text-gray-400"
                  />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
           </form>

           {/* Footer */}
           <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={toggleMode}
                  className="text-black font-bold hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
           </div>
        </div>
        
        {/* Simple Terms */}
        <p className="text-center text-[10px] text-gray-400 mt-6 max-w-xs mx-auto">
          By continuing, you agree to Dostdots' Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;