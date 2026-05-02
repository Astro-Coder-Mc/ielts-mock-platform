import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import ProfileModal from './modals/ProfileModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import ChangeExamTypeModal from './modals/ChangeExamTypeModal';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-zinc-50 font-sans overflow-hidden">
      <TopNav />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>

      {/* Global Modals */}
      <ProfileModal />
      <ChangePasswordModal />
      <ChangeExamTypeModal />
    </div>
  );
}
