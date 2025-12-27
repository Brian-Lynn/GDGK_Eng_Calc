import React, { useState, useMemo } from 'react';
import InputRow from './InputRow';
import ScoreChart from './ScoreChart';
import { INITIAL_VALUES, QuestionType, QUESTIONS } from '../constants';

const EnglishCalc: React.FC = () => {
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

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 w-full">
        {/* === MOBILE LAYOUT === */}
        <div className="flex-none z-10 p-3 pb-0 bg-[#f8fafc] lg:hidden">
           {ScoreCard}
        </div>
        <div className="flex-1 lg:hidden p-3 space-y-3 pb-8">
           {InputsList}
           {ChartCard}
           {ResetButton}
        </div>

        {/* === DESKTOP LAYOUT === */}
        <div className="hidden lg:block lg:col-span-8 lg:overflow-visible">
          {InputsList}
        </div>
        <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-4">
           {ScoreCard}
           {ChartCard}
           {ResetButton}
        </div>
    </div>
  );
};

export default EnglishCalc;