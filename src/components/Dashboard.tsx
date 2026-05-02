import React from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Award, CheckCircle2, ArrowRight, Download, Activity, Globe, Clock, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const skillData = [
  { subject: 'LISTENING', A: 85, fullMark: 100 },
  { subject: 'READING', A: 70, fullMark: 100 },
  { subject: 'WRITING', A: 60, fullMark: 100 },
  { subject: 'SPEAKING', A: 75, fullMark: 100 },
];

const progressData = [
  { name: 'Mon', score: 6.0 },
  { name: 'Tue', score: 6.5 },
  { name: 'Wed', score: 6.5 },
  { name: 'Thu', score: 7.0 },
  { name: 'Fri', score: 7.0 },
  { name: 'Sat', score: 7.5 },
  { name: 'Sun', score: 7.5 },
];

export default function Dashboard() {
  const { examType, user } = useAppStore();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
              Welcome back, {user?.username || 'Student'}! 👋
            </h1>
            <p className="text-zinc-500 mt-2 text-lg">Your {examType} preparation journey is progressing well.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-zinc-200">
              <Download className="w-4 h-4 mr-2" /> Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-600/10">
              Start Practice
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Practice', value: '24', unit: 'SESSIONS', icon: Target, color: 'blue' },
            { label: 'Improvement', value: '+1.5', unit: 'BANDS', icon: TrendingUp, color: 'emerald' },
            { label: 'Best Score', value: examType === 'IELTS' ? '7.5' : 'C1', unit: 'BAND', icon: Award, color: 'amber' },
            { label: 'Time Spent', value: '15.6', unit: 'HOURS', icon: Clock, color: 'indigo' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-xs font-medium text-zinc-400">{stat.unit}</div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-xl">Score History</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Band Score
                    </div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }} 
                        dy={10}
                      />
                      <YAxis 
                        domain={[4, 9]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#18181b', 
                          border: 'none', 
                          borderRadius: '16px', 
                          color: '#fff',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#4f46e5" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#fff', stroke: '#4f46e5', strokeWidth: 3 }} 
                        activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold">Next Steps</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { t: "Writing Strategy", sub: "Task 2: Complex Sentences", c: "indigo" },
                      { t: "Vocabulary Extension", sub: "Academic Word List", c: "amber" },
                    ].map((item, i) => (
                      <div key={i} className="group p-4 rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer">
                        <div className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{item.t}</div>
                        <div className="text-xs text-zinc-500 mt-1">{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                        <Activity className="w-4 h-4" />
                     </div>
                     <h3 className="font-bold">Recent Activity</h3>
                   </div>
                   <div className="space-y-4">
                     {[
                       { date: "Oct 24", msg: "Writing Eval: Band 7.0", s: "Success" },
                       { date: "Oct 22", msg: "Speaking Practice", s: "Done" },
                     ].map((log, i) => (
                       <div key={i} className="flex items-center gap-4">
                         <span className="text-xs font-bold text-zinc-400 w-12">{log.date}</span>
                         <div className="text-sm font-medium text-zinc-700">{log.msg}</div>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-colors" />
              <h3 className="font-bold text-lg mb-6 relative z-10">Skill Balance</h3>
              <div className="h-[250px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#818cf8"
                      strokeWidth={3}
                      fill="#818cf8"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 space-y-4 relative z-10">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-zinc-400">READINESS</span>
                    <span className="text-2xl font-bold">72%</span>
                 </div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '72%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-indigo-500" 
                    />
                 </div>
                 <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                    Focus on Writing Task 2 structure to increase your overall readiness to 80%.
                 </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Globe className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">Book a Mock Exam</h4>
              <p className="text-sm text-zinc-500 mb-6">Get a professional assessment with a real examiner.</p>
              <Button className="w-full bg-zinc-900 rounded-2xl py-6">Book Session</Button>
            </div>
          </div>
        </div>
        
        <footer className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between gap-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
           <div className="flex gap-6">
              <span className="hover:text-indigo-600 cursor-pointer">Support</span>
              <span className="hover:text-indigo-600 cursor-pointer">Guide</span>
              <span className="hover:text-indigo-600 cursor-pointer">Privacy</span>
           </div>
           <span>© 2026 ScoreUp Educational Systems</span>
        </footer>
      </div>
    </div>

  );
}
