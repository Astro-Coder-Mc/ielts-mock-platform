import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileUp, 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Layout, 
  FileText, 
  Settings, 
  Database,
  Image as ImageIcon,
  Zap,
  ArrowRight
} from 'lucide-react';
import { parseExamFromImage } from '../services/adminService';
import { ExamData, SkillType } from '../types/exam';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'articles' | 'stats'>('create');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extradedData, setExtractedData] = useState<ExamData | null>(null);
  const [skill, setSkill] = useState<SkillType>('Reading');
  const [exams, setExams] = useState<ExamData[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const data = await parseExamFromImage(base64, skill);
        setExtractedData(data);
      } catch (err) {
        alert("Failed to process image: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveToDb = async () => {
    if (!extradedData) return;
    try {
      await addDoc(collection(db, 'exams'), {
        ...extradedData,
        createdAt: new Date().toISOString()
      });
      alert("Practice test saved successfully!");
      setExtractedData(null);
    } catch (err) {
      alert("Error saving: " + String(err));
    }
  };

  const fetchExams = async () => {
    const querySnapshot = await getDocs(collection(db, 'exams'));
    const fetchedExams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamData));
    setExams(fetchedExams);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Admin Command Center</h1>
          <p className="text-zinc-500 font-medium">Manage practices, articles, and system intelligence.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-zinc-50 border-zinc-100 text-[10px] font-black uppercase tracking-widest px-3 py-1">v4.2 PRO</Badge>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1.5" />
        </div>
      </div>

      <div className="flex gap-1 p-1.5 bg-zinc-100 rounded-2xl w-fit">
        {[
          { id: 'create', label: 'AI Builder', icon: Zap },
          { id: 'manage', label: 'Exams', icon: Database },
          { id: 'articles', label: 'Knowledge Base', icon: FileText },
          { id: 'stats', label: 'System Health', icon: Layout }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'manage') fetchExams();
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-2xl shadow-indigo-600/5 min-h-[600px] overflow-hidden">
        {activeTab === 'create' && (
          <div className="p-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black tracking-tight">Practice Intelligent Injection</h2>
                  <p className="text-zinc-500 font-medium leading-relaxed">
                    Upload a high-quality photo or PDF of an IELTS test. Our AI will extract text, questions, and answers to build a fully functional interactive test.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block px-1">Select Skill Stream</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Reading', 'Listening', 'Writing', 'Speaking', 'Shadowing', 'Typing'].map(s => (
                      <button
                        key={s}
                        onClick={() => setSkill(s as SkillType)}
                        className={`p-4 rounded-2xl border font-bold text-sm transition-all text-left flex justify-between items-center ${
                          skill === s ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-zinc-50 border-zinc-100 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {s}
                        {skill === s && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={handleImageUpload}
                    accept="image/*,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="border-4 border-dashed border-zinc-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm">
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-zinc-900">Click or drag test image</p>
                      <p className="text-xs text-zinc-500 font-medium mt-1">PNG, JPG or PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-[2.5rem] border border-zinc-100 p-8 flex flex-col h-full relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">Scan Results Console</h3>
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                </div>

                <div className="flex-1 font-mono text-[11px] text-zinc-500 overflow-y-auto max-h-[400px] custom-scrollbar">
                  {extradedData ? (
                    <pre className="whitespace-pre-wrap text-zinc-900 bg-white p-4 rounded-xl border border-zinc-200">
                      {JSON.stringify(extradedData, null, 2)}
                    </pre>
                  ) : isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                      <div className="w-12 h-1 bg-zinc-200 overflow-hidden rounded-full">
                         <div className="w-1/2 h-full bg-indigo-600 animate-[loading_1.5s_infinite]" />
                      </div>
                      <p className="font-bold text-zinc-400 uppercase tracking-widest">Processing Intelligence...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12">
                      <Database size={48} className="text-zinc-200 mb-4" />
                      <p className="text-sm font-medium">Awaiting input signal. Upload a test to begin extraction.</p>
                    </div>
                  )}
                </div>

                {extradedData && (
                  <Button 
                    onClick={handleSaveToDb}
                    className="w-full mt-6 h-14 bg-zinc-900 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-3"
                  >
                    <Save size={18} /> Confirm Injection to Database
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="p-12 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">Active Exam Directory</h2>
              <Button variant="outline" onClick={fetchExams} className="rounded-xl font-bold flex items-center gap-2">
                <Plus size={16} /> Refresh Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map(exam => (
                <div key={exam.id} className="bg-zinc-50 border border-zinc-100 p-6 rounded-[2rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1 font-black text-[10px] uppercase">{exam.skill}</Badge>
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-white rounded-lg text-zinc-400 transition-colors"><Eye size={16} /></button>
                       <button 
                        onClick={async () => {
                          if (confirm('Delete this exam?')) {
                            await deleteDoc(doc(db, 'exams', exam.id));
                            fetchExams();
                          }
                        }}
                        className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-lg tracking-tight line-clamp-1">{exam.title}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{exam.sections.length} Sections • {exam.duration / 60} Min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
             <div className="w-20 h-20 bg-zinc-50 text-zinc-300 rounded-[2rem] flex items-center justify-center">
                <FileText size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Shadowing & Article Hub</h3>
                <p className="text-zinc-500 font-medium max-w-sm">This module is planned for Phase 2. Integration with text-to-speech for shadowing is underway.</p>
             </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 p-12 gap-8">
             {[
               { label: 'Intelligence Core', val: 'Operational', status: 'optimal' },
               { label: 'Database Shards', val: '12 Active', status: 'optimal' },
               { label: 'User Node Peak', val: '42 Handshakes/s', status: 'warning' }
             ].map((s, i) => (
                <div key={i} className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{s.label}</p>
                   <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-zinc-900">{s.val}</p>
                      <div className={`w-3 h-3 rounded-full ${s.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
