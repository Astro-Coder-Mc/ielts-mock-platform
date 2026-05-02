import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ChevronRight, 
  ArrowRight,
  Target,
  LineChart,
  Lightbulb,
  History,
  LayoutDashboard,
  RotateCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export default function ExamResult() {
  const navigate = useNavigate();
  const { currentExam, userAnswers, examType, clearUserAnswers } = useAppStore();

  if (!currentExam) return null;

  // Simple scoring logic for mock demo
  const results = currentExam.sections.flatMap(sec => 
    sec.questions.map(q => {
      const uAns = userAnswers.find(a => a.questionId === q.id)?.answer;
      let isCorrect = false;

      if (q.type === 'writing') {
        isCorrect = true; // Writing tasks are always considered "submitted"
      } else if (Array.isArray(q.correctAnswer) && Array.isArray(uAns)) {
        isCorrect = q.correctAnswer.length === uAns.length && 
                    q.correctAnswer.every((val, idx) => {
                      const userVal = String(uAns[idx] || '').trim().toLowerCase();
                      const correctVal = String(val).trim().toLowerCase();
                      return userVal === correctVal;
                    });
      } else if (typeof q.correctAnswer === 'string' && typeof uAns === 'string') {
        isCorrect = q.correctAnswer.trim().toLowerCase() === uAns.trim().toLowerCase();
      } else {
        isCorrect = q.correctAnswer === uAns;
      }
      
      return {
        ...q,
        userAnswer: uAns,
        isCorrect
      };
    })
  );

  const scoreData = results.filter(r => r.type !== 'writing');
  const score = scoreData.filter(r => r.isCorrect).length;
  const total = scoreData.length;
  const percentage = total > 0 ? (score / total) * 100 : 0;

  // Mock IELTS Band Calculation
  const getIELTSBand = (score: number, total: number) => {
    if (total === 0) return (6.5).toFixed(1); // Default for writing-only tests in mock
    const raw = (score / total) * 9;
    return Math.max(1, Math.min(9, Math.round(raw * 2) / 2)).toFixed(1);
  };

  const bandScore = getIELTSBand(score, total);

  const data = [
    { name: 'Correct', value: score, color: '#a855f7' },
    { name: 'Incorrect', value: total - score, color: '#f43f5e' },
  ];

  const handleRestart = () => {
    clearUserAnswers();
    navigate('/practice');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 font-sans select-none">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-6 px-4 md:px-8 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/80 dark:bg-zinc-900/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-900 shadow-xl">
                <Trophy className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Exam Complete</h1>
               <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-1">
                 {currentExam.skill} Analysis • {examType}
               </p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRestart} variant="outline" className="rounded-2xl font-black px-6 border-zinc-200 dark:border-zinc-800">
               <RotateCw className="w-4 h-4 mr-2 opacity-50" />
               Try Again
            </Button>
            <Button onClick={() => navigate('/')} className="bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 rounded-2xl font-black px-6 shadow-lg">
               Dashboard
               <LayoutDashboard className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Score Summary */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="rounded-[3rem] bg-white dark:bg-zinc-900 border-none shadow-2xl shadow-purple-500/10 overflow-hidden relative group p-10 ring-1 ring-zinc-100 dark:ring-zinc-800">
               <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10 flex flex-col items-center">
                  <div className="h-60 w-full relative mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={10}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={16}
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">{bandScore}</span>
                      <span className="text-[11px] uppercase font-black text-zinc-400 tracking-[0.25em] mt-2 italic">Band Grade</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                     <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] p-5 flex flex-col items-center border border-zinc-100 dark:border-zinc-800">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Correct</span>
                        <p className="text-3xl font-black text-emerald-500">{score}</p>
                     </div>
                     <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] p-5 flex flex-col items-center border border-zinc-100 dark:border-zinc-800">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Incorrect</span>
                        <p className="text-3xl font-black text-rose-500">{total - score}</p>
                     </div>
                  </div>

                  <div className="mt-8 w-full">
                     <div className="flex justify-between items-center px-2 mb-2 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                        <span>Success Rate</span>
                        <span>{Math.round(percentage)}%</span>
                     </div>
                     <Progress value={percentage} className="h-4 rounded-3xl" />
                  </div>
               </div>
            </Card>
          </motion.div>

          <Card className="rounded-[3rem] bg-zinc-900 dark:bg-zinc-800 text-white border-none shadow-2xl p-10 overflow-hidden relative">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-purple-400 border border-white/5 shadow-inner">
                    <Lightbulb className="w-7 h-7" />
                  </div>
                  <h3 className="font-black text-2xl tracking-tight">AI Insights</h3>
                </div>
                
                <p className="text-zinc-400 text-[15px] leading-relaxed font-medium">
                  Sizning <span className="text-white font-black underline decoration-purple-500 underline-offset-4">{currentExam.skill}</span> bo'yicha natijangiz kutilganidek. 
                  Lekin <span className="text-purple-400 font-bold">Matching</span> savollarida ko'proq xato kuzatildi. 
                </p>

                <div className="pt-6 border-t border-white/5">
                   <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl group cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                         <Target className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Focus Area</p>
                        <p className="text-[13px] font-bold mt-1">Inference Analysis</p>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto text-zinc-600" />
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* Detailed Question Review */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-purple-600 rounded-full shadow-lg shadow-purple-500/20"></div>
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 italic">Detailed Review</h2>
             </div>
             <Badge variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-400 font-black px-5 py-1.5 uppercase text-[10px] tracking-widest shadow-sm">
                Total: {total}
             </Badge>
          </div>

          <ScrollArea className="h-[calc(100vh-20rem)] rounded-[3rem] px-4 -mx-4">
            <div className="space-y-6 py-4">
               {results.map((r, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, ease: "easeOut" }}
                    key={r.id}
                  >
                    <Card className={`rounded-[2.5rem] border-none shadow-sm ring-1 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row gap-8 p-8 group ${
                      r.isCorrect 
                        ? 'bg-white dark:bg-zinc-900 ring-zinc-100 dark:ring-zinc-800 hover:ring-emerald-400/50' 
                        : 'bg-white dark:bg-zinc-900 ring-zinc-100 dark:ring-zinc-800 hover:ring-rose-400/50'
                    }`}>
                      <div className="flex flex-col items-center shrink-0">
                         <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-xl transition-all duration-300 group-hover:scale-110 shadow-lg ${
                            r.isCorrect 
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                              : 'bg-rose-500 text-white shadow-rose-500/20'
                         }`}>
                            {i + 1}
                         </div>
                      </div>
                      
                      <div className="flex-1 space-y-8 min-w-0">
                         <div>
                            <span className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-400 group-hover:text-purple-500 transition-colors">Question Analysis</span>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 leading-tight text-xl mt-1 pr-6 tracking-tight">{r.question}</h4>
                         </div>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {r.type === 'writing' ? (
                              <div className="md:col-span-2 space-y-4">
                                <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest pl-1">Your Essay Response</p>
                                <div className="p-8 rounded-[2rem] border bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed text-sm whitespace-pre-wrap italic shadow-inner">
                                  {r.userAnswer || 'NO RESPONSE SUBMITTED'}
                                </div>
                                <Badge className="bg-purple-500 hover:bg-purple-600 rounded-full px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">Submitted for AI Evaluation</Badge>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-4">
                                   <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest pl-1">Your Submission</p>
                                   <div className={`p-5 rounded-[1.75rem] border flex items-center gap-4 transition-colors ${
                                     r.isCorrect 
                                       ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100' 
                                       : 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/50 text-rose-900 dark:text-rose-100'
                                   }`}>
                                      {r.isCorrect ? <CheckCircle2 className="w-5 h-5 shrink-0 opacity-80" /> : <XCircle className="w-5 h-5 shrink-0 opacity-80" />}
                                      <span className="font-black text-[15px] truncate">{Array.isArray(r.userAnswer) ? r.userAnswer.join(', ') : (r.userAnswer || 'NO RESPONSE')}</span>
                                   </div>
                                </div>
                                
                                {!r.isCorrect && (
                                  <div className="space-y-4">
                                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest pl-1">Target Answer</p>
                                     <div className="p-5 rounded-[1.75rem] border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 flex items-center gap-4 shadow-inner">
                                        <Target className="w-5 h-5 shrink-0 text-emerald-500" />
                                        <span className="font-black text-[15px] truncate">{Array.isArray(r.correctAnswer) ? r.correctAnswer.join(', ') : r.correctAnswer}</span>
                                     </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                         <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[2rem] flex gap-5 border border-zinc-100/50 dark:border-zinc-800 transition-all duration-500 group-hover:bg-white dark:group-hover:bg-zinc-900 shadow-sm relative overflow-hidden">
                            <div className="w-1.5 h-full absolute left-0 top-0 bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                               <Info className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="flex-1 pr-4">
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Explanatory Context</p>
                               <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold italic">
                                 {r.explanation || 'Qidiruv natijalariga ko\'ra ushbu savol matnning 2-qismida aniq ko\'rsatilgan dalillarga tayangan.'}
                               </p>
                            </div>
                         </div>
                      </div>
                    </Card>
                  </motion.div>
               ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}

