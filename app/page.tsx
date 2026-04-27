"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Search, TrendingUp, Award, Clock, BookOpen, ExternalLink, Filter } from 'lucide-react';

interface WordData {
  word: string;
  count: number;
  tags: string[];
  yearly: Record<string, number>;
}

const tagColors: Record<string, string> = {
  "考研": "bg-indigo-50 text-indigo-600 border-indigo-100",
  "六级": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "托福": "bg-amber-50 text-amber-600 border-amber-100",
  "SAT": "bg-rose-50 text-rose-600 border-rose-100",
  "其他": "bg-slate-50 text-slate-500 border-slate-100"
};

export default function KaoyanDashboard() {
  const [data, setData] = useState<WordData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Directly fetch from local public/data.json (fully offline after build)
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
    <main className="min-h-screen bg-[#FDFDFD] text-[#002147] selection:bg-[#D4AF37]/20">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002147 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-[1600px] mx-auto px-6 py-8 md:px-12 md:py-12">
        {/* Navbar-style Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-serif font-black mb-3 tracking-tight">
              Kaoyan <span className="text-[#D4AF37]">Lexicon</span>
            </h1>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-8 h-[1px] bg-slate-200" />
              <p className="text-sm font-light tracking-[0.1em] uppercase">1997 – 2025 Comprehensive Analysis</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-12">
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Lexicon Depth</p>
              <p className="text-3xl font-serif font-bold italic">1.2k+</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-100 hidden sm:block" />
            <div className="px-6 py-3 bg-[#002147] text-white rounded-full text-sm font-medium shadow-xl shadow-blue-900/10">
              Vercel Optimized
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Interactive Navigation */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#D4AF37] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query high-level vocabulary..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 transition-all shadow-sm text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${!selectedTag ? 'bg-[#002147] text-white shadow-lg shadow-blue-900/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${selectedTag === tag ? 'bg-[#D4AF37] text-white shadow-lg shadow-amber-600/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[calc(100vh-350px)] overflow-y-auto pr-3 space-y-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredData.map((item) => (
                  <motion.div
                    key={item.word}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedWord(item)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between group ${selectedWord?.word === item.word ? 'bg-white shadow-2xl shadow-slate-200 border border-[#D4AF37]/20 ring-1 ring-[#D4AF37]/10' : 'hover:bg-white hover:shadow-xl hover:shadow-slate-100 border border-transparent'}`}
                  >
                    <div className="space-y-2">
                      <h3 className={`text-lg font-bold tracking-tight transition-colors ${selectedWord?.word === item.word ? 'text-[#002147]' : 'text-slate-600 group-hover:text-[#002147]'}`}>{item.word}</h3>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                          <span key={tag} className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter border ${tagColors[tag] || tagColors['其他']}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black font-serif text-[#002147]/10 group-hover:text-[#D4AF37]/20 transition-colors leading-none">{item.count}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Deep Analytics View */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedWord ? (
                <motion.div 
                  key={selectedWord.word}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[2rem] p-10 md:p-14 shadow-2xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <BookOpen className="w-64 h-64 -rotate-12" />
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#D4AF37]/5 text-[#D4AF37] rounded-xl border border-[#D4AF37]/10">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Mastery Candidate</span>
                      </div>
                      <h2 className="text-7xl font-serif font-black capitalize tracking-tighter text-[#002147]">{selectedWord.word}</h2>
                      <div className="flex flex-wrap gap-3">
                        {selectedWord.tags.map(tag => (
                          <div key={tag} className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${tagColors[tag] || tagColors['其他']}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                            <span className="text-xs font-bold uppercase tracking-wider">{tag} Level</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                      <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Total Hits</p>
                        <p className="text-4xl font-serif font-black">{selectedWord.count}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Years Active</p>
                        <p className="text-4xl font-serif font-black">{Object.values(selectedWord.yearly).filter(c => c > 0).length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Historical Distribution (1997–2025)</h4>
                      </div>
                      <div className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Chronological Data</div>
                    </div>
                    
                    <div className="h-[400px] w-full -ml-8">
                      <ResponsiveContainer width="110%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f8fafc" />
                          <XAxis 
                            dataKey="year" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 11, fill: '#cbd5e1', fontWeight: 600}}
                            interval={4}
                            padding={{ left: 20, right: 20 }}
                          />
                          <YAxis hide domain={[0, 'auto']} />
                          <Tooltip 
                            cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                            labelStyle={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}
                            itemStyle={{ color: '#002147', fontWeight: 900, fontSize: '18px' }}
                            formatter={(value: number) => [`${value} occurrences`, 'Frequency']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#D4AF37" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorCount)" 
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group p-8 bg-[#002147]/[0.02] rounded-[2rem] border border-slate-100 hover:border-[#D4AF37]/20 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs">01</div>
                        <h5 className="text-sm font-black uppercase tracking-widest">Academic Strategy</h5>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed font-light">
                        Recognized as a <span className="text-[#002147] font-semibold">Tier-1 Core Term</span>. Its presence across {selectedWord.tags.join(' & ')} indicates a fundamental concept that frequently anchors complex arguments in academic passages.
                      </p>
                    </div>
                    <div className="group p-8 bg-[#002147]/[0.02] rounded-[2rem] border border-slate-100 hover:border-[#D4AF37]/20 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs">02</div>
                        <h5 className="text-sm font-black uppercase tracking-widest">Usage Insight</h5>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed font-light">
                        With a peak frequency of <span className="text-[#002147] font-semibold">{Math.max(...Object.values(selectedWord.yearly))}</span> in a single year, this word often defines the thematic scope of the exam's most challenging reading sections.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-200">
                   <Clock className="w-16 h-16 mb-4 opacity-20" />
                   <p className="font-serif italic text-xl">Select a term to begin deep analysis</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Inter:wght@300;400;600;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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
