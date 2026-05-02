import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, CheckSquare, Star, Coins, ArrowRight, Timer, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { mockIELTSReading, mockIELTSListening, mockIELTSWriting } from '../data/mockExam';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ExamData } from '../types/exam';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function PracticeSection({ title }: { title: string }) {
  const { examType, coins, deductCoins, setCurrentExam, clearUserAnswers } = useAppStore();
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'exams'), where('skill', '==', title));
        const querySnapshot = await getDocs(q);
        const fetchedExams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamData));
        
        // Use mock data if no exams in DB
        if (fetchedExams.length === 0) {
          const mock = title === 'Reading' ? [mockIELTSReading] : 
                       title === 'Listening' ? [mockIELTSListening] : 
                       title === 'Writing' ? [mockIELTSWriting] : [];
          setExams(mock);
        } else {
          setExams(fetchedExams);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [title]);

  const handleStartPractice = (exam: ExamData) => {
    if (coins >= 10) {
      deductCoins(10);
      clearUserAnswers();
      setCurrentExam(exam);
      navigate('/exam/session');
    } else {
      alert("Not enough coins! You need 10 coins to start a test. Redirecting to billing...");
      navigate('/billing');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total tests', value: '10', icon: CheckSquare },
          { label: 'Completed', value: '0', icon: Star },
          { label: 'Avg Band', value: '0.0', icon: Timer },
          { label: 'Highest', value: '0.0', icon: ArrowRight },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800">
            <CardContent className="p-4 md:p-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-2">{s.label}</p>
              <p className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{title} Practice</h2>
            <p className="text-zinc-500 text-sm">{examType} formati bo'yicha tayyorlangan testlar.</p>
          </div>
          
          <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl self-start md:self-auto">
            {['All', 'Part 1', 'Part 2', 'Part 3'].map((p) => (
              <button key={p} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                p === 'All' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}>{p}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Tests...</p>
             </div>
          ) : exams.map((exam, i) => {
            const durationMin = Math.floor(exam.duration / 60);
            const qCount = exam.sections.reduce((acc, s) => acc + s.questions.length, 0);

            return (
              <motion.div
                whileHover={{ y: -4 }}
                key={exam.id || i} 
                className="group bg-white dark:bg-zinc-950 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-xl tracking-tight pr-4 line-clamp-1">
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-black px-2 uppercase tracking-wide">NEW</Badge>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">by AI Engine</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800">
                      <Coins className="w-4 h-4 fill-amber-500/20" />
                      <span className="text-xs font-black">10</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${exam.id || i}`} alt="author" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 leading-none">IELTS Master AI</p>
                      <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">Premium Content</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-900/50">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400">Duration</span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5"><Clock className="w-3 h-3 text-purple-500" /> {durationMin} min</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400">Questions</span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5"><CheckSquare className="w-3 h-3 text-emerald-500" /> {qCount} Qs</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartPractice(exam)}
                    className="rounded-2xl bg-zinc-900 hover:bg-purple-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-purple-400 transition-all shadow-lg flex items-center gap-2 group-hover:px-6"
                  >
                    Start <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
