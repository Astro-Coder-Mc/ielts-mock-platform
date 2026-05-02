/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PracticeLayout from './components/PracticeLayout';
import PracticeSection from './components/PracticeSection';
import SpeakingTest from './components/SpeakingTest';
import WritingAI from './components/WritingAI';
import AdminPanel from './components/AdminPanel';
import AntiCheatWrapper from './components/AntiCheatWrapper';
import StudyToolsLayout from './components/StudyToolsLayout';
import Billing from './components/Billing';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">{title}</h1>
      <div className="bg-white rounded-3xl p-8 border border-zinc-200 text-zinc-500">
        Bu sahifa hozircha ishlab chiqilmoqda. Asosiy e'tibor Dashboard, Practice va Study Tools qismlariga qaratilgan.
      </div>
    </div>
  );
}

import ExamInterface from './components/exam/ExamInterface';
import ExamResult from './components/exam/ExamResult';
import AuthBot from './components/AuthBot';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const user = useAppStore((state) => state.user);

  if (!user) {
    return <AuthBot />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="practice" element={<PracticeLayout />}>
            <Route index element={<Navigate to="listening" replace />} />
            <Route path="listening" element={<PracticeSection title="Listening" />} />
            <Route path="reading" element={<PracticeSection title="Reading" />} />
            <Route path="writing" element={<WritingAI />} />
            <Route path="speaking" element={
              <AntiCheatWrapper onTerminate={() => alert("Test to'xtatildi! Qoidabuzarlik aniqlandi.")}>
                <SpeakingTest />
              </AntiCheatWrapper>
            } />
            <Route path="full-mock" element={<PracticeSection title="Full Mock" />} />
          </Route>

          <Route path="study-tools" element={<StudyToolsLayout />}>
            <Route index element={<Navigate to="articles" replace />} />
            <Route path="articles" element={<PlaceholderPage title="Articles" />} />
            <Route path="shadowing" element={<PracticeSection title="Shadowing" />} />
            <Route path="typing" element={<PracticeSection title="Typing" />} />
            <Route path="writing-samples" element={<PlaceholderPage title="Writing Samples" />} />
            <Route path="live-chat" element={<PlaceholderPage title="Live Chat" />} />
          </Route>
          
          <Route path="billing" element={<Billing />} />
          <Route path="admin" element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/" replace />} />
        </Route>

        {/* Full-screen Exam Routes */}
        <Route path="/exam/session" element={
          <AntiCheatWrapper onTerminate={() => alert("Test to'xtatildi! Qoidabuzarlik aniqlandi.")}>
            <ExamInterface />
          </AntiCheatWrapper>
        } />
        <Route path="/practice/results" element={<ExamResult />} />
      </Routes>
    </BrowserRouter>
  );
}

