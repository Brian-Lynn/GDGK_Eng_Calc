import React, { useState, useMemo } from 'react';
import { SCALING_DATASETS, ScalingSubject } from '../constants';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  ReferenceDot, 
  Area, 
  ComposedChart, 
  ReferenceArea
} from 'recharts';

const SUBJECT_COLORS: Record<ScalingSubject, string> = {
  "化学": "#f472b6", // pink-400
  "生物": "#34d399", // emerald-400
  "政治": "#ef4444", // red-500
  "地理": "#6366f1"  // indigo-500
};

// Grade zones defined by Scaled Score ranges
const GRADE_ZONES = [
  { label: 'E', min: 30, max: 40.5, color: '#cbd5e1', textColor: '#475569', desc: '最后 2%' }, 
  { label: 'D', min: 40.5, max: 58.5, color: '#fecaca', textColor: '#dc2626', desc: '后 13%' }, 
  { label: 'C', min: 58.5, max: 70.5, color: '#fde68a', textColor: '#d97706', desc: '中 35%' }, 
  { label: 'B', min: 70.5, max: 82.5, color: '#bae6fd', textColor: '#0284c7', desc: '次 35%' }, 
  { label: 'A', min: 82.5, max: 100, color: '#bbf7d0', textColor: '#16a34a', desc: '前 15%' }, 
];

// Helper to calculate percentile (0-100, where 100 is top) based on score
const scoreToPercentile = (score: number) => {
  if (score >= 82.5) return 85 + ((score - 82.5) / 17.5) * 15;
  if (score >= 70.5) return 50 + ((score - 70.5) / 12) * 35;
  if (score >= 58.5) return 15 + ((score - 58.5) / 12) * 35;
  if (score >= 40.5) return 2 + ((score - 40.5) / 18) * 13;
  return 0 + ((score - 30) / 10.5) * 2;
};

// Helper to calculate scaled score using the selected dataset
const calculateScaledScore = (
    subject: ScalingSubject, 
    rawScoreStr: string, 
    dataset: Record<ScalingSubject, number[][]>
): number => {
  const raw = parseInt(rawScoreStr);
  if (isNaN(raw)) return 0;

  const subjectData = dataset[subject];
  if (!subjectData || subjectData.length === 0) return 30; // Fallback

  const exact = subjectData.find(pair => pair[0] === raw);
  if (exact) return exact[1];

  let maxRaw = -1;
  let minRaw = 101;
  let maxScaled = 30;
  let minScaled = 30;

  for (const [r, s] of subjectData) {
      if (r > maxRaw) { maxRaw = r; maxScaled = s; }
      if (r < minRaw) { minRaw = r; minScaled = s; }
  }

  if (raw > maxRaw) return maxScaled;
  if (raw < minRaw) return minScaled;

  let closest = subjectData[0];
  let minDiff = Math.abs(raw - closest[0]);
  
  for (const pair of subjectData) {
      const diff = Math.abs(raw - pair[0]);
      if (diff < minDiff) {
          minDiff = diff;
          closest = pair;
      }
  }
  
  return closest[1];
};

