import React, { useState, useMemo } from 'react';
import InputRow from './components/InputRow';
import ScoreChart from './components/ScoreChart';
import { INITIAL_VALUES, QuestionType, QUESTIONS } from './constants';

function App() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const updateValue = (type: QuestionType, val: number) => {
    setValues(prev => ({ ...prev, [type]: val }));
  };

  const resetCalculator = () => {
    setValues({
        reading: 0,
        seven: 0,
        cloze: 0,
        grammar: 0,
        shortWriting: 0,
        longWriting: 0,
        listening: 0
    });
  };

  // Calculation Logic
  const results = useMemo(() => {
    const rScore = values.reading * QUESTIONS.reading.pointsPerQuestion;
    const sScore = values.seven * QUESTIONS.seven.pointsPerQuestion;
    const cScore = values.cloze * QUESTIONS.cloze.pointsPerQuestion;
    const gScore = values.grammar * QUESTIONS.grammar.pointsPerQuestion;
    const swScore = values.shortWriting;
    const lwScore = values.longWriting;
    const lScore = values.listening;

    const objScore = rScore + sScore + cScore + gScore;
    const subjScore = swScore + lwScore;
    
    const rawWritten = objScore + subjScore;
    const multiplier = 13 / 12; 
    const convertedWritten = rawWritten * multiplier;
    const final = convertedWritten + lScore;

    return {
      rawWritten,
      convertedWritten,
      final,
      chartData: {
        r: rScore * multiplier,
        s: sScore * multiplier,
        c: cScore * multiplier,
        g: gScore * multiplier,
        sw: swScore * multiplier,
        lw: lwScore * multiplier,
        l: lScore
      }
    };
  }, [values]);

  const getScoreBadge = (score: number) => {
    if (score >= 138) return { text: "😮 你难道是.....xubot?", class: "bg-purple-100 text-purple-800" };
    if (score >= 130) return { text: "👑 Top Tier", class: "bg-green-100 text-green-700" };
    if (score >= 120) return { text: "⭐ 非常优秀", class: "bg-cyan-100 text-cyan-700" };
    if (score >= 100) return { text: "👍 平均水平", class: "bg-blue-100 text-blue-700" };
    if (score >= 90) return { text: "💪 还得练", class: "bg-slate-300 text-slate-800" };
    return { text: " 🇨🇳 中国人不学洋语", class: "bg-red-200 text-red-800" };
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 130) return "text-green-600";
    if (score >= 120) return "text-cyan-600";
    if (score >= 100) return "text-blue-600";
    if (score >= 90) return "text-slate-800";
    return "text-red-600";
  };

  const badge = getScoreBadge(results.final);
  const scoreColor = getScoreColorClass(results.final);

  // --- Components Definition ---

  const ScoreCard = (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-emerald-400 to-red-400"></div>
      <div className="p-4 sm:p-6 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Score</span>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className={`text-6xl sm:text-7xl font-black tracking-tighter ${scoreColor}`}>
            {results.final.toFixed(2)}
          </span>
        </div>
        <div className="mt-3 flex justify-center">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.class}`}>
            {badge.text}
          </span>
        </div>
      </div>
      <div className="bg-slate-50 border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100">
        <div className="p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">卷面原始分</div>
          <div className="text-lg font-mono font-bold text-slate-700">
            {results.rawWritten.toFixed(1)}/120
          </div>
        </div>
        <div className="p-3 text-center bg-yellow-50/50">
          <div className="text-xs text-yellow-700 mb-1 font-bold">广东算法折算</div>
          <div className="text-lg font-mono font-bold text-yellow-600">
            {results.convertedWritten.toFixed(2)}/130
          </div>
        </div>
      </div>
    </div>
  );

  const InputsList = (
    <div className="space-y-3 lg:space-y-4">
        {/* Objective Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 sm:px-6 sm:py-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-700 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-blue-400"></span>
              客观题 (题数)
            </h2>
          </div>
          <div className="p-3 sm:p-6 grid grid-cols-1 gap-3 sm:gap-6">
            <InputRow type="reading" value={values.reading} onChange={updateValue} />
            <InputRow type="seven" value={values.seven} onChange={updateValue} />
            <InputRow type="cloze" value={values.cloze} onChange={updateValue} />
            <InputRow type="grammar" value={values.grammar} onChange={updateValue} />
          </div>
        </div>

        {/* Subjective Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 sm:px-6 sm:py-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-700 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-amber-400"></span>
              主观题 (分数)
            </h2>
          </div>
          <div className="p-3 sm:p-6 grid grid-cols-1 gap-3 sm:gap-6">
            <InputRow type="shortWriting" value={values.shortWriting} onChange={updateValue} />
            <InputRow type="longWriting" value={values.longWriting} onChange={updateValue} />
          </div>
        </div>

        {/* Listening */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 sm:px-6 sm:py-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-700 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-violet-400"></span>
              听说考试
            </h2>
          </div>
          <div className="p-3 sm:p-6">
             <InputRow type="listening" value={values.listening} onChange={updateValue} />
          </div>
        </div>
    </div>
  );

  const ChartCard = (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="mb-2 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">总分构成</span>
      </div>
      <ScoreChart data={results.chartData} />
    </div>
  );

  const ResetButton = (
    <button 
      className="w-full py-3 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-500 active:bg-slate-50 text-slate-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group" 
      onClick={resetCalculator}
    >
      <svg className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      重置
    </button>
  );

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
        <div className="container mx-auto px-4 h-12 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-1 rounded-lg flex items-center justify-center w-8 h-8 shrink-0 shadow-sm">
              <span className="font-serif font-semibold italic text-lg leading-none" style={{ fontFamily: "'Times New Roman', serif" }}>ƒ</span>
            </div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-700">GD English Calc</h1>
          </div>
          
          <div className="text-xs sm:text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg site-signature whitespace-nowrap flex items-center gap-2">
             <span>v1.9.0 by</span>
             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 font-bold hover:text-blue-600 transition-colors">
                <span>0xbean</span>
                <GithubIcon className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6 lg:container lg:mx-auto lg:overflow-visible overflow-hidden relative">
        
        {/* === MOBILE LAYOUT === */}
        
        {/* Top Part: Fixed Score Card */}
        <div className="flex-none z-10 p-3 pb-0 bg-[#f8fafc] lg:hidden">
           {ScoreCard}
        </div>

        {/* Bottom Part: Scrollable Inputs + Chart + Reset */}
        <div className="flex-1 overflow-y-auto no-scrollbar lg:hidden p-3 space-y-3 pb-8">
           {InputsList}
           {ChartCard}
           {ResetButton}
           {FooterSignature}
        </div>


        {/* === DESKTOP LAYOUT === */}

        {/* Left Column: Inputs */}
        <div className="hidden lg:block lg:col-span-8 lg:overflow-visible">
          {InputsList}
        </div>

        {/* Right Column: Sticky Score & Chart */}
        <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-4">
           {ScoreCard}
           {ChartCard}
           {ResetButton}
        </div>

        {/* Footer for Desktop */}
        <footer className="hidden lg:block col-span-12 mt-8 py-8 text-center text-slate-400 text-base font-mono border-t border-slate-200">
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