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
  ReferenceArea,
  Line
} from 'recharts';

const SUBJECT_COLORS: Record<ScalingSubject, string> = {
  "化学": "#f472b6", // pink-400
  "生物": "#34d399", // emerald-400
  "政治": "#ef4444", // red-500
  "地理": "#6366f1"  // indigo-500
};

// Enhanced visibility for grade zones
const GRADE_ZONES = [
  { label: 'E', min: 30, max: 40.5, color: '#cbd5e1', textColor: '#475569' }, // Darker Slate for E
  { label: 'D', min: 40.5, max: 58.5, color: '#fecaca', textColor: '#dc2626' }, // Darker Red for D
  { label: 'C', min: 58.5, max: 70.5, color: '#fde68a', textColor: '#d97706' }, // Darker Amber for C
  { label: 'B', min: 70.5, max: 82.5, color: '#bae6fd', textColor: '#0284c7' }, // Darker Sky for B
  { label: 'A', min: 82.5, max: 100, color: '#bbf7d0', textColor: '#16a34a' }, // Darker Green for A
];

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

  // 1. Try exact lookup
  const exact = subjectData.find(pair => pair[0] === raw);
  if (exact) return exact[1];

  // 2. Handle missing points by finding the closest defined points
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
  chartData 
}: { 
  subject: ScalingSubject, 
  inputRawScore: string,
  chartData: any[]
}) => {
  const [hoverData, setHoverData] = useState<{ raw: number, scaled: number } | null>(null);
  
  const rawScoreVal = parseInt(inputRawScore);
  const hasInputScore = !isNaN(rawScoreVal);
  
  const inputPoint = hasInputScore ? chartData.find(d => d.raw === rawScoreVal) : null;
  const inputScaledVal = inputPoint ? inputPoint[subject] : 0;
  
  const color = SUBJECT_COLORS[subject];

  const handleMouseMove = (state: any) => {
    if (state.activePayload && state.activePayload.length > 0) {
      const point = state.activePayload[0].payload;
      setHoverData({ raw: point.raw, scaled: point[subject] });
    }
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div className="h-64 sm:h-80 w-full relative select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={chartData} 
          // Removed large right margin to maximize space
          margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
           <defs>
              <linearGradient id={`gradient-${subject}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>

          {/* Grade Zones Background */}
          {GRADE_ZONES.map((zone) => (
             <ReferenceArea 
                key={zone.label}
                yAxisId="left"
                y1={zone.min} 
                y2={zone.max} 
                fill={zone.color} 
                fillOpacity={0.4}
                stroke="none"
             >
             </ReferenceArea>
          ))}
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.5} />
          
          <XAxis 
              dataKey="raw" 
              type="number" 
              domain={[0, 100]} 
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tick={{fontSize: 10, fill: '#475569', fontWeight: 600}}
              axisLine={{ stroke: '#94a3b8' }}
              label={{ value: '卷面分 (原始分)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }}
          />
          <YAxis 
              yAxisId="left"
              domain={[30, 100]} 
              ticks={[30, 40, 50, 60, 70, 80, 90, 100]} 
              tick={{fontSize: 10, fill: '#475569', fontWeight: 600}}
              width={30}
              axisLine={{ stroke: '#94a3b8' }}
              label={{ value: '等级分', position: 'insideTopLeft', offset: 10, fontSize: 10, fill: '#64748b' }}
          />
          {/* Secondary YAxis for Population Percentage - Adjusted width/margin */}
          <YAxis 
              yAxisId="right"
              orientation="right"
              type="number"
              domain={[30, 100]} 
              ticks={[30, 40.5, 58.5, 70.5, 82.5, 100]}
              tickFormatter={(val) => {
                 if (val === 100) return 'Top';
                 if (val === 82.5) return '15%';
                 if (val === 70.5) return '50%';
                 if (val === 58.5) return '85%';
                 if (val === 40.5) return '98%';
                 if (val === 30) return '100%';
                 return '';
              }}
              width={35}
              axisLine={{ stroke: '#94a3b8', strokeOpacity: 0.3 }}
              tick={{fontSize: 9, fill: '#64748b', fontWeight: 600}}
              tickLine={false}
          />
          
          {/* Tooltip with restored vertical cursor */}
          <Tooltip 
              cursor={{ stroke: '#475569', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.95)' }}
              itemStyle={{ color: color, fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontSize: '12px' }}
              formatter={(value: number, name: string) => {
                  if (name === subject) return [`${value} 分`, '赋分后'];
                  return []; // Hide dummy line
              }}
              labelFormatter={(label) => `原始分: ${label}`}
          />

          <Area 
              yAxisId="left"
              type="monotone" 
              dataKey={subject} 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#gradient-${subject})`} 
              isAnimationActive={false}
              activeDot={{ r: 0 }} 
          />

          {/* Dummy Line to force Right Axis rendering */}
          <Line 
            yAxisId="right"
            dataKey={subject} 
            stroke="none" 
            dot={false} 
            activeDot={false} 
            isAnimationActive={false}
            legendType="none"
          />

          {/* Stronger Grade Zone Dividers */}
          {GRADE_ZONES.map((zone) => (
              <ReferenceLine 
                yAxisId="left"
                key={`line-${zone.label}`} 
                y={zone.min} 
                stroke={zone.textColor} 
                strokeDasharray="0" 
                strokeWidth={1.5}
                strokeOpacity={0.5}
                label={{ 
                    position: 'insideRight', 
                    value: zone.label, 
                    fill: zone.textColor, 
                    fontSize: 18, 
                    fontWeight: 900,
                    opacity: 0.8,
                    dx: -10 
                }} 
              />
          ))}

          {/* User Input Marker (Point Only) */}
          {hasInputScore && (
              <>
               <ReferenceDot 
                  yAxisId="left"
                  x={rawScoreVal} 
                  y={inputScaledVal} 
                  r={6} 
                  fill="#fff" 
                  stroke={color} 
                  strokeWidth={3} 
               />
               <ReferenceArea 
                  yAxisId="left"
                  x1={rawScoreVal > 50 ? rawScoreVal - 15 : rawScoreVal} 
                  x2={rawScoreVal > 50 ? rawScoreVal : rawScoreVal + 15}
                  y1={inputScaledVal > 60 ? inputScaledVal - 10 : inputScaledVal} 
                  y2={inputScaledVal > 60 ? inputScaledVal : inputScaledVal + 10}
                  fill="transparent"
                  stroke="none"
               >
                 <text 
                    x={rawScoreVal > 50 ? rawScoreVal - 6 : rawScoreVal + 6} 
                    y={inputScaledVal > 60 ? inputScaledVal - 6 : inputScaledVal + 12} 
                    fill={color} 
                    textAnchor={rawScoreVal > 50 ? "end" : "start"} 
                    fontSize={12} 
                    fontWeight="bold"
                    style={{ textShadow: '0px 0px 4px white' }}
                 >
                    你在这里 ({inputScaledVal})
                 </text>
               </ReferenceArea>
              </>
          )}

          {/* Custom Horizontal Crosshair Line + Dot */}
          {hoverData && (
            <>
                {/* Horizontal line (Vertical handled by Tooltip) */}
                <ReferenceLine 
                    yAxisId="left"
                    y={hoverData.scaled} 
                    stroke="#475569" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.5}
                    ifOverflow="extendDomain"
                    label={{ 
                        position: 'left', 
                        value: hoverData.scaled.toString(), 
                        fill: '#475569', 
                        fontSize: 10, 
                        fontWeight: 'bold',
                        dy: -5
                    }}
                />
                <ReferenceDot 
                    yAxisId="left"
                    x={hoverData.raw} 
                    y={hoverData.scaled} 
                    r={5} 
                    fill={color} 
                    stroke="#475569" 
                    strokeWidth={2} 
                    ifOverflow="extendDomain"
                />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const SubjectScaler: React.FC = () => {
  // Dataset Selection State
  const datasetKeys = Object.keys(SCALING_DATASETS);
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<string>(datasetKeys[0]);

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

  // Global Chart Data Generation based on selected dataset
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 100; i++) {
      const point: any = { raw: i };
      activeSubjects.forEach(sub => {
        point[sub] = calculateScaledScore(sub, i.toString(), currentDataset);
      });
      data.push(point);
    }
    return data;
  }, [activeSubjects, currentDataset]);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Controls Grid: Dataset & Subjects combined on one row for desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Dataset Selector */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-3">
             <div className="flex items-center gap-3 overflow-hidden">
               <span className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
               </span>
               <div className="min-w-0">
                 <h2 className="font-bold text-slate-700 text-sm truncate">赋分数据库</h2>
                 <p className="text-xs text-slate-400 truncate">当前: {selectedDatasetKey.split(' ')[0]}</p>
               </div>
            </div>
            <select 
                value={selectedDatasetKey}
                onChange={(e) => setSelectedDatasetKey(e.target.value)}
                className="w-32 sm:w-48 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none transition-all"
            >
                {datasetKeys.map(key => (
                    <option key={key} value={key}>{key}</option>
                ))}
            </select>
        </div>

        {/* Subject Selection */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4">
            <h2 className="hidden sm:flex font-bold text-slate-700 text-sm items-center gap-2 shrink-0">
                <span className="w-1.5 h-4 rounded-full bg-slate-400"></span>
                科目
            </h2>
            <div className="flex flex-1 justify-between sm:justify-start gap-2 sm:gap-3">
                {(Object.keys(SUBJECT_COLORS) as ScalingSubject[]).map(sub => (
                    <button
                        key={sub}
                        onClick={() => handleSubjectToggle(sub)}
                        className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeSubjects.map(sub => {
                const raw = scores[sub];
                const scaled = raw ? calculateScaledScore(sub, raw, currentDataset) : '-';
                const color = SUBJECT_COLORS[sub];

                return (
                    <div key={sub} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ background: color }}></span>
                                {sub}
                            </h3>
                        </div>
                        
                        <div className="p-4 flex items-center gap-4 border-b border-slate-100 border-dashed">
                             <div className="flex-1">
                                <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">原始分</label>
                                <input 
                                    type="number" 
                                    value={raw}
                                    placeholder="0-100"
                                    onChange={(e) => handleScoreChange(sub, e.target.value)}
                                    className="w-full text-2xl font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                />
                             </div>
                             <div className="text-slate-300">➔</div>
                             <div className="flex-1 text-right">
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">赋分后</div>
                                <div className="text-4xl font-black tracking-tight" style={{ color: color }}>
                                    {scaled}
                                </div>
                             </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 p-2 bg-slate-50/30">
                            <SingleSubjectChart 
                              subject={sub} 
                              inputRawScore={raw}
                              chartData={chartData}
                            />
                        </div>
                    </div>
                );
            })}
          </div>
      ) : (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
             <p>请先在上方勾选您的选考科目</p>
          </div>
      )}
    </div>
  );
};

export default SubjectScaler;