const SingleSubjectChart = ({ 
  subject, 
  inputRawScore, 
  chartData,
  mode
}: { 
  subject: ScalingSubject, 
  inputRawScore: string,
  chartData: any[],
  mode: 'score' | 'rank'
}) => {
  const rawScoreVal = parseInt(inputRawScore);
  const hasInputScore = !isNaN(rawScoreVal);
  
  // Find the data point for the user's input
  const inputPoint = hasInputScore ? chartData.find(d => d.raw === rawScoreVal) : null;
  const inputScore = inputPoint ? inputPoint[subject] : 0;
  
  // Determine X coordinate for the user dot based on mode
  const dotX = mode === 'score' 
    ? rawScoreVal 
    : (inputPoint ? inputPoint[`${subject}_rank`] : 0);

  const color = SUBJECT_COLORS[subject];

  // Axis Configurations
  const xAxisConfig = useMemo(() => {
    if (mode === 'score') {
      return {
        dataKey: 'raw',
        label: '原始分 (卷面)',
        domain: [0, 100],
        ticks: [0, 20, 40, 60, 80, 100],
        unit: ''
      };
    } else {
      return {
        dataKey: `${subject}_rank`,
        label: '位次 (累计百分比)',
        domain: [0, 100],
        ticks: [0, 20, 40, 60, 80, 100], // Uniform ticks for Rank mode
        unit: '%'
      };
    }
  }, [mode, subject]);

  return (
    <div className="h-64 sm:h-72 w-full relative select-none mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={chartData} 
          margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
        >
           <defs>
              <linearGradient id={`gradient-${subject}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.6}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>

          {/* Grade Zones Background - Always Y-Axis (Score) based */}
          {GRADE_ZONES.map((zone) => (
             <ReferenceArea 
                key={zone.label}
                y1={zone.min} 
                y2={zone.max} 
                fill={zone.color} 
                fillOpacity={0.3}
                stroke="none"
                label={({ viewBox }) => (
                  <text 
                    x={viewBox.x + viewBox.width - 10} 
                    y={viewBox.y + viewBox.height / 2} 
                    dy={5}
                    textAnchor="end" 
                    fill={zone.textColor} 
                    fontSize={14} 
                    fontWeight={900} 
                    opacity={0.5}
                  >
                    {zone.label}
                  </text>
                )}
             />
          ))}
          
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
          
          <XAxis 
              type="number"
              dataKey={xAxisConfig.dataKey} 
              domain={xAxisConfig.domain} 
              ticks={xAxisConfig.ticks}
              tick={{fontSize: 10, fill: '#64748b'}}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              label={{ value: xAxisConfig.label, position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94a3b8' }}
          />

          <YAxis 
              domain={[30, 100]} 
              ticks={[30, 40.5, 58.5, 70.5, 82.5, 100]} 
              tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}}
              width={30}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              label={{ value: '等级赋分', position: 'insideTopLeft', offset: 10, fontSize: 10, fill: '#94a3b8' }}
          />
          
          <Tooltip 
              cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const score = data[subject];
                      const rank = data[`${subject}_rank`];
                      
                      const title = mode === 'score' 
                        ? `原始分: ${label}` 
                        : `位次: 前 ${Number(label).toFixed(1)}%`;

                      return (
                          <div 
                            className="backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-3 min-w-[120px]"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                          >
                             <div className="text-xs text-slate-500 mb-2 font-medium border-b border-slate-200/50 pb-1">
                                {title}
                             </div>
                             <div className="space-y-1">
                                 <div className="flex items-center justify-between gap-3 text-sm font-bold" style={{ color }}>
                                     <span>赋分:</span>
                                     <span className="text-lg leading-none">{score}</span>
                                 </div>
                                 <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                                     <span>排位:</span>
                                     <span>前 {rank.toFixed(1)}%</span>
                                 </div>
                             </div>
                          </div>
                      );
                  }
                  return null;
              }}
          />

          {/* Main Curve */}
          <Area 
              type="monotone" 
              dataKey={subject} 
              stroke={color} 
              strokeWidth={3}
              fill={`url(#gradient-${subject})`} 
              isAnimationActive={false}
              activeDot={{ r: 4, strokeWidth: 0 }} 
          />

          {/* Zone Lines */}
          {GRADE_ZONES.map((zone) => (
              <ReferenceLine 
                key={`line-${zone.label}`} 
                y={zone.min} 
                stroke={zone.textColor} 
                strokeDasharray="2 2" 
                strokeWidth={1}
                strokeOpacity={0.4}
              />
          ))}

          {/* User Position Dot */}
          {hasInputScore && (
              <>
               <ReferenceDot 
                  x={dotX} 
                  y={inputScore} 
                  r={6} 
                  fill="#fff" 
                  stroke={color} 
                  strokeWidth={3} 
               />
               <ReferenceArea 
                  x1={dotX} x2={dotX}
                  y1={inputScore} y2={inputScore}
               >
                 <text 
                    x={dotX} 
                    y={inputScore} 
                    dy={-15}
                    fill={color} 
                    textAnchor="middle" 
                    fontSize={12} 
                    fontWeight="bold"
                    style={{ textShadow: '0px 2px 4px rgba(255,255,255,0.8)' }}
                 >
                    {inputScore}
                 </text>
               </ReferenceArea>
              </>
          )}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const SubjectScaler: React.FC = () => {
  const datasetKeys = Object.keys(SCALING_DATASETS);
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>(datasetKeys[0]);
  const [yAxisMode, setYAxisMode] = useState<'score' | 'rank'>('score');

  const [selectedSubjects, setSelectedSubjects] = useState<Record<ScalingSubject, boolean>>({
    "化学": false,
    "生物": false,
    "政治": false,
    "地理": false
  });

  const [scores, setScores] = useState<Record<ScalingSubject, string>>({
    "化学": "",
    "生物": "",
    "政治": "",
    "地理": ""
  });

  const handleSubjectToggle = (subject: ScalingSubject) => {
    setSelectedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
  };

  const handleScoreChange = (subject: ScalingSubject, value: string) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 100)) {
       setScores(prev => ({ ...prev, [subject]: value }));
    }
  };

  const activeSubjects = (Object.keys(SUBJECT_COLORS) as ScalingSubject[]).filter(s => selectedSubjects[s]);
  const currentDataset = SCALING_DATASETS[selectedDatasetKey];

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 100; i++) {
      const point: any = { raw: i };
      activeSubjects.forEach(sub => {
        const score = calculateScaledScore(sub, i.toString(), currentDataset);
        point[sub] = score;
        point[`${sub}_rank`] = scoreToPercentile(score);
      });
      data.push(point);
    }
    return data;
  }, [activeSubjects, currentDataset]);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6">
      
      {/* Top Controls Grid - Optimized for Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        
        {/* Dataset Selector */}
        <div className="md:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex items-center justify-between gap-2">
             <div className="flex items-center gap-2 overflow-hidden">
               <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
               </span>
               <div className="min-w-0 flex-1">
                 <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Database</div>
                 <div className="font-bold text-slate-700 text-xs truncate">{selectedDatasetKey.split(' ')[0]}</div>
               </div>
            </div>
            <select 
                value={selectedDatasetKey}
                onChange={(e) => setSelectedDatasetKey(e.target.value)}
                className="w-24 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none"
            >
                {datasetKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                ))}
            </select>
        </div>

        {/* View Mode Toggle */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex items-center gap-1">
            <button
                onClick={() => setYAxisMode('score')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    yAxisMode === 'score'
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                <span>分数模式</span>
            </button>
            <button
                onClick={() => setYAxisMode('rank')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    yAxisMode === 'rank'
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                <span>排位模式</span>
            </button>
        </div>

        {/* Subject Selection */}
        <div className="md:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="hidden md:flex items-center gap-1 text-slate-400 text-xs font-bold uppercase shrink-0">
               <span>Subjects</span>
            </div>
            <div className="flex flex-1 justify-between md:justify-end gap-2 w-full">
                {(Object.keys(SUBJECT_COLORS) as ScalingSubject[]).map(sub => (
                    <button
                        key={sub}
                        onClick={() => handleSubjectToggle(sub)}
                        className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            selectedSubjects[sub] 
                            ? `bg-slate-800 text-white border-slate-800 shadow-md transform scale-105` 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        {sub}
                    </button>
                ))}
            </div>
        </div>

      </div>

      {/* Inputs & Results Grid */}
      {activeSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {activeSubjects.map(sub => {
                const raw = scores[sub];
                const scaled = raw ? calculateScaledScore(sub, raw, currentDataset) : '-';
                const color = SUBJECT_COLORS[sub];

                return (
                    <div key={sub} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-base sm:text-lg text-slate-700 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: color }}></span>
                                {sub}
                            </h3>
                            <div className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-400 font-mono">
                                {currentDataset === SCALING_DATASETS[datasetKeys[0]] ? '2026.12' : 'Unknown'}
                            </div>
                        </div>
                        
                        <div className="p-4 flex items-center gap-4 border-b border-slate-100 border-dashed relative z-10">
                             <div className="flex-1">
                                <label className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">原始分</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={raw}
                                        placeholder="0"
                                        onChange={(e) => handleScoreChange(sub, e.target.value)}
                                        className="w-full text-2xl font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-slate-200"
                                    />
                                    <span className="absolute right-3 top-2 text-xs text-slate-300 pointer-events-none">/100</span>
                                </div>
                             </div>
                             <div className="text-slate-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                             </div>
                             <div className="flex-1 text-right">
                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">等级赋分</div>
                                <div className="text-4xl font-black tracking-tight flex items-baseline justify-end gap-1" style={{ color: color }}>
                                    {scaled}
                                    <span className="text-sm font-bold text-slate-300 opacity-50">分</span>
                                </div>
                             </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 p-2 bg-gradient-to-b from-slate-50/50 to-white">
                            <SingleSubjectChart 
                              subject={sub} 
                              inputRawScore={raw}
                              chartData={chartData}
                              mode={yAxisMode}
                            />
                        </div>
                    </div>
                );
            })}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
             <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
             </div>
             <p className="font-bold text-sm">请先在上方勾选科目</p>
             <p className="text-xs opacity-70 mt-1">Select subjects to begin</p>
          </div>
      )}
    </div>
  );
};

export default SubjectScaler;