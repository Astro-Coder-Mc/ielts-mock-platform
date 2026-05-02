import React from 'react';
import Modal from './Modal';
import { useAppStore } from '../../store/useAppStore';
import { Lock } from 'lucide-react';

export default function ChangePasswordModal() {
  const { isPasswordModalOpen, setPasswordModalOpen } = useAppStore();

  return (
    <Modal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Change password">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Current password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-4 h-4" />
            </span>
            <input type="password" placeholder="Enter your current password" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">New password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-4 h-4" />
            </span>
            <input type="password" placeholder="Enter your new password" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-4 h-4" />
            </span>
            <input type="password" placeholder="Enter your new password again" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
          </div>
        </div>

        <button className="w-full py-3 mt-4 rounded-lg text-white font-medium bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 transition-opacity">
          Save
        </button>
      </div>
    </Modal>
  );
}
