import React, { useState } from 'react';
import { ArrowLeft, Cpu, Heart, Code, Coffee } from 'lucide-react';

interface PageProps {
  onBack: () => void;
}

export const ConceptPage: React.FC<PageProps> = ({ onBack }) => (
  <div className="min-h-screen bg-white pt-24 px-6 pb-20 text-gray-900 font-sans">
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-medium mb-12 hover:text-black transition-colors">
        <ArrowLeft size={18} /> Back to Home
      </button>
      
      <h1 className="text-5xl md:text-6xl font-bold mb-12 tracking-tight">The Philosophy</h1>
      
      <div className="prose prose-lg prose-gray max-w-none">
        <p className="text-2xl font-light text-gray-600 leading-relaxed mb-12">
          Dostdots is built on the principle of <span className="text-black font-semibold">Memento Mori</span> and visual accountability. 
          By visualizing time as a finite grid of dots, we transform abstract time into tangible units.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 my-16">
           <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-black border border-gray-100">
                  <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Data Driven</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Inspired by GitHub contribution graphs. Your life is a commit history. Make every day green.
              </p>
           </div>
           <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-pink-500 border border-gray-100">
                  <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Mindful</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                A subtle, non-intrusive reminder on the device you check 100 times a day.
              </p>
           </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900">Why Wallpapers?</h2>
        <p className="text-gray-500 text-lg leading-relaxed">
           Widgets drain battery. Apps require active opening. Wallpapers are passive, always there, and zero-friction. 
           We use the native capabilities of iOS and Android to update your wallpaper in the background, keeping your battery healthy and your focus sharp.
        </p>
      </div>
    </div>
  </div>
);

export const AboutDevPage: React.FC<PageProps> = ({ onBack }) => (
  <div className="min-h-screen bg-white pt-24 px-6 pb-20 text-gray-900 font-sans">
    <div className="max-w-2xl mx-auto text-center">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-medium mb-16 hover:text-black transition-colors mx-auto">
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="w-32 h-32 bg-gray-50 rounded-full mx-auto mb-10 flex items-center justify-center border border-gray-100 shadow-sm">
         <Code size={40} className="text-gray-900" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Built by Umair</h1>
      <p className="text-xl text-gray-500 mb-12 font-light">Full Stack Developer & Minimalist Design Enthusiast</p>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 text-left space-y-6 shadow-sm">
         <div className="flex justify-between border-b border-gray-50 pb-4">
            <span className="text-gray-400 font-medium">Stack</span>
            <span className="text-gray-900 font-medium">React, Tailwind, Gemini AI</span>
         </div>
         <div className="flex justify-between border-b border-gray-50 pb-4">
            <span className="text-gray-400 font-medium">Mission</span>
            <span className="text-gray-900 font-medium">Simplify digital wellness</span>
         </div>
         <div className="flex justify-between pb-2">
            <span className="text-gray-400 font-medium">Contact</span>
            <span className="text-blue-600 font-medium">@umair_dev</span>
         </div>
      </div>

      <div className="mt-16 flex items-center justify-center gap-2 text-gray-400 text-sm">
         <Coffee size={16} />
         <span>Fueled by caffeine and clean code.</span>
      </div>
    </div>
  </div>
);