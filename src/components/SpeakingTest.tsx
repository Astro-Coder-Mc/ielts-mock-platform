import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2, Bot, User, Award, CheckCircle2, TrendingUp, AlertCircle, RefreshCw, Volume2, MicOff, Settings, Info, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { getSpeakingFeedback, SpeakingFeedback } from '../services/geminiService';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function SpeakingTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: "Hello! I am your AI examiner. Let's start the speaking test. Could you tell me a little bit about your hometown?" }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isProcessing]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
    }
    
    speakText(conversation[0].text);
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (isAudioEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    setTranscript('');
    setIsRecording(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (!transcript.trim()) return;

    const userText = transcript.trim();
    const newConversation = [...conversation, { role: 'user' as const, text: userText }];
    setConversation(newConversation);
    setIsProcessing(true);
    historyRef.current += `User: ${userText}\n`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an IELTS speaking examiner. The user just said: "${userText}". 
        Previous history: ${conversation.map(c => `${c.role}: ${c.text}`).join('\n')}
        Respond naturally as an examiner, ask a relevant follow-up question about the topic, and keep it brief (under 30 words).`,
      });

      const aiResponseText = response.text || "I see. Tell me more about that.";
      setConversation([...newConversation, { role: 'ai', text: aiResponseText }]);
      speakText(aiResponseText);
    } catch (error) {
      console.error("AI API Error:", error);
      setConversation([...newConversation, { role: 'ai', text: "I'm sorry, I didn't catch that. Could you repeat?" }]);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const generateFeedback = async () => {
    setIsFinishing(true);
    try {
      const fullTranscript = conversation
        .filter(c => c.role === 'user')
        .map(c => c.text)
        .join(' ');
      
      const result = await getSpeakingFeedback(fullTranscript);
      setFeedback(result);
      setTestCompleted(true);
    } catch (error) {
      console.error("Feedback Generation Error:", error);
      alert("Failed to generate feedback. Please try again.");
    } finally {
      setIsFinishing(false);
    }
  };

  const restartTest = () => {
    setConversation([{ role: 'ai', text: "Hello! I am your AI examiner. Let's start the speaking test. Could you tell me a little bit about your hometown?" }]);
    setFeedback(null);
    setTestCompleted(false);
    setTranscript('');
    historyRef.current = "";
    speakText("Hello! I am your AI examiner. Let's start the speaking test. Could you tell me a little bit about your hometown?");
  };

  if (testCompleted && feedback) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans">
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-100 pb-8 mb-8 gap-6">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Speaking Assessment</h2>
                <p className="text-zinc-500 mt-2 font-medium">Official IELTS evaluation criteria applied.</p>
              </div>
              <div className="bg-indigo-600 text-white p-6 rounded-[2rem] text-center min-w-[140px] shadow-lg shadow-indigo-600/20">
                 <div className="text-[10px] font-bold opacity-70 mb-1 uppercase tracking-widest">Estimated Band</div>
                 <div className="text-5xl font-bold leading-none">{feedback.band.toFixed(1)}</div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { l: 'Fluency & Coherence', v: feedback.fluency, c: 'indigo' },
                { l: 'Lexical Resource', v: feedback.lexical, c: 'blue' },
                { l: 'Grammar Accuracy', v: feedback.grammar, c: 'emerald' },
                { l: 'Pronunciation', v: feedback.pronunciation, c: 'amber' },
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 space-y-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className={`w-4 h-4 text-indigo-600`} />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.l}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 font-medium">{item.v}</p>
                </div>
              ))}
           </div>

           <div className="space-y-6">
              <div className="p-8 bg-zinc-900 text-white rounded-[2.5rem] space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transition-all group-hover:scale-150" />
                <h3 className="font-bold text-lg flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Key Improvements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedback.tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-white/30 transition-colors">
                      <span className="text-xs font-bold opacity-30 mt-1">#0{i+1}</span>
                      <p className="text-sm font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={restartTest}
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-bold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-5 h-5" />
                Start New Practice Session
              </Button>
           </div>
        </div>
      </div>

    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[750px] bg-white rounded-[3rem] shadow-2xl shadow-indigo-600/5 border border-zinc-100 overflow-hidden flex flex-col font-sans mb-12">
      {/* Test Interface Header */}
      <div className="p-6 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center">
            <Bot size={24} className="text-indigo-600" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Examiner</div>
            <div className="text-lg font-bold text-zinc-900 tracking-tight">IELTS Speaking Core</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2.5 rounded-xl transition-all ${isAudioEnabled ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-400'}`}
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <MicOff size={20} />}
          </button>
          <div className="h-8 w-px bg-zinc-200" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 border border-zinc-100 bg-white rounded-xl shadow-sm">
               <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'}`} />
               <span className="text-xs font-bold text-zinc-600 tracking-tight uppercase">Live Audio</span>
            </div>
            
            {conversation.length > 3 && (
              <button 
                onClick={generateFeedback}
                disabled={isFinishing || isProcessing}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-zinc-900/10"
              >
                {isFinishing ? (
                  <> <Loader2 className="w-3 h-3 animate-spin" /> Calculating... </>
                ) : (
                  <> <Award className="w-3 h-3" /> Get Band Score </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-8 space-y-10 overflow-y-auto bg-white/50 scroll-smooth custom-scrollbar"
      >
        <AnimatePresence>
          {conversation.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'ai' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-zinc-400 border-zinc-100'}`}>
                {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`space-y-2 max-w-[75%] ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                 <div className={`text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1`}>
                    {msg.role === 'ai' ? 'Official Examiner' : 'Candidate'}
                 </div>
                 <div className={`p-6 rounded-[2rem] shadow-xl shadow-zinc-200/20 border transition-all ${msg.role === 'ai' ? 'bg-white border-zinc-100 text-zinc-700' : 'bg-indigo-50 border-indigo-100 text-indigo-900'}`}>
                    <p className="text-base font-medium leading-relaxed tracking-tight">{msg.text}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <div className="flex gap-6 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm border border-indigo-500">
              <Bot size={18} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                 <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                 <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
              </div>
              <span className="text-xs font-bold text-indigo-600/50 uppercase tracking-widest">Analyzing your response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input / Control Bar */}
      <div className="p-10 border-t border-zinc-100 bg-zinc-50 relative overflow-hidden">
        <div className="flex flex-col items-center gap-8">
          <AnimatePresence>
            {transcript && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="w-full max-w-2xl p-6 bg-white rounded-3xl border border-indigo-100 text-center italic text-sm text-indigo-900/60 shadow-lg shadow-indigo-600/5 font-medium"
               >
                 "{transcript}"
               </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center gap-12">
             <div className="hidden md:flex flex-col items-center gap-2 text-zinc-300">
                <Settings size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Setup</span>
             </div>

             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing || isFinishing}
                className={`relative flex items-center justify-center w-24 h-24 rounded-[2.5rem] transition-all shadow-2xl ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-red-500/20' 
                    : 'bg-indigo-600 text-white shadow-indigo-600/20'
                } disabled:opacity-50`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 fill-current" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
                
                {isRecording && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-[-12px] bg-red-500 rounded-[3rem] -z-10"
                  />
                )}
              </motion.button>

              <div className="hidden md:flex flex-col items-center gap-2 text-zinc-300">
                <Info size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Guide</span>
             </div>
          </div>
          
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            {isRecording ? 'Capturing your voice...' : 'Tap the microphone to speak'}
          </div>
        </div>
      </div>
    </div>
  );
}
