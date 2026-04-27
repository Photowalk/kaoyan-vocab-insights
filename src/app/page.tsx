"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Search, TrendingUp, Award, Clock, BookOpen, ChevronLeft, Quote, SearchX } from 'lucide-react';

interface WordData {
  word: string;
  count: number;
  tags: string[];
  yearly: Record<string, number>;
  sentences?: { year: string; text: string }[];
}

const tagColors: Record<string, string> = {
  "考研": "bg-indigo-50 text-indigo-600 border-indigo-100",
  "六级": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "托福": "bg-amber-50 text-amber-600 border-amber-100",
  "SAT": "bg-rose-50 text-rose-600 border-rose-100",
  "其他": "bg-slate-50 text-slate-500 border-slate-100"
};

const GOLD = "#B89323"; // Deepened gold for WCAG contrast

export default function KaoyanDashboard() {
  const [data, setData] = useState<WordData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setSelectedWord(d[0]);
        setLoading(false);
      });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    data.forEach(item => item.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [data, searchTerm, selectedTag]);

  const trendData = useMemo(() => {
    if (!selectedWord) return [];
    return Object.entries(selectedWord.yearly)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [selectedWord]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#FDFDFD]">
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-[3px] border-[#002147] border-t-transparent rounded-full"
        />
        <p className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400">Loading Lexicon</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-[#002147] selection:bg-[#B89323]/20 flex flex-col">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002147 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 md:px-12 md:py-10 flex flex-col flex-1">
        {/* Header */}
        <header className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-6 md:mb-10 border-b border-slate-100 pb-6 md:pb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-black mb-2 md:mb-3 tracking-tight">
              Kaoyan <span className="text-[#B89323]">Lexicon</span>
            </h1>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-8 h-[1px] bg-slate-200 hidden sm:block" />
              <p className="text-xs md:text-sm font-light tracking-[0.1em] uppercase">1997 – 2025 Analysis</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-6 md:gap-12">
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Lexicon Depth</p>
              <p className="text-2xl md:text-3xl font-serif font-bold italic">1.0k+</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-100 hidden sm:block" />
            <div className="px-5 py-2.5 md:px-6 md:py-3 bg-[#002147] text-white rounded-full text-xs md:text-sm font-medium shadow-xl shadow-blue-900/10">
              Data Driven
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Panel: Search & List */}
          <div className={`lg:col-span-4 flex flex-col lg:h-[calc(100vh-140px)] lg:sticky lg:top-8 space-y-4 md:space-y-6 ${isMobileDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
            <div className="space-y-4 flex-none">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#B89323] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query high-level vocabulary..."
                  className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#B89323]/5 focus:border-[#B89323]/30 transition-all shadow-sm text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider uppercase transition-all ${!selectedTag ? 'bg-[#002147] text-white shadow-lg shadow-blue-900/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider uppercase transition-all ${selectedTag === tag ? 'bg-[#B89323] text-white shadow-lg shadow-amber-600/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 md:pr-3 space-y-2 md:space-y-3 custom-scrollbar pb-6">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-4">
                  <SearchX className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-medium">No vocabulary found.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item) => (
                    <motion.div
                      key={item.word}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        setSelectedWord(item);
                        setIsMobileDetailOpen(true);
                      }}
                      className={`p-4 md:p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between group ${selectedWord?.word === item.word ? 'bg-white shadow-xl md:shadow-2xl shadow-slate-200 border border-[#B89323]/30 ring-1 ring-[#B89323]/10' : 'hover:bg-white hover:shadow-xl hover:shadow-slate-100 border border-transparent'}`}
                    >
                      <div className="space-y-1.5 md:space-y-2">
                        <h3 className={`text-base md:text-lg font-bold tracking-tight transition-colors ${selectedWord?.word === item.word ? 'text-[#002147]' : 'text-slate-600 group-hover:text-[#002147]'}`}>{item.word}</h3>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <span key={tag} className={`text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter border ${tagColors[tag] || tagColors['其他']}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl md:text-3xl font-black font-serif transition-colors leading-none ${selectedWord?.word === item.word ? 'text-[#B89323]' : 'text-[#002147]/80 group-hover:text-[#B89323]'}`}>{item.count}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Right Panel: Detail View */}
          <div className={`lg:col-span-8 pb-6 ${isMobileDetailOpen ? 'block' : 'hidden lg:block'}`}>
            <AnimatePresence mode="wait">
              {selectedWord ? (
                <motion.div 
                  key={selectedWord.word}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl md:rounded-[2rem] p-6 sm:p-10 md:p-14 shadow-2xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none">
                    <BookOpen className="w-32 h-32 md:w-64 md:h-64 -rotate-12" />
                  </div>

                  {/* Sticky Mobile Header */}
                  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md pb-4 pt-2 -mt-2 border-b border-slate-100 lg:hidden flex items-center justify-between mb-8">
                    <button 
                      onClick={() => setIsMobileDetailOpen(false)}
                      className="flex items-center gap-2 text-slate-500 hover:text-[#002147] transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="font-bold uppercase tracking-wider text-[11px]">Back</span>
                    </button>
                    <span className="font-serif font-black text-xl text-[#002147] capitalize">{selectedWord.word}</span>
                  </div>

                  <div className="flex flex-col xl:flex-row justify-between items-start mb-10 md:mb-16 gap-6 md:gap-8">
                    <div className="space-y-4 md:space-y-6">
                      <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-[#B89323]/10 text-[#B89323] rounded-xl border border-[#B89323]/20">
                        <Award className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Mastery Candidate</span>
                      </div>
                      <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-black capitalize tracking-tighter text-[#002147]">{selectedWord.word}</h2>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {selectedWord.tags.map(tag => (
                          <div key={tag} className={`flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full border shadow-sm ${tagColors[tag] || tagColors['其他']}`}>
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current opacity-40" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{tag} Level</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full xl:w-auto">
                      <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl text-center border border-slate-100">
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5 md:mb-2">Total Hits</p>
                        <p className="text-3xl md:text-4xl font-serif font-black">{selectedWord.count}</p>
                      </div>
                      <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl text-center border border-slate-100">
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5 md:mb-2">Years Active</p>
                        <p className="text-3xl md:text-4xl font-serif font-black">{Object.values(selectedWord.yearly).filter(c => c > 0).length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10 md:mb-16">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                      <div className="flex items-center gap-2 md:gap-3">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#B89323]" />
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400">Historical Distribution (1997–2025)</h4>
                      </div>
                    </div>
                    
                    <div className="h-[200px] md:h-[300px] w-full -ml-4 md:-ml-8" style={{ touchAction: 'pan-y' }}>
                      <ResponsiveContainer width="105%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={GOLD} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={GOLD} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f8fafc" />
                          <XAxis 
                            dataKey="year" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#cbd5e1', fontWeight: 600}}
                            interval={4}
                            padding={{ left: 10, right: 10 }}
                          />
                          <YAxis hide domain={[0, 'auto']} />
                          <Tooltip 
                            cursor={{ stroke: GOLD, strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '12px' }}
                            labelStyle={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}
                            itemStyle={{ color: '#002147', fontWeight: 900, fontSize: '16px' }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any) => [`${value ?? 0} occurrences`, 'Frequency']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke={GOLD} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorCount)" 
                            animationDuration={1500}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            label={(props: any) => {
                              const { x, y, value } = props;
                              if (!value) return null;
                              return (
                                <text x={x} y={y - 8} fill={GOLD} fontSize={10} fontWeight={800} textAnchor="middle">
                                  {value}
                                </text>
                              );
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {Object.entries(selectedWord.yearly)
                        .filter(([, count]) => count > 0)
                        .sort(([yearA], [yearB]) => yearA.localeCompare(yearB))
                        .map(([year, count]) => (
                          <div key={year} className="px-3 py-1.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-2 shadow-sm transition-colors hover:border-[#B89323]/30">
                            <span className="text-[10px] font-bold text-slate-400">{year}</span>
                            <span className="text-[11px] font-black text-[#B89323]">{count}次</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Context Sentences */}
                  {selectedWord.sentences && selectedWord.sentences.length > 0 && (
                    <div className="mb-10 md:mb-16">
                      <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                        <Quote className="w-4 h-4 md:w-5 md:h-5 text-[#B89323]" />
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-slate-400">Contextual Passages</h4>
                      </div>
                      <div className="space-y-4">
                        {selectedWord.sentences.map((s, idx) => (
                          <div key={idx} className="p-5 md:p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
                            <span className="inline-block px-2 py-1 bg-white rounded-md text-[10px] font-bold text-slate-400 mb-3 border border-slate-100 shadow-sm">{s.year}</span>
                            <p className="text-sm md:text-base leading-relaxed text-slate-700 font-serif" dangerouslySetInnerHTML={{__html: s.text.replace(new RegExp(`\\b${selectedWord.word}\\w*\\b`, 'gi'), match => `<strong class="text-[#002147] bg-[#B89323]/10 px-1 rounded">${match}</strong>`)}} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
                    <div className="group p-6 md:p-8 bg-[#002147]/[0.02] rounded-2xl md:rounded-[2rem] border border-slate-100 hover:border-[#B89323]/20 transition-colors">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-[10px] md:text-xs">01</div>
                        <h5 className="text-xs md:text-sm font-black uppercase tracking-widest">Academic Strategy</h5>
                      </div>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                        Recognized as a <span className="text-[#002147] font-semibold">Tier-1 Core Term</span>. Its presence across {selectedWord.tags.join(' & ')} indicates a fundamental concept that frequently anchors complex arguments in academic passages.
                      </p>
                    </div>
                    <div className="group p-6 md:p-8 bg-[#002147]/[0.02] rounded-2xl md:rounded-[2rem] border border-slate-100 hover:border-[#B89323]/20 transition-colors">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#B89323] text-white flex items-center justify-center text-[10px] md:text-xs">02</div>
                        <h5 className="text-xs md:text-sm font-black uppercase tracking-widest">Usage Insight</h5>
                      </div>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                        With a peak frequency of <span className="text-[#002147] font-semibold">{Math.max(...Object.values(selectedWord.yearly))}</span> in a single year, this word often defines the thematic scope of the exam&apos;s most challenging reading sections.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-200 min-h-[400px]">
                   <Clock className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-20" />
                   <p className="font-serif italic text-lg md:text-xl">Select a term to begin deep analysis</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Inter:wght@300;400;600;800&display=swap');
        
        body, html {
          font-family: 'Inter', sans-serif;
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </main>
  );
}