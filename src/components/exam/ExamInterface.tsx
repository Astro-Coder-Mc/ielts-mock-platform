import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Volume2, 
  Highlighter, 
  Info,
  Clock,
  LayoutGrid,
  SendHorizontal,
  Bookmark,
  Flag,
  ArrowLeft
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Card } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function ExamInterface() {
  const navigate = useNavigate();
  const { currentExam, userAnswers, setUserAnswer, toggleMarkForReview, clearUserAnswers } = useAppStore();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentExam?.duration || 3600);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasAudioFinished, setHasAudioFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleAudioPlay = () => {
    if (hasAudioFinished) {
      alert("This audio can only be played once.");
      return;
    }
    setIsAudioPlaying(true);
  };

  const handleAudioEnd = () => {
    setIsAudioPlaying(false);
    setHasAudioFinished(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentSection = currentExam?.sections[currentSectionIndex];
  if (!currentExam || !currentSection) return null;

  const totalQuestions = currentExam.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
  const answeredQuestions = userAnswers.filter(a => a.answer !== '').length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleSubmit = () => {
    navigate('/practice/results');
  };

  const scrollToQuestion = (id: string) => {
    const el = questionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = 'rgba(168, 85, 247, 0.2)'; // purple-500 with opacity
      span.className = 'highlight-span border-b-2 border-purple-400';
      range.surroundContents(span);
      selection.removeAllRanges();
    }
  };

  const clearHighlights = () => {
    const spans = document.querySelectorAll('.highlight-span');
    spans.forEach(span => {
      const parent = span.parentNode;
      while (span.firstChild) parent?.insertBefore(span.firstChild, span);
      parent?.removeChild(span);
    });
  };

  const isTimeCritical = timeLeft < 300; // < 5 mins

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Sticky Header */}
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="hidden md:block">
            <h1 className="text-sm font-black tracking-tight uppercase">{currentExam.title}</h1>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="text-[9px] font-black">{currentExam.skill.toUpperCase()}</Badge>
               <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Live Session</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl hidden lg:flex items-center gap-6 px-12">
            <div className="flex flex-col items-center gap-1.5 flex-1">
               <div className="flex justify-between w-full text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                 <span>Exam Progress</span>
                 <span>{answeredQuestions}/{totalQuestions} Answered</span>
               </div>
               <Progress value={progress} className="h-2 rounded-full" />
            </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 shadow-sm ${
            isTimeCritical ? 'bg-red-500 text-white animate-pulse scale-105' : 'bg-zinc-900 dark:bg-zinc-800 text-white'
          }`}>
            <Timer className={`w-4 h-4 ${isTimeCritical ? 'text-white' : 'text-purple-400'}`} />
            <span className="font-mono font-black text-lg">{formatTime(timeLeft)}</span>
          </div>

          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl px-6 shadow-lg shadow-purple-500/20"
            onClick={handleSubmit}
          >
            Submit
            <SendHorizontal className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Content (Reading Text or Listening Player) */}
        <div className="w-1/2 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden relative">
          <div className="h-12 px-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
            <Badge className="bg-zinc-900 border-none text-[10px] uppercase font-black">{currentSection.title}</Badge>
            {currentExam.skill === 'Reading' && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleHighlight} className="h-8 text-xs font-bold text-zinc-500 hover:text-purple-600">
                  <Highlighter className="w-3.5 h-3.5 mr-1.5" />
                  Highlight
                </Button>
                <Button variant="ghost" size="sm" onClick={clearHighlights} className="h-8 text-xs font-bold text-zinc-500 hover:text-red-500">
                  Clear
                </Button>
              </div>
            )}
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-8 lg:p-16 max-w-2xl mx-auto">
              {currentExam.skill === 'Reading' ? (
                <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-200 font-serif" id="reading-content">
                  {currentSection.content?.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-8">{para}</p>
                  ))}
                </div>
              ) : currentExam.skill === 'Writing' ? (
                <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-200 font-serif">
                   {currentSection.content?.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-8">{para}</p>
                  ))}
                </div>
              ) : currentExam.skill === 'Listening' ? (
                <div className="flex flex-col items-center justify-center space-y-10 py-20">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-40 h-40 rounded-[2.5rem] bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-2xl relative"
                  >
                    <Volume2 className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                    {isAudioPlaying && (
                       <motion.div 
                         initial={{ scale: 1, opacity: 0.5 }}
                         animate={{ scale: 1.5, opacity: 0 }}
                         transition={{ repeat: Infinity, duration: 1.5 }}
                         className="absolute inset-0 rounded-[2.5rem] bg-purple-400"
                       />
                    )}
                  </motion.div>
                  
                  <div className="text-center space-y-3 max-w-sm">
                    <h2 className="text-2xl font-black tracking-tight">Audio is Active</h2>
                    <p className="text-zinc-500 font-medium leading-relaxed">Please listen carefully. The audio will play only <span className="text-red-500 font-bold">once</span> and you cannot rewind or pause permanently.</p>
                  </div>
                  
                  <Card className="w-full max-w-md bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2rem] border-zinc-100 dark:border-zinc-800 shadow-inner">
                    <audio 
                      ref={audioRef}
                      src={currentSection.audioUrl}
                      onPlay={handleAudioPlay}
                      onEnded={handleAudioEnd}
                      controls={!hasAudioFinished}
                      controlsList="nodownload noplaybackrate"
                      className="w-full accent-purple-600"
                    />
                    {hasAudioFinished && (
                      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl text-[10px] font-black text-center border border-red-100 dark:border-red-900/30 uppercase tracking-widest">
                        Audio playback closed
                      </div>
                    )}
                  </Card>
                  
                  <div className="flex items-start gap-3 max-w-xs bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 dark:text-amber-400 font-bold leading-normal italic">Ensure your headphones are secure and volume levels are calibrated before starting questions.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>

        {/* Right Pane: Questions */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
          <div className="h-12 px-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Question {answeredQuestions + 1} of {totalQuestions}
            </span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))} disabled={currentSectionIndex === 0}>
                  <ChevronLeft className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => setCurrentSectionIndex(prev => Math.min(currentExam.sections.length - 1, prev + 1))} disabled={currentSectionIndex === currentExam.sections.length - 1}>
                  <ChevronRight className="w-4 h-4" />
               </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="max-w-xl mx-auto p-8 lg:p-16 space-y-20 pb-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSectionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-20"
                >
                  {currentSection.questions.map((q, idx) => {
                    const answerObj = userAnswers.find(a => a.questionId === q.id);
                    const isMarked = answerObj?.isMarkedForReview;
                    
                    return (
                      <div 
                        key={q.id} 
                        ref={(el) => { questionRefs.current[q.id] = el; }}
                        className="space-y-8 scroll-mt-20"
                      >
                        <div className="relative">
                          {q.groupTitle && (
                            <div className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-xl inline-block border border-purple-100 dark:border-purple-800">
                              {q.groupTitle}
                            </div>
                          )}
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex gap-4">
                              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 text-white font-black text-sm shrink-0">
                                {idx + 1}
                              </span>
                              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight pr-8">{q.question}</h3>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleMarkForReview(q.id)}
                              className={`rounded-xl h-8 px-3 shrink-0 ${isMarked ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : 'text-zinc-400 hover:text-zinc-900'}`}
                            >
                              <Flag className={`w-3.5 h-3.5 mr-2 ${isMarked ? 'fill-current' : ''}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{isMarked ? 'Marked' : 'Review'}</span>
                            </Button>
                          </div>
                        </div>

                        <div className="pl-12">
                          {q.type === 'multiple-choice' && (
                            <RadioGroup 
                              value={(userAnswers.find(a => a.questionId === q.id)?.answer as string) || ''}
                              onValueChange={(val) => setUserAnswer(q.id, val)}
                              className="grid grid-cols-1 gap-3"
                            >
                              {q.options?.map((opt) => (
                                <div key={opt} className={`group flex items-center space-x-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                                  userAnswers.find(a => a.questionId === q.id)?.answer === opt 
                                    ? 'border-purple-500 bg-purple-500/10 shadow-sm ring-1 ring-purple-500/50' 
                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50/30'
                                }`}>
                                  <RadioGroupItem value={opt} id={`${q.id}-${opt}`} className="text-purple-600" />
                                  <Label htmlFor={`${q.id}-${opt}`} className="flex-1 font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer leading-normal group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{opt}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}

                          {q.type === 'fill-blank' && (
                            <div className="space-y-2 max-w-sm">
                              <Input 
                                placeholder="Write your response..."
                                value={userAnswers.find(a => a.questionId === q.id)?.answer as string || ''}
                                onChange={(e) => setUserAnswer(q.id, e.target.value)}
                                className="h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 font-bold bg-white dark:bg-zinc-900 text-lg focus:ring-purple-500 shadow-inner"
                              />
                              <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] px-2 italic">Standard IELTS writing format</p>
                            </div>
                          )}

                          {q.type === 'writing' && (
                            <div className="space-y-4">
                              <textarea 
                                placeholder="Start writing your essay here..."
                                value={userAnswers.find(a => a.questionId === q.id)?.answer as string || ''}
                                onChange={(e) => setUserAnswer(q.id, e.target.value)}
                                className="w-full min-h-[400px] p-6 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed text-lg shadow-inner resize-none"
                              />
                              <div className="flex items-center justify-between px-4">
                                <Badge variant="secondary" className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800">
                                  Word Count: {((userAnswers.find(a => a.questionId === q.id)?.answer as string) || '').trim().split(/\s+/).filter(Boolean).length}
                                </Badge>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Words are updated automatically</p>
                              </div>
                            </div>
                          )}

                          {q.type === 'dropdown' && (
                            <div className="space-y-2 max-w-sm">
                              <select 
                                className="w-full h-14 px-5 rounded-[1.25rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none font-bold text-zinc-800 dark:text-zinc-100 shadow-sm"
                                value={userAnswers.find(a => a.questionId === q.id)?.answer as string || ''}
                                onChange={(e) => setUserAnswer(q.id, e.target.value)}
                              >
                                <option value="" disabled className="text-zinc-400">Choose best option...</option>
                                {q.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {q.type === 'matching' && (
                            <div className="space-y-4">
                              {q.options?.map((opt, oIdx) => {
                                const currentAns = (userAnswers.find(a => a.questionId === q.id)?.answer as string[]) || [];
                                return (
                                  <div key={opt} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-900">
                                    <span className="text-xs font-black text-zinc-600 dark:text-zinc-400 flex-1 uppercase tracking-wider">{opt}</span>
                                    <select 
                                      className="md:w-56 h-12 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-black shadow-inner"
                                      value={currentAns[oIdx] || ''}
                                      onChange={(e) => {
                                        const newAns = [...currentAns];
                                        newAns[oIdx] = e.target.value;
                                        setUserAnswer(q.id, newAns);
                                      }}
                                    >
                                      <option value="">Match Choice...</option>
                                      {q.options?.map(choice => (
                                        <option key={choice} value={choice}>{choice}</option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <footer className="h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-4 md:px-8 flex items-center shrink-0 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-zinc-100 dark:border-zinc-800 hidden md:flex">
             <LayoutGrid className="w-4 h-4 text-zinc-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Map</span>
          </div>
          
          <div className="flex-1 flex gap-2 overflow-x-auto py-2 no-scrollbar px-1">
            {currentExam.sections.flatMap(s => s.questions).map((q, i) => {
              const ans = userAnswers.find(a => a.questionId === q.id);
              const isAnswered = ans && (Array.isArray(ans.answer) ? ans.answer.some(v => v !== '') : ans.answer !== '');
              const isMarked = ans?.isMarkedForReview;
              const isActive = currentSection.questions.some(sq => sq.id === q.id);

              return (
                <TooltipProvider key={q.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                            const sectionIdx = currentExam.sections.findIndex(s => s.questions.some(sq => sq.id === q.id));
                            if (sectionIdx !== -1) {
                                setCurrentSectionIndex(sectionIdx);
                                setTimeout(() => scrollToQuestion(q.id), 100);
                            }
                        }}
                        className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-xs font-black transition-all duration-200 border-2 ${
                          isActive ? 'scale-110 border-blue-500 dark:border-blue-400' : 'border-transparent'
                        } ${
                          isMarked 
                            ? 'bg-amber-100 border-amber-400 text-amber-900' 
                            : isAnswered 
                              ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20' 
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-zinc-900 border-none text-white text-[10px] font-black px-2 py-1 rounded-lg">
                      {isMarked ? 'MARKED' : isAnswered ? 'DONE' : 'PENDING'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          
          <div className="hidden lg:flex items-center gap-6 shrink-0 pl-6 border-l border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-glow"></div>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Done</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Review</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Left</span>
                </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
