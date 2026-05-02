import React, { useState } from 'react';
import { Loader2, PenTool, CheckCircle2, AlertCircle, FileText, Zap, Info, ArrowRight } from 'lucide-react';
import { getWritingFeedback, WritingFeedback } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function WritingAI() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  const analyzeWriting = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const prompt = "Some people think that strict punishments for driving offences are the key to reducing traffic accidents. Others, however, believe that other measures would be more effective. Discuss both these views and give your own opinion.";
      const result = await getWritingFeedback(prompt, text);
      setFeedback(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Failed to analyze writing. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 bg-zinc-50 min-h-screen text-zinc-900 font-sans">
      <header className="border-b border-zinc-200 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-2 tracking-widest">IELTS Preparation Tool</div>
           <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Writing Analytics</h1>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Analysis Engine</span>
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                 <Zap className="w-4 h-4" /> AI Evaluator Ready
              </span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Practice Prompt</h3>
            <p className="text-lg font-medium leading-relaxed text-zinc-800">
              "Some people think that strict punishments for driving offences are the key to reducing traffic accidents. Others, however, believe that other measures would be more effective. Discuss both these views and give your own opinion."
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/40 flex flex-col h-[650px]">
             <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center font-semibold text-xs text-zinc-500">
                <span className="uppercase tracking-widest">Editor</span>
                <div className="flex gap-6">
                   <span className={text.split(' ').length > 250 ? 'text-emerald-600' : 'text-amber-600'}>
                     {text.trim() ? text.trim().split(/\s+/).length : 0} / 250+ Words
                   </span>
                </div>
             </div>
             <textarea
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder="Write your essay here... AI will evaluate your task response, coherence, lexical resource, and grammar."
               className="flex-1 p-10 resize-none focus:outline-none focus:ring-0 text-zinc-800 text-lg leading-relaxed font-medium bg-transparent"
             />
             <div className="p-6 border-t border-zinc-100 bg-zinc-50/30">
               <Button
                 onClick={analyzeWriting}
                 disabled={isAnalyzing || text.length < 50}
                 className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-bold text-lg shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
               >
                 {isAnalyzing ? (
                   <>
                     <Loader2 className="w-6 h-6 animate-spin" />
                     Analyzing Performance...
                   </>
                 ) : (
                   <>
                     <PenTool className="w-6 h-6" />
                     Evaluate My Essay
                   </>
                 )}
               </Button>
             </div>
          </div>
        </div>

        {/* Right Column: Feedback */}
        <div className="lg:col-span-5 sticky top-24">
           <div className="h-full bg-zinc-900 rounded-[2.5rem] text-white shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <h3 className="font-bold uppercase tracking-widest text-sm opacity-70">Assessment Report</h3>
                 <Badge variant="outline" className="text-white border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Verified AI</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-dark">
                <AnimatePresence mode="wait">
                  {feedback ? (
                    <motion.div 
                      key="feedback"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-10"
                    >
                      <div className="flex items-end justify-between border-b border-white/10 pb-8">
                         <div>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Estimated Band</div>
                            <div className="text-8xl font-black leading-none tracking-tighter">{feedback.band.toFixed(1)}</div>
                         </div>
                         <div className="text-right pb-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Target achieved</span>
                            <div className="flex gap-1 justify-end">
                               {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-6 rounded-full ${i <= 4 ? 'bg-indigo-500' : 'bg-white/10'}`} />)}
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        {[
                          { l: 'Task Response', s: feedback.taskResponse },
                          { l: 'Coherence & Cohesion', s: feedback.coherenceAndCohesion },
                          { l: 'Lexical Resource', s: feedback.lexicalResource },
                          { l: 'Grammar Accuracy', s: feedback.grammaticalRange },
                        ].map((item, i) => (
                          <div key={i} className="group">
                             <div className="flex justify-between items-center text-[10px] font-bold mb-3">
                                <span className="opacity-50 tracking-widest uppercase">{item.l}</span>
                                <span className="text-indigo-400">SCORE: {item.s.score.toFixed(1)}</span>
                             </div>
                             <div className="h-2 bg-white/5 w-full rounded-full mb-4 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(item.s.score/9)*100}%` }}
                                  className="h-full bg-indigo-500" 
                                />
                             </div>
                             <p className="text-sm font-medium text-zinc-400 leading-relaxed group-hover:text-white transition-colors">
                               {item.s.feedback}
                             </p>
                          </div>
                        ))}
                      </div>

                      <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-3">
                           <Zap className="w-5 h-5" /> Strategy Recommendations
                        </h4>
                        <ul className="space-y-4">
                          {feedback.suggestions.map((s, i) => (
                            <li key={i} className="text-sm font-medium flex gap-4 items-start border-l-2 border-indigo-500/50 pl-4 py-1">
                               <p>{s}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40 py-20"
                    >
                      <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed border-white/20 flex items-center justify-center">
                         <FileText className="w-12 h-12" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-bold uppercase tracking-widest">Ready for Evaluation</p>
                        <p className="text-xs max-w-[250px] font-medium leading-relaxed">Submit your essay once you have completed at least 50 words.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </div>

  );
}
