import React, { useState } from 'react';
import EnglishCalc from './components/EnglishCalc';
import SubjectScaler from './components/SubjectScaler';

type Tab = 'english' | 'scaler';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('english');

  const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );

  const FooterSignature = (
    <div className="text-center py-4 lg:hidden">
       <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span>Designed by</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600 transition-colors">
                <span>0xbean</span>
                <GithubIcon className="w-3.5 h-3.5" />
            </a>
       </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col w-full bg-[#f8fafc]">
      {/* Header - Fixed */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 flex-none">
        <div className="container mx-auto px-4 h-auto py-2 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
                <div className="bg-blue-500 text-white p-1 rounded-lg flex items-center justify-center w-8 h-8 shrink-0 shadow-sm">
                <span className="font-serif font-semibold italic text-lg leading-none" style={{ fontFamily: "'Times New Roman', serif" }}>ƒ</span>
                </div>
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-700">GD Calc Suite</h1>
            </div>
            
             <div className="text-xs sm:text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg site-signature whitespace-nowrap flex sm:hidden items-center gap-2">
                <span>v1.9.0</span>
                <GithubIcon className="w-4 h-4" />
             </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
             <button 
                onClick={() => setCurrentTab('english')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                    currentTab === 'english' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                🇬🇧 英语听说
             </button>
             <button 
                onClick={() => setCurrentTab('scaler')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                    currentTab === 'scaler' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                📊 选科赋分
             </button>
          </div>
          
          <div className="hidden sm:flex text-xs sm:text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg site-signature whitespace-nowrap items-center gap-2">
             <span>v1.9.0 by</span>
             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600 transition-colors">
                <span>0xbean</span>
                <GithubIcon className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col p-0 lg:p-6 lg:container lg:mx-auto lg:overflow-visible overflow-hidden relative">
        <div className="flex-1 overflow-y-auto no-scrollbar lg:overflow-visible">
            {currentTab === 'english' ? <EnglishCalc /> : <div className="p-3 lg:p-0"><SubjectScaler /></div>}
            
            {/* Footer Signature for Mobile (inside scroll view) */}
            {FooterSignature}
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