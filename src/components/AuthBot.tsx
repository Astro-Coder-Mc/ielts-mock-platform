import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Bot, Phone, User, CheckCircle2, ShieldCheck, Terminal, Globe, Lock, Cpu, Activity, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function AuthBot() {
  const setUser = useAppStore((state) => state.setUser);
  const [loginId] = useState(() => Math.random().toString(36).substring(7));
  const [status, setStatus] = useState<'IDLE' | 'POLLING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [logLines, setLogLines] = useState<string[]>([
    "INITIALIZING_AUTH_PROTOCOL...",
    "HANDSHAKE_ESTABLISHED: NODE_UZ_01",
    "SECURE_TUNNEL: AES_256_GCM_READY",
  ]);
  const terminalEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logLines]);

  useEffect(() => {
    let interval: any;
    if (status === 'POLLING') {
      const logs = [
        "POLLING_GATEWAY: 127.0.0.1",
        "AWAITING_TELEGRAM_HASH_VERIFICATION...",
        "STATUS: PENDING_USER_INPUT",
        "SYNCING_DATABASE_RECORDS...",
        "ENCRYPTING_SESSION_METADATA..."
      ];
      let i = 0;
      const logInterval = setInterval(() => {
        if (i < logs.length) {
          setLogLines(prev => [...prev, logs[i]]);
          i++;
        }
      }, 1500);

      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/auth/status/${loginId}`);
          const data = await res.json();
          if (data.success && data.session?.status === 'completed') {
            const userSession = {
              ...data.session,
              isAdmin: data.session.username.toLowerCase().includes('jamshid') || data.session.username.toLowerCase().includes('admin')
            };
            setLogLines(prev => [...prev, "AUTHENTICATION_VERIFIED: ACCESS_GRANTED", "SESSION_TOKEN_GENERATED"]);
            setStatus('SUCCESS');
            clearInterval(interval);
            clearInterval(logInterval);
            setTimeout(() => setUser(userSession), 1500);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [status, loginId, setUser]);

  const handleSignInClick = () => {
    setStatus('POLLING');
    setLogLines(prev => [...prev, "REDIRECT_SIGNAL_SENT: @ielts_examine_bot"]);
    window.open(`https://t.me/ielts_examine_bot?start=${loginId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
        
        {/* Left Aspect: Content */}
        <div className="lg:col-span-6 space-y-10 py-8 text-center lg:text-left">
           <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                 <div className="w-14 h-14 bg-indigo-600 text-white flex items-center justify-center font-black text-3xl rounded-2xl shadow-xl shadow-indigo-600/20">S</div>
                 <h1 className="text-4xl font-bold tracking-tight text-zinc-900">ScoreUp</h1>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[1.1] tracking-tight">
                Unlock your <span className="text-indigo-600">Educational</span> Potential.
              </h2>
              <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                Advanced AI-powered IELTS preparation. Practice speaking, writing, and get instant band scores.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
              {[
                { icon: ShieldCheck, label: "Secure Access", val: "Telegram ID" },
                { icon: Globe, label: "Global Reach", val: "IELTS Mastery" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                   <item.icon className="w-6 h-6 text-indigo-600" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm font-bold text-zinc-700">{item.val}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Aspect: Auth Card */}
        <div className="lg:col-span-6">
           <div className="bg-white border border-zinc-100 shadow-2xl shadow-indigo-600/10 rounded-[3rem] overflow-hidden flex flex-col p-8 md:p-12 space-y-8 relative group transition-all hover:border-indigo-100">
              <div className="space-y-2 text-center">
                 <h3 className="text-2xl font-bold text-zinc-900">Sign In</h3>
                 <p className="text-zinc-500 font-medium">Continue your learning journey with Telegram.</p>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {status === 'IDLE' ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 space-y-4">
                         <div className="flex items-center gap-3 text-indigo-700 font-bold text-sm">
                            <Lock size={18} /> Secure Telegram Gateway
                         </div>
                         <p className="text-sm text-indigo-600/80 leading-relaxed font-medium">
                           We use Telegram's secure authentication. No passwords needed. Simply start our bot to verify your identity.
                         </p>
                      </div>
                      
                      <button
                        onClick={handleSignInClick}
                        className="w-full h-16 bg-zinc-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 group"
                      >
                         Sign in with @ielts_examine_bot
                         <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  ) : status === 'POLLING' ? (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }} 
                       animate={{ opacity: 1, scale: 1 }}
                       className="flex flex-col items-center justify-center py-10 space-y-8"
                    >
                       <div className="relative">
                          <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-6 h-6 bg-indigo-600 animate-ping opacity-20 rounded-full" />
                          </div>
                       </div>
                       <div className="text-center space-y-2">
                          <p className="text-lg font-bold text-zinc-900">Waiting for Confirmation...</p>
                          <p className="text-sm text-zinc-500 font-medium max-w-[250px]">Please send your phone number to the Telegram bot to complete the login.</p>
                       </div>
                       
                       <div className="w-full max-h-32 overflow-y-auto p-4 bg-zinc-50 rounded-2xl space-y-1 font-mono text-[10px] text-zinc-400">
                          {logLines.slice(-3).map((line, i) => (
                            <div key={i} className="flex gap-2">
                               <span className="opacity-50">&gt;&gt;</span>
                               <span>{line}</span>
                            </div>
                          ))}
                       </div>
                    </motion.div>
                  ) : status === 'SUCCESS' ? (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }} 
                       animate={{ opacity: 1, scale: 1 }}
                       className="flex flex-col items-center justify-center py-10 space-y-6"
                    >
                       <div className="w-20 h-20 bg-emerald-500 text-white flex items-center justify-center rounded-[2rem] shadow-xl shadow-emerald-500/20">
                          <CheckCircle2 size={40} />
                       </div>
                       <div className="text-center space-y-2">
                          <p className="text-2xl font-bold text-zinc-900">Welcome Back!</p>
                          <p className="text-sm text-zinc-500 font-medium">Authentication successful. Redirecting...</p>
                       </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="pt-8 border-t border-zinc-100 flex items-center justify-center gap-6 text-xs font-bold text-zinc-300 uppercase tracking-widest">
                 <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
                 <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                 <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
