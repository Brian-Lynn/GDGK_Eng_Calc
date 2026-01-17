import React, { useState, useEffect } from 'react';
import EnglishCalc from './components/EnglishCalc';
import SubjectScaler from './components/SubjectScaler';
// Import images so the bundler handles the hashing automatically
// @ts-ignore
import LightIcon from './assets/light_pixel_1f1f1f_180px.png';
// @ts-ignore
import DarkIcon from './assets/dark_pixel_1f1f1f_180px.png';

type PageView = 'home' | 'english' | 'scaler';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [imgError, setImgError] = useState(false);

  // Dynamic Favicon Handling
  useEffect(() => {
    const updateFavicon = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // If image failed to load in UI, fall back to LightIcon or keep existing logic
      const iconUrl = isDark ? DarkIcon : LightIcon;
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      // Only update if changed to avoid flickering
      if (link.href !== window.location.origin + iconUrl && link.href !== iconUrl) {
          link.href = iconUrl;
      }
    };

    // Initial set
    updateFavicon();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateFavicon);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateFavicon);
      }
    };
  }, []);

  // Icons
  const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );

  const HomeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );

  // --- Landing Page Component ---
  const LandingPage = () => (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Decorative Background Elements - Fixed Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100/50 to-slate-50"></div>
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute top-[20%] left-[-20px] w-32 h-32 bg-purple-200/20 rounded-full blur-2xl"></div>
        </div>

        {/* Scrollable Content Layer */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden z-10 relative">
            <div className="container mx-auto px-6 py-12 flex flex-col min-h-full max-w-lg lg:max-w-4xl">
                {/* Header / Profile */}
                <div className="mb-12 text-center lg:text-left">
                    {/* Updated Logo using Image with Fallback */}
                    {!imgError ? (
                        <img 
                          src={LightIcon} 
                          alt="0xbean Logo" 
                          className="inline-block w-20 h-20 rounded-2xl shadow-sm border border-slate-100 mb-4 bg-white p-0.5"
                          onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-sm border border-slate-100 mb-4 bg-white text-3xl">
                            👋
                        </div>
                    )}
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight mb-2">0xbean's Toolbox</h1>
                    <p className="text-slate-500 text-sm lg:text-base">
                        Personal utility collection for GD Gaokao & more.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1 lg:flex-none mb-8">
                    {/* Tool 1 */}
                    <button 
                        onClick={() => setCurrentView('english')}
                        className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <span className="text-lg">🇬🇧</span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 mb-1">英语听说/赋分计算器</h2>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                支持广东高考英语合成计算，包含听说成绩折算、排位预估与等级评定。
                            </p>
                            <div className="flex items-center text-xs font-bold text-blue-500 mt-auto">
                                <span>Open Tool</span>
                                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </button>

                    {/* Tool 2 */}
                    <button 
                        onClick={() => setCurrentView('scaler')}
                        className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <span className="text-lg">📊</span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 mb-1">选科赋分计算器</h2>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                基于历史数据的选科赋分换算，支持分数/排位双向查询与可视化图表。
                            </p>
                            <div className="flex items-center text-xs font-bold text-indigo-500 mt-auto">
                                <span>Open Tool</span>
                                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-auto py-6 text-center text-xs text-slate-400 font-mono">
                    <div className="flex items-center justify-center gap-2">
                        <span>Designed & Developed by</span>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-600 font-bold hover:text-black transition-colors">
                            <span>0xbean</span>
                            <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // --- Main Render ---

  // If in Home view, render Landing Page
  if (currentView === 'home') {
    return <LandingPage />;
  }

  // Otherwise, render the Tool Interface
  return (
    <div className="h-full flex flex-col w-full bg-[#f8fafc] overflow-hidden">
      {/* Header - Fixed */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 flex-none">
        <div className="container mx-auto px-4 h-auto py-2 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          
          <div className="flex items-center w-full sm:w-auto gap-3">
             {/* Home Button */}
             <button 
                onClick={() => setCurrentView('home')}
                className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Back to Home"
             >
                <HomeIcon className="w-5 h-5" />
             </button>

             <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2">
                {/* Updated Header Logo with fallback */}
                {!imgError ? (
                     <img 
                        src={LightIcon} 
                        className="w-8 h-8 rounded-lg shadow-sm bg-white border border-slate-100" 
                        alt="Logo" 
                        onError={() => setImgError(true)}
                     />
                ) : (
                    <span className="text-xl">👋</span>
                )}
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-700">GD Calc Suite</h1>
            </div>
          </div>

          {/* Navigation Tabs (Tool Switcher) */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
             <button 
                onClick={() => setCurrentView('english')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                    currentView === 'english' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                🇬🇧 英语听说
             </button>
             <button 
                onClick={() => setCurrentView('scaler')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                    currentView === 'scaler' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                📊 选科赋分
             </button>
          </div>
          
          {/* Desktop Signature */}
          <div className="hidden sm:flex text-xs sm:text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg site-signature whitespace-nowrap items-center gap-2">
             <span>by</span>
             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600 transition-colors">
                <span>0xbean</span>
             </a>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col p-0 lg:p-6 lg:container lg:mx-auto lg:overflow-visible overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar lg:overflow-visible">
            {currentView === 'english' ? <EnglishCalc /> : <div className="p-3 lg:p-0"><SubjectScaler /></div>}
            
            {/* Footer Signature for Mobile (inside scroll view) */}
            <div className="text-center py-4 lg:hidden">
               <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Designed by</span>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600 transition-colors">
                        <span>0xbean</span>
                        <GithubIcon className="w-3.5 h-3.5" />
                    </a>
               </div>
            </div>
        </div>

        {/* Footer for Desktop */}
        <footer className="hidden lg:block mt-8 py-8 text-center text-slate-400 text-base font-mono border-t border-slate-200">
          <div className="flex items-center justify-center gap-2">
            <span>Developed by</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 font-bold hover:underline cursor-pointer transition-colors ml-1">
                <span>0xbean</span>
                <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;