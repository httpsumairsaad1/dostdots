import React, { useState } from 'react';
import { Smartphone, Check, ArrowRight, ArrowLeft, Apple, Smartphone as AndroidIcon, Maximize, Crop, Zap } from 'lucide-react';

type Platform = 'ios' | 'android' | null;
type Model = 'modern' | 'classic' | null; // Modern = FaceID/Pixel, Classic = TouchID
type Layout = 'minimal' | 'detailed' | null;

interface InstallationProps {
    onGoToCreate: () => void;
}

const Installation: React.FC<InstallationProps> = ({ onGoToCreate }) => {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform>(null);
  const [model, setModel] = useState<Model>(null);
  const [layout, setLayout] = useState<Layout>(null);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderSelectionButton = (
    label: string, 
    icon: React.ReactNode, 
    isActive: boolean, 
    onClick: () => void,
    description?: string
  ) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${
            isActive 
            ? 'border-black bg-black text-white shadow-xl shadow-black/20' 
            : 'border-gray-100 bg-white hover:border-gray-300 text-gray-900'
        }`}
    >
        <div className="flex items-center justify-between mb-2">
            <div className={`${isActive ? 'text-white' : 'text-gray-900'}`}>{icon}</div>
            {isActive && <Check size={18} className="text-white" />}
        </div>
        <h3 className="font-bold text-lg">{label}</h3>
        {description && <p className={`text-sm mt-1 ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>{description}</p>}
    </button>
  );

  const renderProgress = () => (
      <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2">
              {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        step >= i ? 'w-8 bg-black' : 'w-2 bg-gray-200'
                    }`} 
                  />
              ))}
          </div>
      </div>
  );

  return (
    <div className="pt-12 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Installation Guide</h2>
        <p className="text-gray-500 text-lg font-light">Let's set up your device.</p>
      </div>

      {renderProgress()}

      <div className="transition-all duration-500">
          
          {/* STEP 1: PLATFORM */}
          {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-semibold mb-6 text-center">Which device do you use?</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderSelectionButton(
                        "iPhone", 
                        <Apple size={32} />, 
                        platform === 'ios', 
                        () => setPlatform('ios')
                    )}
                    {renderSelectionButton(
                        "Android", 
                        <AndroidIcon size={32} />, 
                        platform === 'android', 
                        () => setPlatform('android')
                    )}
                  </div>
                  <div className="mt-8 text-center">
                    <button 
                        disabled={!platform}
                        onClick={nextStep}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                    >
                        Next Step <ArrowRight size={16} />
                    </button>
                  </div>
              </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  
                  {/* Model */}
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">Select your model</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {renderSelectionButton(
                            platform === 'ios' ? "Modern (FaceID)" : "Pixel / Samsung",
                            <Maximize size={24} />,
                            model === 'modern',
                            () => setModel('modern'),
                            platform === 'ios' ? "iPhone X, 11, 12, 13, 14, 15+" : "Full screen devices"
                        )}
                        {renderSelectionButton(
                            platform === 'ios' ? "Classic (TouchID)" : "Other Android",
                            <Crop size={24} />,
                            model === 'classic',
                            () => setModel('classic'),
                            platform === 'ios' ? "iPhone SE, 8, 7" : "Standard ratio devices"
                        )}
                    </div>
                  </div>

                   {/* Layout */}
                   <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">Preferred Wallpaper Layout</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {renderSelectionButton(
                            "Lock Screen Focused",
                            <Smartphone size={24} />,
                            layout === 'minimal',
                            () => setLayout('minimal'),
                            "Clean, centered for visibility."
                        )}
                        {renderSelectionButton(
                            "Home Screen",
                            <Zap size={24} />,
                            layout === 'detailed',
                            () => setLayout('detailed'),
                            "Optimized for app grid visibility."
                        )}
                    </div>
                  </div>

                  <div className="mt-8 text-center flex justify-center gap-4">
                    <button 
                        onClick={prevStep}
                        className="px-6 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button 
                        disabled={!model || !layout}
                        onClick={nextStep}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                    >
                        Show Instructions <ArrowRight size={16} />
                    </button>
                  </div>
              </div>
          )}

          {/* STEP 3: GUIDE */}
          {step === 3 && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-gray-50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 relative">
                    
                    <button 
                        onClick={prevStep}
                        className="absolute top-8 left-8 text-gray-400 hover:text-black transition-colors"
                        title="Go Back"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    {platform === 'ios' ? (
                        <div className="space-y-12 mt-6">
                             <div className="text-center border-b border-gray-200 pb-8">
                                <h3 className="text-2xl font-bold mb-2">iOS Setup (Shortcuts)</h3>
                                <p className="text-gray-500">
                                    Uses standard iOS automation. No extra app required.
                                </p>
                             </div>

                             <div className="space-y-12 max-w-2xl mx-auto text-left">
                                
                                {/* Section 1: Create Automation */}
                                <div>
                                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm shrink-0">1</div>
                                        Create Automation
                                    </h4>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-gray-700 leading-relaxed space-y-3">
                                        <p>1. Open <strong>Shortcuts App</strong> &rarr; Go to <strong>Automation</strong> tab.</p>
                                        <p>2. Tap <strong>New Automation</strong> (+).</p>
                                        <p>3. Select <strong>Time of Day</strong> &rarr; Set to <strong>6:00 AM</strong> (or any time).</p>
                                        <p>4. Select <strong>Daily</strong>.</p>
                                        <p>5. Select <strong>Run Immediately</strong>. <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded ml-2">IMPORTANT</span></p>
                                        <p>6. Select <strong>New Blank Automation</strong> (or Create New Shortcut).</p>
                                    </div>
                                </div>

                                {/* Section 2: Actions */}
                                <div>
                                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm shrink-0">2</div>
                                        Add Actions
                                    </h4>
                                    
                                    <div className="space-y-6">
                                        {/* Action 2.1 */}
                                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase text-gray-500 rounded-bl-xl">Action 1</div>
                                            <h5 className="font-bold text-gray-900 mb-3 text-lg">Get Contents of URL</h5>
                                            <p className="text-gray-600 mb-4">
                                                Search for "Get Contents of URL" and add it. Paste your generated URL there:
                                            </p>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-xs break-all text-gray-500 mb-4">
                                                {/* Placeholder to indicate where the URL goes */}
                                                https://dostdots... (Your Generated URL)
                                            </div>
                                             <button 
                                                onClick={onGoToCreate}
                                                className="text-xs font-bold uppercase tracking-wide text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                Don't have a URL? Go Create one <ArrowRight size={12} />
                                            </button>
                                        </div>

                                        {/* Action 2.2 */}
                                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase text-gray-500 rounded-bl-xl">Action 2</div>
                                            <h5 className="font-bold text-gray-900 mb-3 text-lg">Set Wallpaper Photo</h5>
                                            <ul className="space-y-3 text-gray-600">
                                                <li className="flex items-start gap-2">
                                                    <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                                                    <span>Search "Set Wallpaper Photo" and add it.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                                                    <span>Choose <strong>Lock Screen</strong> as the target.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Check size={18} className="text-red-500 mt-0.5 shrink-0" />
                                                    <span>
                                                        <strong>CRITICAL:</strong> Tap the arrow (&gt;) on the action card.
                                                        <br/>
                                                        Disable <span className="font-semibold text-black">Show Preview</span>.
                                                        <br/>
                                                        Disable <span className="font-semibold text-black">Crop to Subject</span>.
                                                    </span>
                                                </li>
                                            </ul>
                                            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg leading-relaxed">
                                                Disabling "Show Preview" is required for automation to run without asking you for permission every morning.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 mt-6">
                             <div className="text-center border-b border-gray-200 pb-8">
                                <h3 className="text-2xl font-bold mb-2">Android Setup (MacroDroid)</h3>
                                <p className="text-gray-500">
                                    Automate your wallpaper updates using MacroDroid.
                                </p>
                             </div>

                             <div className="space-y-10 max-w-2xl mx-auto text-left">
                                    
                                    {/* Prereq */}
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">Prerequisites</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                Install <strong>MacroDroid</strong> from the Google Play Store.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Macro Setup */}
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">Setup Macro</h4>
                                            <ul className="space-y-3 text-sm text-gray-600">
                                                <li className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span>Open MacroDroid &rarr; <strong>Add Macro</strong></span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span><strong>Trigger:</strong> Date/Time &rarr; Day/Time &rarr; Set time to <strong>00:01:00</strong> &rarr; Activate all weekdays.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                                        <div className="w-full">
                                            <h4 className="font-bold text-lg mb-4">Configure Actions</h4>
                                            
                                            {/* Action 1 */}
                                            <div className="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm">
                                                <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">4.1 Download Image</h5>
                                                <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside marker:text-emerald-500">
                                                    <li>Go to <strong>Web Interactions</strong> &rarr; <strong>HTTP Request</strong></li>
                                                    <li><strong>Request method:</strong> GET</li>
                                                    <li><strong>URL:</strong> Paste the URL you generated in the app.</li>
                                                    <li><strong>Enable:</strong> Block next actions until complete</li>
                                                    <li><strong>Response:</strong> Tick "Save HTTP response to file"</li>
                                                    <li><strong>Folder & filename:</strong> <code>/Download/life.png</code></li>
                                                </ul>
                                                <button 
                                                    onClick={onGoToCreate}
                                                    className="mt-4 text-xs font-bold uppercase tracking-wide text-emerald-600 hover:underline"
                                                >
                                                    Don't have a URL? Go Create one
                                                </button>
                                            </div>

                                            {/* Action 2 */}
                                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">4.2 Set Wallpaper</h5>
                                                <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside marker:text-emerald-500">
                                                    <li>Go to <strong>Device Settings</strong> &rarr; <strong>Set Wallpaper</strong></li>
                                                    <li>Select <strong>Image</strong> and choose Lock Screen / Home Screen.</li>
                                                    <li><strong>Enter folder & filename:</strong> <code>/Download/life.png</code></li>
                                                </ul>
                                            </div>
                                            
                                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                                                <strong>Important:</strong> Use the exact same folder and filename (e.g. <code>/Download/life.png</code>) in both actions.
                                            </div>
                                        </div>
                                    </div>
                             </div>
                        </div>
                    )}
               </div>
          )}

      </div>
    </div>
  );
};

export default Installation;